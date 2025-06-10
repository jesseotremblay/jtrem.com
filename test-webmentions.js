#!/usr/bin/env node

/**
 * Test Webmentions Script
 * 
 * Usage:
 *   node test-webmentions.js                    # Test latest post
 *   node test-webmentions.js "post-slug"        # Test specific post
 */

import { fetchWebMentionsWithCache, groupWebMentions, getWebMentionCounts, isFromPlatform } from './src/utils/webmentions.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SITE_URL = process.env.SITE_URL || 'https://jtrem.com';

async function testWebMentions(slug) {
  const postUrl = `${SITE_URL}/posts/${slug}`;
  
  console.log(`🔍 Testing webmentions for: ${postUrl}`);
  console.log('⏳ Fetching webmentions...\n');
  
  try {
    const webmentions = await fetchWebMentionsWithCache(postUrl);
    
    if (webmentions.length === 0) {
      console.log('📭 No webmentions found for this post.');
      console.log('\nTo get webmentions:');
      console.log('1. Share the post URL on social media');
      console.log('2. Wait for webmention.io to discover the mentions');
      console.log('3. Or manually send a webmention to test');
      return;
    }
    
    const grouped = groupWebMentions(webmentions);
    const counts = getWebMentionCounts(webmentions);
    
    console.log(`📊 Found ${webmentions.length} total webmentions:`);
    console.log(`   ❤️  ${counts.likes} likes`);
    console.log(`   🔄 ${counts.reposts} reposts`);
    console.log(`   💬 ${counts.replies} replies`);
    console.log(`   🔗 ${grouped.mentions.length} mentions\n`);
    
    // Platform breakdown
    const platforms = {
      bluesky: webmentions.filter(m => isFromPlatform(m, 'bluesky')).length,
      mastodon: webmentions.filter(m => isFromPlatform(m, 'mastodon')).length,
      twitter: webmentions.filter(m => isFromPlatform(m, 'twitter')).length,
      other: 0
    };
    platforms.other = webmentions.length - platforms.bluesky - platforms.mastodon - platforms.twitter;
    
    console.log('📱 Platform breakdown:');
    if (platforms.bluesky > 0) console.log(`   🦋 Bluesky: ${platforms.bluesky}`);
    if (platforms.mastodon > 0) console.log(`   🐘 Mastodon: ${platforms.mastodon}`);
    if (platforms.twitter > 0) console.log(`   🐦 Twitter: ${platforms.twitter}`);
    if (platforms.other > 0) console.log(`   🌐 Other: ${platforms.other}`);
    
    // Show recent replies
    if (grouped.replies.length > 0) {
      console.log('\n💬 Recent replies:');
      grouped.replies.slice(0, 3).forEach(reply => {
        const platform = isFromPlatform(reply, 'bluesky') ? '🦋' : 
                         isFromPlatform(reply, 'mastodon') ? '🐘' : 
                         isFromPlatform(reply, 'twitter') ? '🐦' : '🌐';
        console.log(`   ${platform} ${reply.author.name}: ${reply.content?.text?.substring(0, 80) || 'No content'}...`);
      });
    }
    
    // Show recent mentions
    if (grouped.mentions.length > 0) {
      console.log('\n🔗 Recent mentions:');
      grouped.mentions.slice(0, 3).forEach(mention => {
        const platform = isFromPlatform(mention, 'bluesky') ? '🦋' : 
                         isFromPlatform(mention, 'mastodon') ? '🐘' : 
                         isFromPlatform(mention, 'twitter') ? '🐦' : '🌐';
        console.log(`   ${platform} ${mention.author.name} mentioned this post`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error fetching webmentions:', error.message);
  }
}

async function findLatestPost() {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const contentDir = path.join(process.cwd(), 'src/content/blog');
    const files = await fs.readdir(contentDir);
    const markdownFiles = files.filter(f => f.endsWith('.md'));
    
    if (markdownFiles.length === 0) {
      throw new Error('No blog posts found');
    }
    
    // Sort by filename (which includes date) and get the latest
    markdownFiles.sort().reverse();
    const latestFile = markdownFiles[0];
    
    // Extract slug from filename
    const slug = latestFile.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    return slug;
    
  } catch (error) {
    throw new Error(`Could not find latest post: ${error.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Webmentions Test Script

Usage:
  node test-webmentions.js                 # Test latest post
  node test-webmentions.js "post-slug"     # Test specific post
  node test-webmentions.js --help          # Show this help

Examples:
  node test-webmentions.js "what-operator-shows-us-about-tomorrows-web"
  node test-webmentions.js "have-an-opinion-man"

Environment variables:
  SITE_URL=https://jtrem.com
`);
    return;
  }
  
  try {
    let slug;
    
    if (args[0]) {
      slug = args[0];
    } else {
      console.log('🔍 Finding latest post...');
      slug = await findLatestPost();
      console.log(`📝 Latest post: ${slug}\n`);
    }
    
    await testWebMentions(slug);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}