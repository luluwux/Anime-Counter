# Anime Counter

A high-performance, secure, and customizable serverless view counter badge for GitHub profiles and websites.

Built with **TypeScript**, **Hono**, **Cloudflare Workers**, **Cloudflare KV**, and **Cloudflare R2**. Designed to be serverless, zero-maintenance, and cost-free, supporting dynamic flat SVG rendering, CSS animations, custom icons, and retro anime sprite themes.

---

## Features

- **Sunucusuz & Sıfır Maliyetli (Serverless & Zero Cost):** Runs on Cloudflare Workers edge network. Under 100k daily requests, it is entirely free.
- **Dual Theme System:**
  - **Flat Mode:** Code-generated SVGs with custom colors, emoji icons, and animations.
  - **Image Mode:** Classic Moe-counter pixel sprite digit themes (Naruto, One Piece, Bleach, etc.).
- **New Advanced Parameters:**
  - `scale`: Resize the counter from `0.5x` to `2.0x` dynamically.
  - `pixelated`: Keep retro pixel-art digits crisp on high-DPI screens.
  - `num`: Bypass database incrementing to display a static custom count.
- **Edge Caching & Performance:** Uses Cloudflare Cache API and Worker isolate memory to achieve sub-millisecond response times.
- **Vulnerability Safe:** Full sanitization for colors and HTML escape safety.

---

## Usage

### 1. Flat Theme (Default)
Simply embed the SVG image link with your username. Replace `luluwux` with your actual username:

```markdown
![Visitor Counter](https://anime-counter.lulushu.workers.dev/@luluwux)
```

#### Query Parameters
Customize your flat badge using query parameters:

| Parameter | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `theme` | Set to `flat` | `flat` | `theme=flat` |
| `icon` | Add an emoji prefix | None | `icon=🚀` |
| `color` | Text hex color (no #) | `c9d1d9` | `color=58A6FF` |
| `bg` | Background hex color | `21262d` | `bg=0D1117` |
| `stroke` | Border hex color | `30363d` | `stroke=30363d` |
| `animation` | `fade`, `slide`, `pulse`, or `none` | `none` | `animation=pulse` |
| `scale` | Scaling multiplier (0.5 to 2.0) | `1` | `scale=1.5` |
| `num` | Bypasses database to show a static count | None | `num=1337` |

---

### 2. Anime Sprite Themes
Use folder-based pixel sprite themes:

```markdown
![Visitor Counter](https://anime-counter.lulushu.workers.dev/@luluwux?theme=naruto)
```

#### Query Parameters

| Parameter | Description | Default | Example |
| :--- | :--- | :--- | :--- |
| `theme` | Selected anime theme name | `flat` | `theme=naruto` |
| `length` | Minimum number of digits (1 to 16) | `7` | `length=8` |
| `pixelated` | Crisp retro image rendering (`1` or `0`) | `1` | `pixelated=0` |
| `scale` | Scaling multiplier (0.5 to 2.0) | `1` | `scale=1.2` |

---

## Deploy Your Own

You can deploy this project to your own Cloudflare account in minutes for free.

### Prerequisites
Make sure you have Node.js installed and a free Cloudflare account.

### Installation
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/luluwux/Anime-Counter.git
   cd Anime-Counter
   npm install
   ```
2. Log into your Cloudflare account using Wrangler CLI:
   ```bash
   npx wrangler login
   ```

### Setup Cloudflare KV & R2 Storage
1. Create the R2 Storage Bucket:
   ```bash
   npx wrangler r2 bucket create anime-counter-assets
   ```
2. Create the KV Namespace:
   ```bash
   npx wrangler kv:namespace create KV
   ```
3. Copy the output KV namespace `id` and replace it in the `wrangler.toml` file under `[[kv_namespaces]]`.

### Upload Theme Assets
Upload the anime themes located in `src/assets` to your newly created R2 bucket:
```bash
npm run seed:prod
```

### Deploy
Deploy the worker:
```bash
npm run deploy
```
Once deployed, your live URL will be displayed in the terminal.

---

## Tests
Verify the installation by running the test suite:
```bash
npm run test
```

---

## License
Licensed under the ISC License.
