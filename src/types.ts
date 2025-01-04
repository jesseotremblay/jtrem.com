import type SocialIcons from "../src/assets/socialIcons";

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
  scheduledPostMargin: number;
};

export type SocialObjects = {
  name: keyof typeof SocialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];
