# 📊 GitHub Profile Views Counter

A modern, high-performance, and highly customizable **Profile Views Counter** for GitHub Profiles (and more).

Built with **TypeScript**, **Fastify**, and **Redis**. Designed to be faster and more robust than legacy counters, supporting **SVG rendering**, **CSS Animations**, **Custom Icons**, and **Animated GIFs**.

## ✨ Features

- **Dual Theme System:**
  - **Flat Mode:** No image assets required! Fully generated via code with custom colors, icons, and animations.
  - **Image Mode:** Supports folder-based themes (Moe-counter style) with `.png` and animated `.gif` support.
- **High Performance:** Uses **SVG with Base64 embedding**. Reduces server load and renders instantly on GitHub.
- **Abuse Protection:** Built-in **Rate Limiting** to prevent spam.
- **Animations:** CSS-based animations for Flat themes (Slide, Fade, Pulse).
- **Docker Ready:** Easy deployment with Docker and Railway/Render.

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


## 🌟 Support

If you found this project helpful, please consider leaving a 🌟 star. Thank you!

- [My Discord Profile](https://discord.com/users/852103749228036136)

- If you find any errors, you can contact luppux
<br> </br>
<p align="center">
  <a href="https://discord.gg/luppux" target="_blank">
    <img src="https://api.weblutions.com/discord/invite/luppux/" alt="Discord Banner">
  </a>
</p>


