# UPM Student Cab - CSS & Styling Guide

## Styling Approach

The entire application uses **Tailwind CSS** for styling. Tailwind is a utility-first CSS framework that allows you to build modern designs without leaving your HTML.

## Key Tailwind Classes Used

### Colors
```css
/* Primary Colors */
text-blue-600, bg-blue-600, border-blue-600
text-green-600, bg-green-600, border-green-600

/* Status Colors */
text-yellow-500, bg-yellow-100
text-red-500, bg-red-100
text-green-500, bg-green-100

/* Neutral Colors */
text-gray-800, text-gray-600, text-gray-500
bg-gray-50, bg-gray-100, bg-gray-200
border-gray-300
```

### Spacing
```css
/* Padding */
p-4, p-6, px-4, py-3, px-8, py-4

/* Margin */
mb-4, mt-6, mx-auto, gap-2, gap-4, gap-8

/* Height/Width */
h-16, w-16, min-h-screen, max-w-7xl
```

### Layout
```css
/* Flexbox */
flex, items-center, justify-between, gap-4, flex-1

/* Grid */
grid, grid-cols-1, md:grid-cols-2, lg:grid-cols-4

/* Display */
flex items-center justify-center
```

### Typography
```css
/* Font Sizes */
text-sm, text-base, text-lg, text-2xl, text-3xl, text-5xl

/* Font Weight */
font-light, font-semibold, font-bold

/* Text Colors */
text-gray-800, text-white, text-gray-600
```

### Borders & Shadows
```css
rounded, rounded-lg, rounded-xl, rounded-2xl, rounded-full
shadow, shadow-lg, shadow-2xl
border, border-2, border-l-4
```

### Backgrounds & Effects
```css
bg-gradient-to-br, from-blue-500, to-blue-600
hover:bg-blue-700, hover:text-gray-800
transition, duration-300
opacity-50
```

## Responsive Design

Tailwind uses breakpoints:

```css
/* Base (mobile first) */
flex, block, grid

/* Tablet and up */
md:flex, md:grid-cols-2, md:gap-6

/* Desktop and up */
lg:col-span-2, lg:grid-cols-3, lg:px-4

/* Large desktop and up */
xl:max-w-7xl, xl:grid-cols-4
```

Example responsive layout:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 1 column on mobile, 2 on tablet, 4 on desktop */}
</div>
```

## Common Component Patterns

### Button
```jsx
<button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
  Click Me
</button>
```

### Card
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h2 className="text-2xl font-bold mb-4">Title</h2>
  {/* Content */}
</div>
```

### Form Input
```jsx
<input 
  type="text"
  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter text..."
/>
```

### Alert/Badge
```jsx
<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
  Completed
</span>
```

### Gradient Background
```jsx
<div className="bg-gradient-to-r from-blue-600 to-blue-800">
  {/* Content */}
</div>
```

### Hover Effects
```jsx
<div className="hover:shadow-lg hover:scale-105 transition duration-300">
  {/* Content */}
</div>
```

## Color Scheme

### Primary Colors
- **Blue**: Used for CTAs, headers, and key actions
- **Green**: Used for success states and drivers
- **Purple**: Used for secondary elements

### Semantic Colors
- **Red**: Errors, cancellations, critical actions
- **Yellow**: Warnings, alerts
- **Green**: Success, completed, available

## Typography Hierarchy

```
H1: text-5xl font-bold
H2: text-3xl font-bold
H3: text-2xl font-bold
H4: text-xl font-bold
Body: text-base text-gray-700
Small: text-sm text-gray-600
```

## Tailwind Configuration

In `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom colors can be added here
      },
      spacing: {
        // Custom spacing can be added here
      }
    }
  },
  plugins: []
}
```

## Dark Mode (Future Enhancement)

To enable dark mode in Tailwind:

```jsx
<div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
  {/* Content */}
</div>
```

## Accessibility

Always include:
```jsx
// Semantic HTML
<button>, <nav>, <header>, <main>, <footer>

// ARIA labels
<button aria-label="Close menu">
  
// Form labels
<label htmlFor="email">Email</label>
<input id="email" type="email" />

// Color contrast (text should have sufficient contrast)
```

## Performance Tips

1. **Only use Tailwind CSS for styling** - Avoid inline styles
2. **Group similar utilities** - Keep related classes together
3. **Use CSS classes for animations** - Avoid JavaScript animations when possible
4. **Optimize images** - Use appropriate image formats and sizes
5. **Lazy load components** - Use React.lazy() for heavy components

## Development Workflow

1. Start with mobile-first design
2. Add `md:` prefixes for tablet styles
3. Add `lg:` prefixes for desktop styles
4. Test at different breakpoints using browser dev tools
5. Use Tailwind CSS IntelliSense VS Code extension for autocomplete

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
- [Tailwind UI Components](https://tailwindui.com)

## Common Tweaks

### Custom Colors
Add to `tailwind.config.js`:
```javascript
extend: {
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981'
  }
}
```

### Custom Fonts
```javascript
extend: {
  fontFamily: {
    sans: ['Inter', 'sans-serif']
  }
}
```

### Custom Spacing
```javascript
extend: {
  spacing: {
    '128': '32rem',
    '144': '36rem'
  }
}
```

## Utility Classes Reference

| Property | Classes |
|----------|---------|
| Display | `block`, `flex`, `grid`, `hidden`, `inline` |
| Flexbox | `flex-col`, `items-center`, `justify-between`, `gap-4` |
| Grid | `grid-cols-1`, `grid-cols-3`, `col-span-2` |
| Width | `w-full`, `w-1/2`, `w-96`, `max-w-md` |
| Height | `h-16`, `h-screen`, `min-h-screen` |
| Padding | `p-4`, `px-6`, `py-3`, `pt-8` |
| Margin | `m-4`, `mx-auto`, `mt-6`, `mb-8` |
| Border | `border`, `border-gray-300`, `rounded-lg` |
| Shadow | `shadow`, `shadow-lg`, `shadow-2xl` |
| Colors | `bg-blue-600`, `text-gray-800`, `border-red-500` |
| Hover | `hover:bg-blue-700`, `hover:shadow-lg`, `hover:text-blue-600` |
| Responsive | `md:`, `lg:`, `xl:` prefixes |
