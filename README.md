# PropertyReply - React + Tailwind CSS

A modern, professional React application for PropertyReply - AI Real Estate Assistant for UK Estate Agents.

## Features

- ✅ Fully converted from HTML/CSS/JS to React
- ✅ Tailwind CSS for all styling
- ✅ All animations and interactions preserved
- ✅ Responsive design maintained
- ✅ Particles.js background animation
- ✅ AOS (Animate On Scroll) animations
- ✅ Mobile menu functionality
- ✅ Smooth scrolling navigation
- ✅ All original design and data preserved

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

3. **Build for Production**
   ```bash
   npm run build
   ```

## Project Structure

```
PropertyReply/
├── public/
│   ├── index.html      # React entry HTML
│   └── logo.png        # Logo image
├── src/
│   ├── components/     # React components
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Features.jsx
│   │   ├── Pricing.jsx
│   │   ├── Testimonials.jsx
│   │   ├── CTA.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Loader.jsx
│   │   └── ParticlesBackground.jsx
│   ├── App.jsx         # Main app component
│   ├── index.js        # React entry point
│   └── index.css       # Tailwind CSS imports
├── package.json
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## Technologies Used

- **React 18.2.0** - UI library
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Particles.js** - Background particle animation
- **AOS (Animate On Scroll)** - Scroll animations
- **Font Awesome** - Icons
- **Google Fonts** - Inter & Plus Jakarta Sans

## Notes

- All CSS has been converted to Tailwind utility classes
- All JavaScript functionality converted to React hooks (useState, useEffect, useRef)
- Original design, colors, spacing, and animations are preserved
- Responsive breakpoints maintained
- All external libraries (particles.js, AOS) are loaded via CDN in public/index.html

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
