import { SEO } from "@/constants";

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
  creator: string;
}

export const siteConfig: SiteConfig = {
  name: SEO.title.split("—")[0].trim(),
  tagline: "Smarter Resume Reviews",
  description: SEO.description,
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/hiresense",
    github: "https://github.com/hiresense",
  },
  creator: "HireSense Team",
};
