# Little Bookshop

A beginner-friendly React + Vite bookstore interface with customer and admin demo flows. The app uses JavaScript, React Router, plain CSS, mock accounts, and browser storage; it does not connect to Supabase.

## Run locally

1. Install Node.js (LTS).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL printed by Vite.
4. Run `npm run build` to create the production bundle in `dist/`.

## Try both roles

Both demo roles use the same login page:

| Demo role | Email | Password |
| --- | --- | --- |
| Customer | `customer@littlebookshop.demo` | `bookshop-reader` |
| Admin | `admin@littlebookshop.demo` | `bookshop-admin` |

Public sign-up makes a customer profile only and signs it in immediately. Demo accounts, profiles, catalog records, categories, and favorites are stored in browser storage for convenience. Use the demo credentials above to sign in again after signing out.

## Project tour

- `src/context/AuthContext.jsx` and `src/services/authService.js`: mock session and role state.
- `src/components/RoleRoute.jsx`: client-side route guard for customer and admin pages.
- `src/context/StoreContext.jsx`: catalog and category demo data.
- `src/services/bookApi.js`: optional public Open Library search.
- `src/pages/StorePages.jsx`: customer bookstore, favorites, account, and admin tools.
- `src/styles.css`: responsive layout and component styles.

## Security and backend limitations

This project is deliberately **frontend-only**. The account flow, role, role checks, profile data, favorites, and admin catalog operations are demonstrations, not security boundaries. Browser storage and JavaScript can be inspected or changed by the person using the browser. `RoleRoute` improves the demo's navigation UX; it does not prevent a user from bypassing the UI or making direct requests.

There is no Supabase project configuration, authentication, `profiles` table, database, or RLS in this demo. It does not store real passwords or send password-reset emails. Open Library is a public discovery API; those results are separate from the shop's sample catalog.

Before using this as a real shop, build a backend implementation: use a supported authentication provider, derive roles from trusted server-side profile records, enforce catalog/favorite permissions in the backend/database (for Supabase, enable RLS and write/test policies), and never expose a service-role key in browser code. Provision admin accounts through a trusted owner-controlled process; public registration must create customer accounts only. Also add server-side input validation and review the provider's recovery/session flows. Do not treat this demo's mock role checks as fulfilling those requirements.

## GitHub setup

Create an empty repository on GitHub, then from this project folder run:

```sh
git init
git add .
git commit -m "Create Little Bookshop demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository's URL. Never add real credentials or secret keys to this frontend project.
