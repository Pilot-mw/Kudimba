# Kudimba Farms

A marketing and lead-generation website for Kudimba Farms, a pepper farm and processing business in Area 47, Lilongwe, Malawi. Built with React + Vite + Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  components/     # Reusable UI components
  pages/          # Route-level page components
  utils/          # WhatsApp link builder utility
  App.jsx         # Root component with routing
  main.jsx        # Entry point
  index.css       # Tailwind imports + brand theme tokens
public/
  logo.png        # Brand logo (swap with your preferred file)
  images/
    products/     # Drop product photos here
```

## Replacing Placeholder Images

Product cards use an emoji placeholder when no image is provided. To add real product photos:

1. Place images in `public/images/products/`
2. Reference them in the product data arrays in `src/pages/Products.jsx` by adding an `image` property, e.g.:
   ```js
   { name: "Cayenne", image: "/images/products/cayenne.jpg" }
   ```

## Changing the WhatsApp Number

Edit the `WHATSAPP_NUMBER` constant in `src/utils/whatsapp.js`.

## Brand Colors

| Token          | Hex      | Usage                        |
|----------------|----------|------------------------------|
| `brand-dark`   | `#1B4332`| Headers, nav, primary buttons|
| `brand-green`  | `#4C7A3D`| Secondary elements, badges   |
| `brand-orange` | `#D8782A`| Accents, calls-to-action     |
| `brand-hot`    | `#A4282C`| "Hot" heat-level badge       |
| `brand-extrahot`| `#7A1E20`| "Extra Hot" heat badge       |
| `brand-ink`    | `#2B2B2B`| Body text                    |
| `brand-gray`   | `#6E6E6E`| Muted text                   |
| `brand-pale`   | `#E9F1E6`| Light background sections    |

## Tech Stack

- [React](https://react.dev)
- [Vite](https://vite.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [react-router-dom](https://reactrouter.com)
- [lucide-react](https://lucide.dev)
