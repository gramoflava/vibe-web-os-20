# Contributing to Vibe Web OS 2.0

Thank you for your interest in contributing to Vibe Web OS! This project aims to demonstrate vanilla web technologies following Apple's Human Interface Guidelines.

## 🎯 Project Philosophy

- **Zero Dependencies**: No frameworks, no build tools, pure HTML/CSS/JavaScript
- **Apple HIG Compliance**: Follow Apple's design principles for UI/UX
- **60fps Performance**: All animations must be smooth and performant
- **Browser Native**: Use modern browser features, no polyfills
- **Well-Documented**: Code should be self-explanatory with clear comments

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/vibe-web-os-20.git`
3. Open `index.html` in a modern browser or run a local server
4. Make your changes
5. Test thoroughly in Chrome, Safari, and Firefox

## 📝 Code Style Guidelines

### JavaScript
- Use ES6+ features (arrow functions, classes, const/let)
- Follow the IIFE module pattern for apps
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused

```javascript
/**
 * Launch the application
 * @param {Object} args - Launch arguments
 */
function launch(args = {}) {
  // Implementation
}
```

### CSS
- Use CSS custom properties (CSS variables)
- Follow the existing design system
- Prefer flexbox/grid over floats
- Use meaningful class names
- Add comments for complex styles

### HTML
- Semantic HTML5 elements
- Proper ARIA labels for accessibility
- Clean indentation (2 spaces)

## 🎨 Design System

Always use the existing design tokens in `css/variables.css`:

```css
/* Colors */
--bg-primary, --bg-secondary, --accent-blue

/* Spacing (8px base) */
--space-2, --space-4, --space-6

/* Typography */
--text-sm, --text-base, --text-lg
--weight-medium, --weight-semibold

/* Animation */
--duration-fast, --duration-base
--ease-in-out, --ease-spring
```

## 🔨 Creating a New App

1. Create a new file in `js/apps/yourapp.js`
2. Follow the IIFE module pattern
3. Register with the app registry
4. Add to `index.html` and `sw.js`

Example:

```javascript
(() => {
  function launch(args = {}) {
    const windowId = 'yourapp-' + Date.now();

    WindowManager.create({
      id: windowId,
      title: 'Your App',
      icon: Icons.get('yourapp'),
      content: `<div>Your content</div>`,
      width: 600,
      height: 400
    });
  }

  Apps.register({
    id: 'yourapp',
    name: 'Your App',
    icon: Icons.get('yourapp'),
    description: 'App description',
    category: 'utilities',
    keepInDock: false,
    launch
  });
})();
```

## 🧪 Testing

Before submitting a PR, test:

1. **Window Management**: Drag, resize, minimize, close, snap to edges
2. **Keyboard Shortcuts**: Cmd+W, Cmd+M, Cmd+Space, Cmd+S
3. **Persistence**: Reload and check localStorage
4. **Performance**: Open DevTools Performance tab, ensure 60fps
5. **Cross-Browser**: Test in Chrome, Safari, Firefox
6. **Accessibility**: Test keyboard navigation
7. **Responsive**: Test on different screen sizes

## 📋 Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following the guidelines above
3. Test thoroughly across browsers
4. Update documentation if needed
5. Commit with clear messages: `git commit -m "Add feature: your feature"`
6. Push to your fork: `git push origin feature/your-feature`
7. Open a Pull Request with:
   - Clear description of changes
   - Screenshots/GIFs if UI changes
   - Testing checklist completed
   - Browser compatibility notes

## 🐛 Bug Reports

When reporting bugs, include:

- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Console errors (if any)
- Screenshots (if applicable)

## 💡 Feature Requests

For new features:

- Check existing issues first
- Explain the use case
- Consider Apple HIG alignment
- Propose implementation approach
- Discuss performance implications

## 🎨 Design Contributions

For design improvements:

- Follow Apple Human Interface Guidelines
- Maintain glassmorphism aesthetic
- Ensure accessibility (color contrast, focus states)
- Consider dark and light themes
- Provide mockups or prototypes

## 📚 Documentation

Documentation improvements are always welcome:

- Fix typos and grammar
- Improve clarity
- Add examples
- Update outdated information
- Add missing information

## ⚡ Performance Guidelines

- Target 60fps for all animations
- Use CSS transforms instead of position changes
- Debounce expensive operations
- Use `requestAnimationFrame` for animations
- Minimize DOM manipulation
- Lazy load when possible

## ♿ Accessibility

- Add ARIA labels to interactive elements
- Ensure keyboard navigation works
- Maintain proper focus states
- Test with screen readers
- Ensure sufficient color contrast (WCAG AA minimum)

## 🤝 Community

- Be respectful and constructive
- Help others in discussions
- Share knowledge and learnings
- Give credit where due
- Follow the Code of Conduct

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You!

Your contributions help make Vibe Web OS better for everyone. We appreciate your time and effort!

---

**Questions?** Open an issue or discussion on GitHub.
