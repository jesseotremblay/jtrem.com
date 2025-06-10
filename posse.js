#!/usr/bin/env node

/**
 * Simple POSSE (Publish Own Site, Syndicate Everywhere) Script
 * Inspired by Molly White's approach
 * 
 * Usage:
 *   node posse.js                    # Syndicate latest post
 *   node posse.js "post-slug"        # Syndicate specific post
 *   node posse.js --help             # Show help
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  siteUrl: process.env.SITE_URL || 'https://jtrem.com',
  bluesky: {
    handle: process.env.BLUESKY_HANDLE,
    password: process.env.BLUESKY_PASSWORD,
  },
  mastodon: {
    instance: process.env.MASTODON_INSTANCE,
    accessToken: process.env.MASTODON_ACCESS_TOKEN,
  }
};

// Helper functions
function extractExcerpt(content, maxLength = 200) {
  // Remove frontmatter and markdown formatting
  const cleaned = content
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#+\s.*$/gm, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();

  const firstParagraph = cleaned.split('\n\n')[0];
  
  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }
  
  return firstParagraph.substring(0, maxLength - 3) + '...';
}

function parsePost(filename, content) {
  const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!frontmatterMatch) return null;

  const [, frontmatterStr, body] = frontmatterMatch;
  const frontmatter = {};
  
  // Parse YAML frontmatter (simple implementation)
  frontmatterStr.split('\n').forEach(line => {
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (match) {
      const [, key, value] = match;
      if (key === 'pubDatetime') {
        const dateValue = value.trim().replace(/^["']|["']$/g, '');
        frontmatter[key] = dateValue.match(/^\d{4}-\d{2}-\d{2}$/) 
          ? new Date(dateValue + 'T00:00:00') 
          : new Date(dateValue);
      } else if (key === 'draft') {
        frontmatter[key] = value === 'true';
      } else if (key === 'tags') {
        if (value.trim().startsWith('[')) {
          try {
            frontmatter[key] = JSON.parse(value);
          } catch {
            frontmatter[key] = [];
          }
        } else {
          frontmatter[key] = value.split(',').map(tag => tag.trim().replace(/^["']|["']$/g, ''));
        }
      } else {
        frontmatter[key] = value.replace(/^["']|["']$/g, '');
      }
    }
  });

  // Handle multi-line YAML arrays
  const arrayMatches = frontmatterStr.match(/^(\w+):\s*\n((?:\s+-\s+.+\n?)+)/gm);
  if (arrayMatches) {
    arrayMatches.forEach(match => {
      const [, key, arrayContent] = match.match(/^(\w+):\s*\n((?:\s+-\s+.+\n?)+)/);
      const items = arrayContent.match(/^\s+-\s+(.+)$/gm);
      if (items) {
        frontmatter[key] = items.map(item => item.replace(/^\s+-\s+/, '').replace(/^["']|["']$/g, ''));
      }
    });
  }

  const slug = filename.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
  
  return {
    slug,
    data: frontmatter,
    body,
    url: `${CONFIG.siteUrl}/posts/${slug}`
  };
}

async function findPosts() {
  const contentDir = path.join(__dirname, 'src/content/blog');
  const files = await fs.readdir(contentDir);
  const posts = [];

  for (const file of files.filter(f => f.endsWith('.md'))) {
    const content = await fs.readFile(path.join(contentDir, file), 'utf-8');
    const post = parsePost(file, content);
    if (post && !post.data.draft) {
      posts.push(post);
    }
  }

  return posts.sort((a, b) => new Date(b.data.pubDatetime) - new Date(a.data.pubDatetime));
}

async function postToBluesky(post) {
  if (!CONFIG.bluesky.handle || !CONFIG.bluesky.password) {
    console.log('⚠️  Bluesky credentials not configured');
    return false;
  }

  try {
    const { BskyAgent, RichText } = await import('@atproto/api');
    const agent = new BskyAgent({ service: 'https://bsky.social' });
    
    await agent.login({
      identifier: CONFIG.bluesky.handle,
      password: CONFIG.bluesky.password,
    });

    const excerpt = extractExcerpt(post.body, 180);
    
    // Simple format: excerpt + URL on its own line (best for link cards)
    let text = `${excerpt}\n\n${post.url}`;
    
    // Truncate if needed (Bluesky limit is 300 chars)
    if (text.length > 300) {
      const urlPart = `\n\n${post.url}`;
      const availableLength = 300 - urlPart.length - 3;
      const truncatedExcerpt = excerpt.substring(0, availableLength) + '...';
      text = `${truncatedExcerpt}${urlPart}`;
    }

    // Use RichText to ensure proper link detection
    const richText = new RichText({ text });
    await richText.detectFacets(agent);

    const response = await agent.post({
      text: richText.text,
      facets: richText.facets,
      createdAt: new Date().toISOString(),
    });

    if (response.uri) {
      const postId = response.uri.split('/').pop();
      const blueskyUrl = `https://bsky.app/profile/${CONFIG.bluesky.handle}/post/${postId}`;
      return { success: true, url: blueskyUrl };
    }
    
    return { success: false, error: 'No response data' };
  } catch (error) {
    console.log(`❌ Bluesky error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function postToMastodon(post) {
  if (!CONFIG.mastodon.instance || !CONFIG.mastodon.accessToken) {
    console.log('⚠️  Mastodon credentials not configured');
    return false;
  }

  try {
    // Simple HTTP request to Mastodon API
    const excerpt = extractExcerpt(post.body, 380);
    
    // Simple format: excerpt + URL on its own line (best for link cards)
    let text = `${excerpt}\n\n${post.url}`;
    
    // Truncate if needed (Mastodon limit is 500 chars)
    if (text.length > 500) {
      const urlPart = `\n\n${post.url}`;
      const availableLength = 500 - urlPart.length - 3;
      const truncatedExcerpt = excerpt.substring(0, availableLength) + '...';
      text = `${truncatedExcerpt}${urlPart}`;
    }

    const response = await fetch(`https://${CONFIG.mastodon.instance}/api/v1/statuses`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CONFIG.mastodon.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: text,
        visibility: 'public'
      })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, url: data.url };
    } else {
      const error = await response.text();
      console.log(`❌ Mastodon error: ${error}`);
      return { success: false, error };
    }
  } catch (error) {
    console.log(`❌ Mastodon error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function prewarmUrl(url) {
  try {
    // Make a HEAD request to ensure the URL is accessible
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.log(`⚠️  Could not prewarm URL: ${error.message}`);
    return false;
  }
}

async function sendWebMention(source, target) {
  try {
    const response = await fetch('https://webmention.io/jtrem.com/webmention', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`
    });
    
    return response.ok;
  } catch (error) {
    console.log(`⚠️  Could not send webmention: ${error.message}`);
    return false;
  }
}

async function syndicatePost(post) {
  console.log(`\n📝 Syndicating: "${post.data.title}"`);
  console.log(`🔗 Original: ${post.url}`);
  
  // Prewarm the URL to ensure it's accessible for link card generation
  console.log(`🌐 Prewarming URL...`);
  await prewarmUrl(post.url);
  
  const results = await Promise.all([
    postToBluesky(post),
    postToMastodon(post)
  ]);
  
  // Send webmentions for successful syndications
  const syndicatedUrls = [];
  results.forEach((result, index) => {
    if (result) {
      const platform = index === 0 ? 'Bluesky' : 'Mastodon';
      console.log(`✅ Posted to ${platform}`);
      if (result.url) {
        syndicatedUrls.push(result.url);
      }
    }
  });
  
  // Send webmentions to connect syndicated posts back to original
  if (syndicatedUrls.length > 0) {
    console.log(`🔗 Sending webmentions...`);
    for (const syndicatedUrl of syndicatedUrls) {
      await sendWebMention(syndicatedUrl, post.url);
    }
  }
  
  const successCount = results.filter(Boolean).length;
  console.log(`\n✨ Syndicated to ${successCount} platform(s)`);
  
  return successCount > 0;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
POSSE Syndication Script

Usage:
  node posse.js                 # Syndicate latest post
  node posse.js "post-slug"     # Syndicate specific post
  node posse.js --help          # Show this help

Environment variables needed:
  SITE_URL=https://jtrem.com
  BLUESKY_HANDLE=your-handle.bsky.social
  BLUESKY_PASSWORD=your-app-password
  MASTODON_INSTANCE=mastodon.social
  MASTODON_ACCESS_TOKEN=your-access-token
`);
    return;
  }

  try {
    const posts = await findPosts();
    
    if (posts.length === 0) {
      console.log('❌ No posts found');
      return;
    }

    let targetPost;
    
    if (args[0]) {
      // Syndicate specific post
      targetPost = posts.find(p => p.slug === args[0]);
      if (!targetPost) {
        console.log(`❌ Post "${args[0]}" not found`);
        console.log(`\nAvailable posts: ${posts.slice(0, 5).map(p => p.slug).join(', ')}`);
        return;
      }
    } else {
      // Syndicate latest post
      targetPost = posts[0];
    }

    await syndicatePost(targetPost);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}