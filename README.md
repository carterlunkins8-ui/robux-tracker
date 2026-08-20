# Block Check — Roblox Stats Tracker (with proxy)

This is a two-part site:
- `public/index.html` — the page people see
- `server.js` — a small server that fetches data from Roblox on your page's behalf, so the browser's CORS restrictions don't get in the way

## Run it locally

1. Install [Node.js](https://nodejs.org) (version 18 or newer — it needs built-in `fetch`).
2. In this folder, install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm start
   ```
4. Open **http://localhost:3000** in your browser.

## Put it online (so anyone can use it, not just your own computer)

Any host that runs Node.js server code works. Easiest free options:

- **[Render](https://render.com)** — connect a GitHub repo with these files, choose "Web Service," it auto-detects `npm start`.
- **[Railway](https://railway.app)** — similar one-click deploy from a repo.
- **[Cyclic](https://www.cyclic.sh)** or **[Fly.io](https://fly.io)** — also free-tier friendly for small Node apps.

Static hosts like GitHub Pages or Netlify's basic tier **won't** work for `server.js` on their own, since they don't run backend code — you'd need their "functions" feature instead, which takes a bit more adapting.

## About "giving this to Roblox"

This site is just a stats lookup tool + a link to Roblox's real store — it's not something you submit to Roblox or that runs inside Roblox itself. If you want to share it with friends, just send them the link once it's deployed.
