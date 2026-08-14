# Komrez Full-Stack Store

Komrez now contains three applications in one repository:

- **Storefront** (`/`) — Next.js customer website on port `3000`
- **Backend** (`/backend`) — Node.js, Express and MongoDB REST API on port `5001`
- **Admin** (`/admin`) — separate Next.js administration panel on port `3001`

## Requirements

- Node.js 20 or newer
- npm
- MongoDB running locally at `mongodb://localhost:27017`

The backend uses the `komrez` database. MongoDB creates it when the seed command writes the first records.

## First-time setup

Install each application's dependencies:

```bash
npm install
npm --prefix backend install
npm --prefix admin install
```

Seed MongoDB with the starter catalog, categories, store settings and the first admin, then safely add the expanded catalog:

```bash
npm run backend:seed
npm --prefix backend run expand:catalog
```

Default local admin credentials:

```text
Email: admin@komrez.com
Password: ChangeMe123!
```

Change `ADMIN_PASSWORD` and `JWT_SECRET` in `backend/.env` before production or sharing the server.

## Run all applications

Open three terminals:

```bash
# Terminal 1 — API
npm run backend:dev

# Terminal 2 — storefront
npm run dev

# Terminal 3 — admin panel
npm run admin:dev
```

Open:

- Storefront: http://localhost:3000
- Admin: http://localhost:3001
- API health: http://localhost:5001/api/health

## Data flow

- Products, categories, users, carts, orders and settings live in MongoDB.
- Storefront catalog, homepage product sections and search load products only through the API; browser-side seed-product fallback has been removed.
- Checkout creates a MongoDB order and preserves the cart when the request fails. Guests can order without an account; password and address saving are offered only when they choose to create one.
- Signed-in customers can reuse a saved address or enter a new one. Their profile shows complete order history, order IDs, items, totals, payment state and tracking history.
- Logged-in carts sync through the API; guest carts remain local until the customer logs in.
- Track Order reads the real MongoDB order status and history.
- Admin users authenticate with JWT and can manage multiple product images, inventory value, categories, hero slides, payment methods, payment proof approval, orders, users and database backups.
- Customer and admin notification bells receive live backend events without repeated polling and play a short alert for new notifications.
- Stock is capped in the cart, deducted after ordering and restored once for cancelled, returned or refunded orders. Delivered-order damage claims are reviewed separately in Admin → Damage claims.
- Manual customer signup/login uses the Komrez backend. Google login is verified through Firebase, then the customer is created/updated in MongoDB and appears in Admin → Users.

## Move data to another MongoDB

In Admin → **Data migration**, download a backup. Change `MONGODB_URI` in `backend/.env` to the new database, restart the backend, then return to the same page and import the backup. Products, categories, customers, carts, orders, settings, notifications and IDs are preserved.

Complete endpoint documentation, response envelopes and error codes are in [backend/README.md](./backend/README.md).
