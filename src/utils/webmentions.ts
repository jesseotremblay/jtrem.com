export interface WebMention {
  type: string;
  author: {
    name: string;
    url: string;
    photo: string;
  };
  url: string;
  published: string;
  wm_received: string;
  wm_id: number;
  wm_source: string;
  wm_target: string;
  content?: {
    html: string;
    text: string;
  };
  'wm-property': 'in-reply-to' | 'like-of' | 'repost-of' | 'mention-of';
}

export interface WebMentionResponse {
  type: string;
  name: string;
  children: WebMention[];
  links?: {
    first?: string;
    prev?: string;
    next?: string;
    last?: string;
  };
}

export interface GroupedWebMentions {
  likes: WebMention[];
  reposts: WebMention[];
  replies: WebMention[];
  mentions: WebMention[];
}

const WEBMENTION_IO_API = 'https://webmention.io/api';

export async function fetchWebMentions(target: string): Promise<WebMention[]> {
  try {
    const url = `${WEBMENTION_IO_API}/mentions.jf2?target=${encodeURIComponent(target)}&per-page=100`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data: WebMentionResponse = await response.json();
    return data.children || [];
  } catch (error) {
    console.error('Error fetching webmentions:', error);
    return [];
  }
}

export function groupWebMentions(webmentions: WebMention[]): GroupedWebMentions {
  const grouped: GroupedWebMentions = {
    likes: [],
    reposts: [],
    replies: [],
    mentions: []
  };

  webmentions.forEach(mention => {
    switch (mention['wm-property']) {
      case 'like-of':
        grouped.likes.push(mention);
        break;
      case 'repost-of':
        grouped.reposts.push(mention);
        break;
      case 'in-reply-to':
        grouped.replies.push(mention);
        break;
      case 'mention-of':
        grouped.mentions.push(mention);
        break;
    }
  });

  // Sort by date (newest first)
  Object.keys(grouped).forEach(key => {
    grouped[key as keyof GroupedWebMentions].sort((a, b) => 
      new Date(b.published || b.wm_received).getTime() - 
      new Date(a.published || a.wm_received).getTime()
    );
  });

  return grouped;
}

export function getWebMentionCounts(webmentions: WebMention[]): {
  likes: number;
  reposts: number;
  replies: number;
  total: number;
} {
  const grouped = groupWebMentions(webmentions);
  return {
    likes: grouped.likes.length,
    reposts: grouped.reposts.length,
    replies: grouped.replies.length,
    total: webmentions.length
  };
}

export function isFromPlatform(mention: WebMention, platform: 'mastodon' | 'bluesky' | 'twitter'): boolean {
  const source = mention.wm_source?.toLowerCase() || '';
  const authorUrl = mention.author?.url?.toLowerCase() || '';
  
  switch (platform) {
    case 'mastodon':
      // Mastodon instances typically have these patterns
      return source.includes('/@') || 
             source.includes('/users/') ||
             authorUrl.includes('/@');
    case 'bluesky':
      return source.includes('bsky.app') || 
             authorUrl.includes('bsky.app');
    case 'twitter':
      return source.includes('twitter.com') || 
             source.includes('x.com') ||
             authorUrl.includes('twitter.com') ||
             authorUrl.includes('x.com');
    default:
      return false;
  }
}

export function formatWebMentionDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function sanitizeHTML(html: string): string {
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/javascript:/gi, '');
}

export function truncateText(text: string, maxLength: number = 280): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Cache webmentions for 5 minutes to avoid excessive API calls during development
const cache = new Map<string, { data: WebMention[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchWebMentionsWithCache(target: string): Promise<WebMention[]> {
  const cached = cache.get(target);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_DURATION) {
    return cached.data;
  }
  
  const webmentions = await fetchWebMentions(target);
  cache.set(target, { data: webmentions, timestamp: now });
  
  return webmentions;
}