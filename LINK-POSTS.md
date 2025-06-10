# Link Posts Feature

This site now supports "link posts" in the style of [Daring Fireball](https://daringfireball.net/) and [Simon Willison's blog](https://simonwillison.net/). Link posts allow you to share interesting links from around the web with your own commentary, where the canonical link goes directly to the external content rather than your own post.

## How Link Posts Work

Link posts are a special type of content that:
- Link directly to external URLs as their canonical destination
- Include your commentary and thoughts about the linked content
- Display with visual indicators (external link icons) to show they're linked content
- Automatically redirect visitors to the external URL after 3 seconds when viewed directly
- Are included in your main RSS feed with external URLs as the canonical links
- Can be filtered and viewed separately on the "Linked" page

## Creating a Link Post

1. Create a new Markdown file in `src/content/links/`
2. Use the following frontmatter structure:

```yaml
---
title: "Title of the External Article"
pubDatetime: 2024-12-22T10:00:00Z
description: "Your summary or thoughts about the linked content"
tags: ["linked", "relevant", "tags"]
linkURL: "https://example.com/external-article"
canonicalURL: "https://example.com/external-article"
---

Your commentary and thoughts about the linked article go here.

This is where you can add your own perspective, analysis, or why you found this content interesting.
```

### Required Fields

- `title`: The title of the external content (or your title for it)
- `pubDatetime`: When you're publishing your link post
- `description`: Your summary or commentary about the content
- `linkURL`: The external URL being linked to
- `canonicalURL`: Should be the same as `linkURL` for proper SEO

### Optional Fields

- `tags`: Array of tags (defaults to `["linked"]`)
- `modDatetime`: Last modified date
- `ogImage`: Custom Open Graph image
- `draft`: Set to `true` to keep as draft

## File Naming

Name your link post files descriptively:
- `external-site-article-title.md`
- `interesting-tool-discovery.md`
- `simon-willison-link-blog.md`

## How Link Posts Appear

### On Individual Pages
- Show a notice that the page will redirect to the external URL
- Display the external domain being linked to
- Include an external link icon in the title
- Redirect automatically after 3 seconds (unless in iframe/preview)

### In Lists and Feeds
- Show an external link icon next to the title
- Display the external domain being linked to
- Include the same content and styling as regular posts

### In RSS Feeds
- **Main RSS feed** (`/rss.xml`): Includes both blog posts and link posts, with link posts using external URLs as canonical links
- **Link-only RSS feed** (`/linked/rss.xml`): Contains only link posts for subscribers who want just the curated links

## Navigation and Discovery

Link posts can be found:
- Mixed with regular posts on the home page
- On the dedicated "Linked" page (`/linked/`)
- In tag-based filtering (link posts appear alongside regular posts for shared tags)
- In the main RSS feed alongside regular posts
- In the dedicated linked RSS feed

## Best Practices

1. **Add Value**: Always include your own commentary, analysis, or perspective
2. **Use Descriptive Titles**: Make it clear what the linked content is about
3. **Tag Appropriately**: Use relevant tags to help categorization
4. **Credit Sources**: Mention the original author or publication when relevant
5. **Check Links**: Ensure external URLs are working before publishing

## Technical Details

- Link posts use the `links` content collection
- They have their own layout (`LinkPostDetails.astro`) with redirect functionality
- The redirect only triggers when not in an iframe (to prevent issues with previews)
- External link icons are automatically added via the Card component
- POSSE syndication will include link posts in cross-posting to social platforms

## Examples

See the sample link post at `src/content/links/simon-willison-link-blog.md` for a working example.

Link posts are perfect for:
- Sharing interesting articles with your commentary
- Highlighting useful tools or resources
- Curating content in your field of expertise
- Building a "commonplace book" of interesting finds
- Creating a reading list with your thoughts

This feature helps you participate in the broader web conversation while keeping your site as the hub for your curation and commentary.