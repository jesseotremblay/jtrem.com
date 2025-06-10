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
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link">
            <path d="M15 3h6v6"/>
            <path d="M10 14 21 3"/>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          </svg>
          <span>Links to: {getDomain(linkURL)}</span>
        </div>
      )}
      <a
        href={href}
        className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0 u-url"
      >
        {secHeading ? (
          <h2 {...headerProps} className={`${headerProps.className} p-name`}>
            {title}
            {isLinkPost && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link ml-1 inline-block">
                <path d="M15 3h6v6"/>
                <path d="M10 14 21 3"/>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              </svg>
            )}
          </h2>
        ) : (
          <h3 {...headerProps} className={`${headerProps.className} p-name`}>
            {title}
            {isLinkPost && (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link ml-1 inline-block">
                <path d="M15 3h6v6"/>
                <path d="M10 14 21 3"/>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
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
