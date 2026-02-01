# PWA Icon Assets

This directory should contain the PWA icon assets in the following sizes:

## Required Icon Sizes

- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png (also used as maskable icon)
- icon-384x384.png
- icon-512x512.png (also used as maskable icon)

## How to Generate Icons

### Option 1: Online Tool (Easiest)

1. Create or obtain a square logo image (recommended: 1024x1024px)
2. Use [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator) or [RealFaviconGenerator](https://realfavicongenerator.net/)
3. Upload your logo and download the generated icons
4. Place all icons in this directory

### Option 2: Using ImageMagick (Command Line)

If you have a source image (e.g., `logo.png`), you can use ImageMagick to generate all sizes:

```bash
# Install ImageMagick if not already installed
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate all required sizes
convert logo.png -resize 72x72 icon-72x72.png
convert logo.png -resize 96x96 icon-96x96.png
convert logo.png -resize 128x128 icon-128x128.png
convert logo.png -resize 144x144 icon-144x144.png
convert logo.png -resize 152x152 icon-152x152.png
convert logo.png -resize 192x192 icon-192x192.png
convert logo.png -resize 384x384 icon-384x384.png
convert logo.png -resize 512x512 icon-512x512.png
```

### Option 3: Design Software

Use design software like:
- Figma (export in multiple sizes)
- Adobe Illustrator (export artboards)
- Sketch (export at different scales)
- Inkscape (free, open-source)

## Design Guidelines

- **Simple and Bold**: Icons should be recognizable at small sizes
- **Square Format**: Design should work in a square canvas
- **High Contrast**: Clear distinction between foreground and background
- **Safe Zone**: Keep important elements within 80% of the canvas (for maskable icons)
- **File Format**: PNG with transparency
- **Color**: Consider using brand colors, ensure good contrast

## Example Icon Ideas for EduApps

- 🧮 Calculator or abacus icon
- 📚 Book or education symbol
- 🎓 Graduation cap
- ✏️ Pencil or pen
- 🌈 Rainbow (matching the app's visual theme)
- 🧠 Brain icon
- 🎯 Target (learning goals)

## Favicon

Also create a `favicon.ico` file and place it in the `public/` directory (parent of this folder).

You can convert one of the PNG icons to ICO format using online tools or ImageMagick:

```bash
convert icon-192x192.png -define icon:auto-resize=64,48,32,16 ../favicon.ico
```

## Testing Your Icons

After adding icons:

1. Run `pnpm build`
2. Run `pnpm preview`
3. Open DevTools → Application → Manifest
4. Verify all icon sizes are listed and display correctly
5. Test PWA installation on mobile device
6. Check that the icon appears correctly on home screen

## Current Status

⚠️ **Placeholder icons need to be replaced with actual designs.**

The app will build and work without icons, but they are essential for a complete PWA experience and professional appearance.
