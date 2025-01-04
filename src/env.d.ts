import type {} from "../.astro/types.d.ts";
/// <reference types="astro/client" />

declare module "@astrojs/tailwind" {
  interface TailwindOptions {
    config?: string;
    applyBaseStyles?: boolean;
  }
  const tailwind: (options?: TailwindOptions) => unknown;
  export default tailwind;
}

declare module "@astrojs/react" {
  interface ReactOptions {
    experimentalReactChildren?: boolean;
  }
  const react: (options?: ReactOptions) => unknown;
  export default react;
}

declare module "@astrojs/sitemap" {
  interface SitemapOptions {
    filter?: (page: string) => boolean;
    customPages?: string[];
    changefreq?: string;
    lastmod?: Date;
    priority?: number;
  }
  const sitemap: (options?: SitemapOptions) => unknown;
  export default sitemap;
}

declare module "remark-collapse" {
  interface RemarkCollapseOptions {
    test: string | RegExp;
    summary?: string;
    closed?: boolean;
  }

  type RemarkPlugin = (options?: RemarkCollapseOptions) => void;
  const remarkCollapse: RemarkPlugin;
  export default remarkCollapse;
}
