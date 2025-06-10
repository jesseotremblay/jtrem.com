import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import getSortedLinkPosts from "../../utils/getSortedLinkPosts";
import { SITE } from "../../config";

export async function GET() {
  const linkPosts = await getCollection("links");
  const sortedLinkPosts = getSortedLinkPosts(linkPosts);
  
  return rss({
    stylesheet: "/rss/styles.xsl",
    title: `${SITE.title} - Linked`,
    description: "Curated links and commentary from around the web",
    site: SITE.website,
    items: sortedLinkPosts.map(({ data }) => ({
      link: data.linkURL, // Use external URL as the canonical link
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      content: `<p>${data.description}</p><p><a href="${data.linkURL}" target="_blank" rel="noopener noreferrer">Read the full article →</a></p>`,
      categories: data.tags,
    })),
  });
}