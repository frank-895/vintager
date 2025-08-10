## Vintager 🍷

Modern, customizable wine menus for hospitality — with a focus on clarity, discovery, and a delightful mobile experience.

- **Live demo**: [vintager.vercel.app](https://vintager.vercel.app/)

### What is Vintager?
Vintager helps you present and manage your wine program. It’s designed for sommeliers, the service team, and guests to get the right information fast — while keeping the experience polished and consistent.

This project is a playground: you can try adding, editing, and deleting wines to explore the UX. **No real changes are saved** — it’s a safe space to see how a digital menu can work for your business.

### Who benefits? 🙌
- **For Sommeliers**: Keep a single, reliable source of truth for your entire list and communicate confidently with both customers and staff.
- **For the Team**: Instantly access wine details without tracking down the sommelier; empower better recommendations.
- **For Guests**: Explore by grape, region, or style on a sleek, mobile‑friendly menu.

### Features ✨
- **Tasting notes & styles**: Flavor tags that make profiles easy to scan
- **Provenance & region**: Add helpful context and story
- **Vintage & varietal**: Clear year and grape details
- **Palate profiles**: Light–Bold, Smooth–Tannic, Dry–Sweet, Soft–Acidic
- **Price transparency**: Clean, at‑a‑glance pricing
- **Availability & stock**: Optional stock indicators for staff alignment
- **Descriptions & highlights**: Short notes for discovery
- **Advanced search & filters**: Find by name, tasting notes, country, grape, vintage, and price
- **Flexible menus**: Beyond wine — supports beer, cocktails, food, and desserts

### Playground mode 🧪
This is a demo environment:
- Edits, deletes, and adds are UI‑only — they do not persist.
- You can “log in” as an admin to explore management flows; no credentials are required.

### Tech stack 🛠️
- **React 19** + **Vite 7**
- **React Router 7**
- **Tailwind CSS 4**
- **Supabase JS v2** (read‑only in this playground)

### Getting started 🚀

Before you begin: a hosted demo is already live at [vintager.vercel.app](https://vintager.vercel.app/) — no setup required.

If you want to run it locally:

1) Install dependencies

```bash
cd app
npm install
```

2) Configure environment

Create an `.env.local` file in `app/` with your Supabase project details:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3) (Optional) Set up the database locally with Supabase

You can recreate the schema using the provided `SCHEMA.sql` (for a quick local/dev Supabase project).

- In the Supabase Dashboard, open SQL Editor and paste the contents of `SCHEMA.sql`, then Run.
- Or using psql:

```bash
psql "$YOUR_SUPABASE_CONNECTION_STRING" -f SCHEMA.sql
```

Note: The production demo is already hosted and connected — this step is only for local development.

4) Run the dev server

```bash
npm run dev
```

5) Build & preview

```bash
npm run build
npm run preview
```

Optional: Supabase connectivity smoke test

```bash
npm run test:supabase
```

### Project structure 🗂️

```
vintager/
  app/
    src/
      pages/
        Home.tsx         # Marketing + Features + Who benefits + Playground + Examples
        Wines.tsx        # Menu with cards, sorting, and robust filters (name, notes, country, grape, vintage, price)
        WineDetails.tsx  # Detailed profile with palate scales and tasting notes
      components/
        WineCard.tsx
        WineForm.tsx
        Dialog.tsx
        ResponsiveImage.tsx
      context/
        AuthContext.tsx  # Local admin toggle for playground
      lib/
        supabaseClient.ts
```

### License 📄
This project is licensed under the terms of the MIT License. See `LICENSE` for details.

