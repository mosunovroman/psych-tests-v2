{
  "project": "patient‑lab",
  "tasks": [
    { "id": "domain‑purchase",  "desc": "Buy mindlab.com and mindlab.ru via Cloudflare Registrar",                       "est_h": 1 },
    { "id": "dns‑setup",        "desc": "Add CNAME to Cloudflare Pages, enable IPv6, set TTL 1 hour",                     "est_h": 0.5 },
    { "id": "page‑rules",       "desc": "Cache‑Everything, Edge TTL 1 day, enable Polish+Mirage",                           "est_h": 0.5 },
    { "id": "ru‑vps",          "desc": "Provision Yandex Cloud VDS, install Node, Docker, pull phi‑3‑mini model",        "est_h": 4 },
    { "id": "fallback‑api",    "desc": "Create simple Express endpoint /chat that proxies to local LLM",               "est_h": 2 },
    { "id": "worker‑geo",      "desc": "Edit cloudflare‑worker.js – add CF‑IPCountry check, forward RU requests to ru‑vps", "est_h": 1 },
    { "id": "payment‑yoomoney","desc": "Integrate YooKassa SDK, create /api/pay/yoomoney endpoint",                     "est_h": 2 },
    { "id": "fonts‑self‑host", "desc": "Download Google‑Fonts, add @font‑face in /public, update CSS",                     "est_h": 1 },
    { "id": "security‑headers","desc": "Add CSP, HSTS, Referrer‑Policy in worker responses",                         "est_h": 1 },
    { "id": "test‑ru‑vpn",     "desc": "Open site via Russian VPN, verify UI, PDF‑export, fallback chat works",          "est_h": 2 },
    { "id": "legal‑docs",      "desc": "Write disclaimer, privacy policy, consent checkbox, add to UI",                    "est_h": 1 },
    { "id": "ci‑pipeline",     "desc": "GitHub Actions: lint → test → build → deploy (Pages + Workers)",                  "est_h": 2 }
  ],
  "total_est_h": 20
}

