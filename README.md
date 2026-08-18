# Grocery List

An editable grocery list web app with categories, saved lists and a
dark/light theme. Built with React 18, TypeScript and Tailwind CSS.

**Live demo:** https://project-food-one.vercel.app/

## Features

- **Item management** — add, edit and delete items. Click any item to edit it
  inline; Enter saves, Escape cancels.
- **Categories** — assign each item a category (Produce, Dairy, Bakery,
  Frozen, Household, etc.), shown as a tag next to the item.
- **Check off items** — mark items as bought while shopping.
- **Search** — filter the current list as you type.
- **Saved lists** — save a completed list and reload it later; each saved list
  is timestamped and can be deleted individually.
- **Copy list** — copy the whole list to the clipboard for sharing.
- **Dark and light mode** — theme toggle in the header.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Build | Vite |
| Icons | Lucide React |
| Linting | ESLint |
| Hosting | Vercel |

## Getting Started

```bash
git clone https://github.com/F1N3G/project_food.git
cd project_food

npm install
npm run dev
```

Runs at `http://localhost:5173`.

```bash
npm run build     # production build
npm run preview   # preview the build locally
npm run lint      # run ESLint
```

## Possible Extensions

- Sort the active list by category, so items are grouped by aisle
- Quantities and units per item
- Shareable list links
- Offline support with a service worker
