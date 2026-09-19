import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const lines = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /event-brief",
    "Disallow: /event-brief/",
    "Disallow: /example-components",
    "Disallow: /example-components/",
    "",
    "# AI Search & Retrieval Crawlers",
    "User-agent: OAI-SearchBot",
    "Allow: /",
    "",
    "User-agent: ChatGPT-User",
    "Allow: /",
    "",
    "User-agent: PerplexityBot",
    "Allow: /",
  ];

  if (site) {
    lines.push("", `Sitemap: ${new URL("sitemap-index.xml", site).href}`);
  }

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
