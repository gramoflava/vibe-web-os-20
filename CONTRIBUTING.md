# Contributing to Nova OS

We're thrilled you want to help map this digital space! Nova OS is an experimental project pushing the bounds of pure front-end spatial computing.

## Development Philosophy

- **Zero Build Tools:** We rely 100% on Vanilla JavaScript (ES6+), CSS3 with modern features (like `backdrop-filter`, `prefers-color-scheme`, CSS Variables), and HTML5. No Webpack, no React, no Tailwind.
- **Smoothness Above All:** Any changes to the `WindowManager` or structural CSS must maintain smooth 60fps animations. Use `translate3d` over positional absolute recalculations to preserve GPU power.
- **Minimalist Aesthetic:** Stick to the established color tokens found in `css/nova-theme.css`. If extending icons in `js/utils/icons.js`, strive for geometric, ultra-clean SVG paths.

## How to Submit Changes

1. Fork the repository and run it locally via `python3 -m http.server 8080`.
2. Create your feature branch (`git checkout -b feature/AmazingIdea`).
3. If creating a new app, model it after lightweight examples like `js/apps/calculator.js` and be sure to register it in `Apps.register({...})`.
4. Run manual panning and scaling tests to ensure your app hooks properly into the `WindowManager` without dragging regressions.
5. Commit, push, and submit a Pull Request.

Thank you for exploring Nova!
