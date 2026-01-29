import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";

export interface Props {
  href?: string;
  frontmatter: any;
  secHeading?: boolean;
  isLinkPost?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true, isLinkPost = false }: Props) {
  const { title, pubDatetime, modDatetime, description } = frontmatter;
  const linkURL = 'linkURL' in frontmatter ? frontmatter.linkURL : undefined;
  
  // For link posts, use the external linkURL if available, otherwise fall back to href
  const finalHref = isLinkPost && linkURL ? linkURL : href;
  
  // Extract domain from linkURL for display
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6 h-entry">
      {isLinkPost && linkURL && (
        <div className="flex items-center gap-2 text-sm text-skin-muted mb-2">
          <span>Links to: {getDomain(linkURL)}</span>
        </div>
      )}
      <a
        href={finalHref}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0 u-url"
        {...(isLinkPost && linkURL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {secHeading ? (
          <h2 {...headerProps} className={`${headerProps.className} p-name`}>
            {title}
            {isLinkPost && linkURL && (
              <svg 
                className="inline ml-1 w-4 h-4 opacity-60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </h2>
        ) : (
          <h3 {...headerProps} className={`${headerProps.className} p-name`}>
            {title}
            {isLinkPost && linkURL && (
              <svg 
                className="inline ml-1 w-4 h-4 opacity-60" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            )}
          </h3>
        )}
      </a>
      <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
      <p className="p-summary">{description}</p>
    </li>
  );
}
