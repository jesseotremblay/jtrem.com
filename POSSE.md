# POSSE: Publish Own Site, Syndicate Everywhere

A simple implementation inspired by [Molly White's approach](https://www.citationneeded.news/posse/) to cross-posting content while maintaining ownership.

## What is POSSE?

POSSE stands for **P**ost (on) **O**wn **S**ite **S**yndicate **E**lsewhere. Instead of posting directly to social media platforms, you:

1. **Publish on your own site first** (you control the content)
2. **Syndicate copies to other platforms** with links back to the original
3. **Maintain independence** from any single platform

## Setup

### 1. Configure Credentials

Copy the environment template:
```bash
cp .env.example .env
```

Update `.env` with your credentials:

**For Bluesky:**
- Go to Settings → App Passwords
- Create a new app password
- Use your handle (e.g., `jtrem.com`) and the app password

**For Mastodon:**
- Go to Preferences → Development → New Application
- Create app with `write:statuses` scope
- Copy the access token

### 2. Test the Setup

```bash
# Show help
npm run posse:help

# Test with latest post (will show errors if credentials are wrong)
npm run posse:latest
```

## Usage

### Syndicate Latest Post
```bash
npm run posse
# or
npm run posse:latest
```

### Syndicate Specific Post
```bash
npm run posse "post-slug-name"
```

### Examples
```bash
# Syndicate your latest post
npm run posse

# Syndicate a specific post
npm run posse "what-operator-shows-us-about-tomorrows-web"
```

## How It Works

1. **Finds your posts** in `src/content/blog/`
2. **Extracts an excerpt** (removes markdown, gets first paragraph)
3. **Formats for each platform:**
   - Title + excerpt + link back to your site + hashtags
   - Respects character limits (300 for Bluesky, 500 for Mastodon)
4. **Posts to platforms** with your credentials

## Example Output

When you syndicate a post, it creates something like:

```
What Operator Shows Us About Tomorrow's Web

I've been playing with OpenAI's Operator Agent for a few days now, and it's got me thinking about how broken the web is for AI...

https://jtrem.com/posts/what-operator-shows-us-about-tomorrows-web

#ai #agents #open-web #platforms
```

## Philosophy

This approach gives you:

- ✅ **Full control** over your content (it lives on your site)
- ✅ **Platform independence** (you can add/remove platforms easily)
- ✅ **Canonical URLs** (all syndicated posts link back to your original)
- ✅ **Simplicity** (one script, manual control)
- ✅ **No vendor lock-in** (works with any platforms that have APIs)

## Troubleshooting

**"Invalid identifier or password" (Bluesky):**
- Make sure you're using an app password, not your main password
- Verify your handle is correct (e.g., `jtrem.com` not `@jtrem.com`)

**"The access token is invalid" (Mastodon):**
- Check your access token was copied correctly
- Ensure the app has `write:statuses` permission
- Verify the instance name is correct (e.g., `jtrem.me` not `https://jtrem.me`)

**"No posts found":**
- Check that your posts are in `src/content/blog/`
- Ensure posts aren't marked as `draft: true`

## Adding New Platforms

To add support for new platforms, edit `posse.js` and add a new function like `postToNewPlatform()`. The script is designed to be simple and hackable.

## Complete POSSE + Webmentions Workflow

Your site now has a complete IndieWeb setup that creates a full loop:

### 📝 **The Complete Process**
1. **Write & Publish** - Create content on your own site (you control it)
2. **Syndicate** - Cross-post to social platforms (`npm run posse`)
3. **Collect Interactions** - Webmention.io automatically finds responses
4. **Display Back Home** - Social interactions appear as comments on your original post

### 🔄 **Keeping Webmentions Updated**

**Current Setup (Build-Time):**
- Webmentions are fetched when you run `npm run build`
- Fast for visitors, but requires rebuilds to see new interactions

**Update Options:**
- **Manual**: Run `npm run build` when you want fresh webmentions
- **Scheduled**: Set up daily auto-rebuilds on Netlify/Vercel (recommended)
- **Dynamic**: Switch to real-time loading in `PostDetails.astro` (`USE_DYNAMIC_WEBMENTIONS = true`)

**For Real-Time Updates:**
```bash
# Edit src/layouts/PostDetails.astro
# Change: const USE_DYNAMIC_WEBMENTIONS = true
# Then rebuild: npm run build
```

### 🌟 **What You've Accomplished**
- ✅ Own your content (published on your domain first)
- ✅ Maintain social presence (syndicated everywhere)
- ✅ Bring conversations home (webmentions collect interactions)
- ✅ Platform independence (easy to add/remove networks)
- ✅ Rich link cards (optimized syndication format)
- ✅ Automatic attribution (all interactions link back to your site)

This is the gold standard of IndieWeb publishing - exactly what successful bloggers like Molly White use to maintain independence while staying connected to social networks.

## Credits

Inspired by [Molly White's POSSE implementation](https://www.citationneeded.news/posse/) and the broader IndieWeb movement.