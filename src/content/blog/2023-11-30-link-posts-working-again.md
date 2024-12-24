---
author: Jesse Tremblay
pubDatetime: 2023-11-30
title: Link Posts Working, Again
slug: "link-posts-working-again"
featured: false
tags:
  - self-hosting
  - micropost
  - open-web
  - fediverse
description: "I've finally fixed link posts on my blog. It's been broken for years. I'm so happy to have it working again."
---

My old CMS had link posts. Then I migrated to new a new CMS and they broke. I've migrated several other times.

Now, in my self-hosted [Ghost.org](https://ghost.org/) CMS, it's fixed...mostly. Right now I only have it implemented on the pages that pull in all of my content, like my main `index.hbs` page. I still need to apply this support to my post pages, but will do that soon.

It was ridiculously easy. I wish I had adopted Ghost years ago. Here is how I did it in 3 simple steps...

**Step 1:** added `#link` to every post that I wanted to show up as a link post.

**Step 2:** to each post added the canonical URL to use [Ghost's support for canonical URL's](https://ghost.org/changelog/canonical-urls/).

**Step3:** I added this [has handlebars helper](https://ghost.org/docs/themes/helpers/has/) within the loop that pulls my posts to my index page. This identifies which posts have canonical urls to display the correct link for each title type in the feed of posts on `index.hbs`.

    {{#has tag="link"}}
      <h1 class="post-title"><a href="{{canonical_url}}" style="text-decoration: underline #dfdfdf">{{title}}</a></h1>
    {{else}}
      <h1 class="post-title"><a href="{{url}}">{{title}}</a></h1>
    {{/has}}

I've been using a theme from the marketplace while I develop my own. So, I did need to hack in a way to underline the link post title url. I'll address that in the future.
