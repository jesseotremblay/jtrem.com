import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedPosts from "../utils/getSortedPosts";
import getSortedLinkPosts from "../utils/getSortedLinkPosts";
import { SITE } from "../config";
import { withSlug } from "../utils/getSlugFromId";

export async function GET() {
  const posts = await getCollection("blog");
  const linkPosts = await getCollection("links");
  const sortedPosts = getSortedPosts(posts).map(withSlug);
  const sortedLinkPosts = getSortedLinkPosts(linkPosts).map(withSlug);

  // Combine and sort all posts by date
  const allItems = [
    ...sortedPosts.map(({ data, slug }) => ({
      link: `${SITE.website}/posts/${slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      content: `<p>${data.description}</p>`,
    })),
    ...sortedLinkPosts.map(({ data }) => ({
      link: data.linkURL, // Use external URL as the link
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      content: `<p>${data.description}</p><p><a href="${data.linkURL}" target="_blank" rel="noopener noreferrer">Read the full article →</a></p>`,
    })),
  ].sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

  return rss({
    stylesheet: "/rss/styles.xsl",
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: allItems,
  });
}
