# Backlinq — SEO Backlink Intelligence

Get domain authority scores, backlink profiles, referring domains, and
multi-domain competitor comparisons without paying $1,200/year for Ahrefs
or SEMrush.

Backlinq aggregates data from **Moz**, **Open PageRank**, and **Common Crawl**
and serves it through a clean API. This Actor wraps all four Backlinq endpoints
so you can use them directly inside Apify workflows.

---

## What You Get

### Get Domain Authority
Domain Authority score (0–100), PageRank (0–10), Global Rank, and Spam Score
for any domain.

### Get Backlink Profile
Total backlinks, unique referring domain count, and top linking URLs with metadata.

### Get Referring Domains
A deduplicated list of external domains linking to the target.

### Compare Domains
Side-by-side authority comparison for 2–5 domains ranked by Domain Authority.

---

## Input

| Field    | Type    | Required    | Description                                                                               |
| -------- | ------- | ----------- | ----------------------------------------------------------------------------------------- |
| endpoint | string  | Yes         | One of: `domain-authority`, `backlink-profile`, `referring-domains`, `compare-domains`    |
| domain   | string  | Conditional | Target domain. Required for all endpoints except `compare-domains`. Example: `github.com` |
| domains  | string  | Conditional | Comma-separated 2–5 domains. Required for `compare-domains` only.                         |
| limit    | integer | No          | Results to return for `backlink-profile` and `referring-domains`. Default: 20             |

---

## Output
```json
{
  "endpoint": "domain-authority",
  "query": "github.com",
  "queriedAt": "2026-03-01T12:00:00.000Z",
  "result": {
    "domain": "github.com",
    "domainAuthority": 95,
    "pageRank": 8.59,
    "rank": "22",
    "spamScore": 1
  }
}
```

---

## Example Inputs

**Domain Authority:**
```json
{ "endpoint": "domain-authority", "domain": "vercel.com" }
```

**Backlink Profile:**
```json
{ "endpoint": "backlink-profile", "domain": "vercel.com", "limit": 10 }
```

**Referring Domains:**
```json
{ "endpoint": "referring-domains", "domain": "github.com", "limit": 20 }
```

**Compare Domains:**
```json
{ "endpoint": "compare-domains", "domains": "github.com,vercel.com,netlify.com" }
```

---

## Data Sources

| Data Point        | Source        |
| ----------------- | ------------- |
| Domain Authority  | Moz           |
| Spam Score        | Moz           |
| PageRank          | Open PageRank |
| Global Rank       | Open PageRank |
| Backlinks         | Common Crawl  |
| Referring Domains | Common Crawl  |

---

## Support

Visit [backlinq.dev](https://backlinq.dev) or open an issue on
[GitHub](https://github.com/allwells/backlinq-apify-actor).
