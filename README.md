# Fred Andongndou Poultry Web (Next.js v2)

This repository is the incremental Next.js migration target for the poultry web app.

## Status

- Router model: App Router (`app/` only)
- Build status: passing (`npm run build`)
- Migration mode: progressive (component + route migration in phases)
- Route prefixes: `app/*` -> `/`, `/about`, `/contact`, `/knowledge`; `app/shop/*` -> `/shop/*`

## Run Locally

```bash
npm install
npm run dev
```

## Environment Setup

Create `.env.local` from `.env.example` and provide real values:

```bash
cp .env.example .env.local
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_ACCOUNT_ID` (only if using Stripe Connect)

## Current App Tree (Checkpoint)

```text
fred-andongndou-poultry-web/
	app/
		about/
			page.tsx
		contact/
			page.tsx
		knowledge/
			page.tsx
		shop/
			cart/
				page.tsx
			checkout/
				page.tsx
			collections/
				[handle]/
					page.tsx
			order-confirmation/
				[orderId]/
					page.tsx
			products/
				[handle]/
					page.tsx
		favicon.ico
		globals.css
		layout.tsx
		not-found.tsx
		page.tsx
	components/
		theme-provider.tsx
		ui/
			button.tsx
			dropdown-menu.tsx
			sonner.tsx
			toast.tsx
			toaster.tsx
			tooltip.tsx
	hooks/
		use-toast.ts
	lib/
		utils.ts
	public/
		file.svg
		globe.svg
		next.svg
		vercel.svg
		window.svg
	next.config.ts
	package.json
	postcss.config.mjs
	tsconfig.json
```

## Notes

- Build output uses the Next.js default `.next` directory.
- Existing legacy project remains the source of truth while features are moved one by one.

## Vercel Deployment (Production)

- Set **Root Directory** to this Next.js project folder.
- Use **Framework Preset**: Next.js.
- Use **Build Command**: `npm run build`.
- Leave **Output Directory** empty/default (Next.js expects `.next`).
