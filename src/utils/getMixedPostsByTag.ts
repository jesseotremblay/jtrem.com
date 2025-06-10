import type { CollectionEntry } from "astro:content";
import { slugifyAll } from "./slugify";
import postFilter from "./postFilter";

type MixedPost = CollectionEntry<"blog"> | CollectionEntry<"links"> | CollectionEntry<"micro">;

const getMixedPostsByTag = (posts: MixedPost[], tag: string) => {
  return posts
    .filter(postFilter)
    .filter(post => slugifyAll(post.data.tags).includes(tag))
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getMixedPostsByTag;