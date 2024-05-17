---
author: Jesse Tremblay
pubDatetime: 2023-08-06T12:30:00.000Z
title: Self-hosting in 2023
slug: "self-hosting-in-2023"
featured: false
tags:
  - self-hosting
  - open-web
description: "Web hosting in 2023 is easier than it's ever been."
---

For the last year, I've been on a journey to [reclaim my corner of the internet](__GHOST_URL__/reclaiming-my-corner-of-the-internet/). I have a number of things that I want to do toward that pursuit, but it all starts with self-hosting my website, again.

I've self-hosted sites in the past, including this one. So, this didn't seem that daunting. I had moved away from this years ago out of pure laziness. Anytime I had to do server maintenance or upgrades, I would be pretty annoyed. Anytime I wanted to add support for new features & platforms that were (seemingly) regularly emerging , it seemed like a huge hassle.

I leaned on tools that were simple, but also open. Each one was purposely chosen such that if they become too expensive, hard to use or try to create lock-in, I can easily switch to something else. This is it...

[**Ghost.org**](https://ghost.org/)** for my CMS**
I chose Ghost because its a pretty simple CMS purpose built for blogging, newsletters and simple content distribution. I've also spent a lot more time with Node.js, and for the most part it just works ootb.

The [GhostCLI](https://ghost.org/docs/ghost-cli/) is pretty straight forward, so all my local development has been incredibly easy.

It certainly doesn't have the ecosystem support that Wordpress has, which comes with basically everything you would ever need for a website in 2023. I don't need all that. This is a simple, personal website. It's a blog. Ghost is great, fast & lightweight.

[**DigitalOcean.com**](https://marketplace.digitalocean.com/apps/ghost)** for my server**
I went with DigitalOcean because it was the only ootb Ghost image VPS that I could find. It's more expensive than I really want, but I don't have to deal with configuring load balancer, proxy servers etc...I don't want or need to deal with any of that.

[**Hover.com**](https://www.hover.com/)** for my domain registrar**
I've been using Hover for this domain for over a decade now, and there is no real reason to switch. It's simple to use & manage domains. No one wants to spend anytime in their domain provider, and Hover does a great job at letting me get in & out for simple changes.

[**Cloudflare**](https://cloudflare.com/)** for my DNS**
The one downside to Hover is that it doesn't support CNAME root domain configuration. So, the root is always `www`. Cloudflare makes it easy to point root at the `A` record so that my root can be [https://jtrem.com](__GHOST_URL__/). Seems trivial, but whatever, I like how much cleaner it is.

[**1Password**](https://developer.1password.com/docs/ssh)** to manage SSH keys**
I have always sucked at managing SSH keys, and doing it through terminal has always been a fraught experience. I have been using 1Password for personal password & document security for about 15 years now, and when I saw it had added SSH key support I dove right in. If I'm being honest, this took a little while to figure out because the config file documentation wasn't the best and I had to do a bunch of troubleshooting to get it to work.

Pretty simple setup.

Upon reflection, none of that was actually that hard, nor time consuming. Especially when I consider how much time I have wasted on Twitter, TikTok, YouTube & Instagram over the last 15 years. All in all it was only a few hours to set it up.

Right now I'm using an out-of-the-box theme from the Ghost marketplace, and tweaking it along the way for my needs. I am working on my own custom theme, but I'm slow at web design these days, and don't have a lot of time.

Web hosting in 2023 is easier than it's ever been. That isn't that shocking. It's still intimidating. I understand the pull to create digital presence on a big web platform. However, that gap has narrowed dramatically in the last 15 years. Self-hosting a personal site & blog can literally take a few hours with almost no maintenance. I couldn't say that a decade ago.

I railed against convenience in a [previous post](__GHOST_URL__/reclaiming-my-corner-of-the-internet/), but the reality is that some convenience is actually nice. I'm not a server admin, and I don't want to write my own CMS. I have a job. I have a family. I don't have a lot of time. Every single one of the convenience features I chose have some amount of interoperability or data portability that make it dead simple to move off of if I ever need. There is no platform lock-in. I choose these tools on the merits of their product, and as long as they stay easy, fair & open, I'll stick with them.
