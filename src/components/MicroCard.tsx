import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  post: CollectionEntry<"micro">;
  content?: string;
  showContent?: boolean;
}

export default function MicroCard({ post, content, showContent = true }: Props) {
  const { pubDatetime, modDatetime } = post.data;

  return (
    <li className="my-6 h-entry micro-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-card p-author">
          <a 
            href="https://jtrem.com/" 
            className="p-name u-url text-sm font-medium text-skin-accent hover:underline"
          >
            Jesse Tremblay
          </a>
        </div>
        <span className="text-skin-muted">•</span>
        <Datetime 
          pubDatetime={pubDatetime} 
          modDatetime={modDatetime}
          size="sm"
          className="dt-published"
        />
        <a 
          href={`/micro/${post.slug}/`}
          className="u-url ml-auto text-sm text-skin-accent hover:underline"
        >
          View
        </a>
      </div>
      
      {showContent && content && (
        <div 
          className="micro-content e-content prose prose-sm max-w-none text-skin-base"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </li>
  );
}