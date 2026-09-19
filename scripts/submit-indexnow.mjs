import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const key = "48c51c2d3d2848bdae8277fffe84303e";
const host = "www.innerwesteventphotography.com.au";
const keyLocation = `https://${host}/${key}.txt`;

let urlList = process.argv.slice(2);

if (urlList.length === 0) {
  const sitemapPath = join(root, "dist", "sitemap-0.xml");
  if (!existsSync(sitemapPath)) {
    console.error(
      `Error: ${sitemapPath} not found. Run 'npm run build' first or pass URLs as arguments.`
    );
    process.exit(1);
  }

  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const matches = [...sitemapXml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)];
  urlList = matches.map((m) => m[1]);
}

if (urlList.length === 0) {
  console.error("No URLs found to submit.");
  process.exit(1);
}

console.log(`Submitting ${urlList.length} URLs to IndexNow (${host})...`);

const payload = {
  host,
  key,
  keyLocation,
  urlList,
};

try {
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  if (response.ok || response.status === 202) {
    console.log(`IndexNow submission successful (HTTP ${response.status}).`);
  } else {
    const text = await response.text();
    console.warn(
      `IndexNow submission responded with HTTP ${response.status}: ${text}`
    );
  }
} catch (error) {
  console.error("IndexNow submission failed:", error);
}
