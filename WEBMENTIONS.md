# Webmentions Setup Guide

Your site now has a complete webmentions system that automatically displays social interactions from Bluesky, Mastodon, and other platforms directly on your blog posts!

## What Are Webmentions?

Webmentions are a web standard that allows websites to notify each other when they've been mentioned or linked to. In your case, they create a bridge between your blog posts and social media interactions, bringing comments and reactions back to your site.

## How It Works

1. **You publish a post** on your site
2. **You syndicate it** to Bluesky/Mastodon using POSSE
3. **People interact** with your syndicated posts (likes, replies, reposts)
4. **Webmention.io discovers** these interactions automatically
5. **Your site displays** them as comments and reactions

## What You'll See

Your blog posts now display:

- **❤️ Likes** - Shown as a facepile of avatars
- **🔄 Reposts** - Also shown as avatars
- **💬 Replies** - Full comment threads with content
- **🔗 Mentions** - When people link to your posts elsewhere

Each interaction shows:
- The person's name and avatar
- Platform they posted from (🦋 Bluesky, 🐘 Mastodon, etc.)
- When they posted it
- A link back to the original interaction

## Current Setup

✅ **webmention.io configured** - Your site is registered  
✅ **Automatic discovery** - webmention.io finds interactions  
✅ **POSSE integration** - Syndicated posts send webmentions back  
✅ **Display component** - Shows interactions on blog posts  
✅ **Platform detection** - Identifies Bluesky, Mastodon, Twitter sources  

## Manual Testing

You can test webmentions by:

1. **Sharing a post URL** directly on social media
2. **Waiting 5-10 minutes** for webmention.io to discover it
3. **Refreshing your blog post** to see the interaction appear

## Commands

```bash
# Test webmentions for latest post
npm run webmentions:test

# Test specific post
npm run webmentions:test "post-slug-name"

# Show help
npm run webmentions:help
```

## How Interactions Are Processed

### Automatic Discovery
- webmention.io crawls social media platforms
- Finds posts that link to your site
- Converts them to webmentions
- Makes them available via API

### Your Site Fetches Them
- WebMentions component calls webmention.io API
- Loads interactions for each blog post
- Groups them by type (likes, replies, etc.)
- Displays them with proper attribution

### Platform Detection
The system automatically detects which platform interactions came from:
- **🦋 Bluesky** - bsky.app URLs
- **🐘 Mastodon** - Instance URLs with /@username patterns  
- **🐦 Twitter** - twitter.com or x.com URLs
- **🌐 Other** - Any other website

## Styling & Customization

The webmentions component includes:
- **Dark mode support** - Adapts to your site's theme
- **Responsive design** - Works on mobile and desktop
- **Avatar facepiles** - Compact display for many likes/reposts
- **Platform icons** - Visual indicators of where interactions came from
- **Proper fallbacks** - Handles missing data gracefully

## Privacy & Security

- **HTML sanitization** - Comments are cleaned of dangerous content
- **External links** - All social media links open in new tabs
- **No tracking** - webmention.io doesn't track your visitors
- **Caching** - API responses are cached to improve performance

## Troubleshooting

**No webmentions showing?**
- Make sure you've syndicated posts to social media
- Wait 10-15 minutes for webmention.io to discover them
- Check that webmention.io can access your site

**Missing interactions?**
- webmention.io only finds public posts
- Some platforms may not be supported yet
- Manual webmentions can be sent via webmention.io dashboard

**Performance issues?**
- Webmentions are cached for 5 minutes
- Consider increasing cache time for high-traffic sites
- API calls are made at build time, not by visitors

## Future Enhancements

Possible improvements:
- **Comment moderation** - Filter out unwanted interactions
- **Real-time updates** - Webhook integration for instant updates  
- **More platforms** - Support for additional social networks
- **Analytics** - Track engagement across platforms
- **Notifications** - Get notified of new interactions

## Integration with POSSE

Your webmentions work seamlessly with POSSE:
1. You publish and syndicate a post
2. The POSSE script sends webmentions to connect syndicated posts back to your original
3. When people interact with syndicated posts, webmention.io discovers them
4. Those interactions appear as comments on your original post

This creates a complete loop: publish → syndicate → collect interactions → display on your site!

## 🔄 **Update Strategies**

Webmentions are fetched at different times depending on your chosen strategy:

### **Current Setup: Build-Time (Static)**
- ✅ **Fast loading** - No API calls for visitors
- ✅ **Reliable** - Works even if webmention.io is down
- ❌ **Manual updates** - Need to rebuild to see new interactions

**How to update:**
```bash
npm run build              # Rebuild to fetch latest webmentions
npm run build:syndicate    # Rebuild + syndicate new posts
```

### **Option 1: Scheduled Rebuilds (Recommended)**
Set up automatic daily rebuilds on your hosting platform:

**Netlify:**
- Site Settings → Build Hooks → Create hook URL
- Use cron-job.org to ping the hook daily at 9 AM:
  ```
  0 9 * * * curl -X POST [your-netlify-hook-url]
  ```

**Vercel with GitHub Actions:**
```yaml
# .github/workflows/update-webmentions.yml
name: Update Webmentions
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Vercel Deploy
        run: curl -X POST ${{ secrets.VERCEL_DEPLOY_HOOK }}
```

### **Option 2: Real-Time Dynamic Loading**
Switch to client-side loading for instant updates:

**Enable dynamic webmentions:**
1. Edit `src/layouts/PostDetails.astro`
2. Change `USE_DYNAMIC_WEBMENTIONS = true`
3. Rebuild your site

**Benefits:**
- ✅ **Real-time** - Shows new interactions immediately
- ✅ **No rebuilds needed** - Always up to date
- ❌ **Slower loading** - API calls on each page visit
- ❌ **Requires JavaScript** - Won't work if JS is disabled

### **Option 3: Hybrid Approach (Best of Both)**
Use static webmentions with periodic dynamic refreshes:

1. Keep `USE_DYNAMIC_WEBMENTIONS = false` for initial load
2. Schedule daily rebuilds for new content
3. Add a "Refresh" button for manual updates

**Recommendation:** Start with **scheduled rebuilds** (Option 1) as it provides the best balance of performance and freshness for most blogs.