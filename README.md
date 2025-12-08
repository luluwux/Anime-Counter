# 📊 GitHub Profile Views Counter

A modern, high-performance, and highly customizable **Profile Views Counter** for GitHub Profiles (and more).

Built with **TypeScript**, **Fastify**, and **Redis**. Designed to be faster and more robust than legacy counters, supporting **SVG rendering**, **CSS Animations**, **Custom Icons**, and **Animated GIFs**.

## ✨ Features

- **🎨 Dual Theme System:**
  - **Flat Mode:** No image assets required! Fully generated via code with custom colors, icons, and animations.
  - **Image Mode:** Supports folder-based themes (Moe-counter style) with `.png` and animated `.gif` support.
- **⚡ High Performance:** Uses **SVG with Base64 embedding**. Reduces server load and renders instantly on GitHub.
- **🛡️ Abuse Protection:** Built-in **Rate Limiting** to prevent spam.
- **📉 Smart Formatting:** Automatically formats long numbers (e.g., `12.5k` instead of `12500`).
- **🎭 Animations:** CSS-based animations for Flat themes (Slide, Fade, Pulse).
- **🕵️ Stealth Mode:** Count visitors invisibly using a 1x1 pixel output.
- **🐳 Docker Ready:** Easy deployment with Docker and Railway/Render.

---

## 🚀 Usage

### 1. Basic Usage (Auto Flat Theme)
Just replace `@username` with your actual username.

```markdown
![Visitor Count](https://anime-counter-production.up.railway.app/@luluwux)
```
<img  align="center" width="30%" src="https://anime-counter-production.up.railway.app/@luluwux?animation=pulse?bg=ff0000"> 

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `theme` | Set to `flat` (default) | `?theme=flat` |
| `color` | Text hex color | `?color=ff0000` |
| `bg` | Background hex color | `?bg=000000` |
| `icon` | Add an Emoji/Icon | `?icon=🚀` |
| `animation` | `fade`, `slide`, `pulse` | `?animation=slide` |

2. Anime Theme

<img  align="center" width="30%" src="https://anime-counter-production.up.railway.app/@luluwux?theme=naruto"> 

## 🤝 Contributing

We welcome contributions\!

1.  **New Themes:** Add a new folder in `src/assets/` with images `0-9`.
2.  **New Features:** Fork the repo, create a branch, and submit a PR.


