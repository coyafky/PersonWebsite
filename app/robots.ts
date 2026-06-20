import type { MetadataRoute } from "next";
import { buildUrl } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: buildUrl("/sitemap.xml"),
  };
}
