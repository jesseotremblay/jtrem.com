/**
 * Extract slug from content collection id
 * In Astro 6, id is the file path relative to the collection folder
 * e.g., "my-post.md" or "subfolder/my-post.md"
 */
export function getSlugFromId(id: string): string {
  // Remove file extension (.md or .mdx)
  return id.replace(/\.(md|mdx)$/i, "");
}

/**
 * Get a slug-like id for a collection entry
 * This maintains backward compatibility with Astro 5's slug property
 */
export function withSlug<T extends { id: string }>(entry: T): T & { slug: string } {
  return {
    ...entry,
    slug: getSlugFromId(entry.id),
  };
}