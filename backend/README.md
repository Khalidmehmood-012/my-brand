# Komrez Backend API

Base URL: `http://localhost:5001/api`

## cPanel production deployment

The API requires Node.js 20 or newer. In **Setup Node.js App**, use:

- Node.js version: `20.x` or newer
- Application mode: `Production`
- Application root: the uploaded `backend` directory
- Application URL: `https://komrez.fleximagepro.com`
- Application startup file: `app.js`

Add the variables from `.env.example` in the cPanel environment-variable
section, run `npm install`, and restart the application. Do not leave the
cPanel-generated sample application as the startup file; its response is
`It works! NodeJS ...` and it does not load this API.

After restarting, these URLs must return JSON:

```text
https://komrez.fleximagepro.com/
https://komrez.fleximagepro.com/api/health
https://komrez.fleximagepro.com/api/products?limit=1
```

## Authentication

Protected routes require:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Roles:

- `customer` — normal API account
- `staff` — products, categories and orders
- `admin` — full access including users, settings and archive operations

## Standard responses

Successful single resource:

```json
{
  "success": true,
  "data": { "_id": "..." }
}
```

Successful paginated list:

```json
{
  "success": true,
  "data": [],
  "meta": { "page": 1, "limit": 20, "total": 0, "pages": 0 }
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Submitted data is invalid.",
    "details": [{ "field": "email", "message": "Invalid email address" }]
  }
}
```

## Health

### `GET /health`

Response `200`:

```json
{ "success": true, "data": { "service": "komrez-api", "status": "ok", "timestamp": "2026-08-11T00:00:00.000Z" } }
```

## Authentication endpoints

### `POST /auth/register`

Body:

```json
{ "name": "Customer Name", "email": "customer@example.com", "password": "minimum8" }
```

Response `201`: `{ user, token }`

Errors: `VALIDATION_ERROR` (`422`), `EMAIL_EXISTS` (`409`).

### `POST /auth/login`

Body:

```json
{ "email": "admin@komrez.com", "password": "ChangeMe123!" }
```

Response `200`: `{ user, token }`

Errors: `INVALID_CREDENTIALS` (`401`), `ACCOUNT_DISABLED` (`403`).

### `GET /auth/me`

Auth required. Response `200`: current user without password hash.

Errors: `AUTH_REQUIRED`, `INVALID_TOKEN`, `ACCOUNT_UNAVAILABLE` (`401`).

### `POST /auth/firebase`

Verifies a Firebase/Google ID token, creates or updates the customer in MongoDB, and returns the normal Komrez JWT session.

```json
{ "idToken": "firebase-id-token" }
```

Errors: `INVALID_FIREBASE_TOKEN` (`401`), `FIREBASE_NOT_CONFIGURED` (`503`), `ACCOUNT_DISABLED` (`403`).

## Product endpoints

### `GET /products`

Public. Query parameters:

| Parameter | Description |
| --- | --- |
| `page`, `limit` | Pagination; maximum limit is 100 |
| `search` | Product name, category or subcategory |
| `category` | Example: `tshirts` |
| `gender` | `men`, `women`, `unisex` |
| `featured=true` | Featured products only |
| `sale=true` | Products where original price is higher |
| `includeInactive=true` | Admin catalog view |

Response `200`: product array plus pagination metadata.

### `GET /products/:slug`

Public. Response `200`: active product.

Error: `PRODUCT_NOT_FOUND` (`404`).

### `POST /products`

Roles: admin/staff.

```json
{
  "name": "Classic Tee",
  "price": 1500,
  "purchasePrice": 800,
  "originalPrice": 2000,
  "isOnSale": true,
  "image": "https://example.com/tee.jpg",
  "images": ["https://example.com/tee.jpg"],
  "category": "tshirts",
  "subcategory": "Oversized Tee",
  "gender": "men",
  "badge": "NEW IN",
  "sizes": ["S", "M", "L", "XL"],
  "stock": 100,
  "isFeatured": true,
  "isActive": true,
  "description": "Premium cotton tee."
}
```

Response `201`: created product.

### `PATCH /products/:id`

Roles: admin/staff. Send any product fields to update. Response `200`.

### `DELETE /products/:id`

Role: admin. Soft-deletes by setting `isActive=false`. Response:

```json
{ "success": true, "data": { "id": "...", "deleted": true } }
```

Product errors: `VALIDATION_ERROR` (`422`), `PRODUCT_NOT_FOUND` (`404`), `DUPLICATE_VALUE` (`409`), `INVALID_ID` (`400`).

## Upload endpoint

### `POST /uploads/products`

Roles: admin/staff. Send `multipart/form-data` with up to 8 files under the `images` field. Accepted formats: JPG, PNG, WebP and AVIF; maximum 5MB each. Response `201` returns public URLs for every uploaded image.

### `POST /uploads/payment-proof`

Public checkout upload. Send one JPG, PNG, WebP or AVIF file (maximum 5MB) under the `image` field. Response `201`: `{ "url": "http://localhost:5001/uploads/products/..." }`.

`POST /uploads/profile-image` uses the same supported formats and size limit, requires customer authentication, and returns the stored profile image URL.

## Customer cart endpoints

- `GET /cart` — get the authenticated customer's MongoDB cart.
- `PUT /cart` — replace/sync cart: `{ "items": [{ "productId": "...", "selectedSize": "M", "quantity": 1 }] }`.
- `DELETE /cart` — clear the authenticated customer's cart.

All cart endpoints require a customer JWT. Product IDs and availability are validated server-side.

## Category endpoints

### `GET /categories`

Public. Optional `includeInactive=true`. Response `200`: category array.

### `POST /categories`

Roles: admin/staff. Body:

```json
{ "name": "T-Shirts", "description": "All tees", "image": "https://...", "sortOrder": 1 }
```

Response `201`. Slug is generated automatically.

### `PATCH /categories/:id`

Roles: admin/staff. Partial body. Response `200`.

### `DELETE /categories/:id`

Role: admin. Soft archive. Response `200`.

Category errors: `VALIDATION_ERROR`, `CATEGORY_NOT_FOUND`, `DUPLICATE_VALUE`, `INVALID_ID`.

## Order endpoints

### `POST /orders`

Public checkout endpoint. Prices for normal products are verified against MongoDB; client prices are not trusted.

```json
{
  "password": "required-for-a-guest-account",
  "saveAddress": true,
  "addressLabel": "Home",
  "customer": {
    "name": "Customer",
    "email": "customer@example.com",
    "phone": "03001234567",
    "address": "House 1, Street 2",
    "city": "Lahore"
  },
  "items": [{
    "productId": "mongo-id-or-seeded-legacy-id",
    "name": "Classic Tee",
    "price": 1500,
    "quantity": 1,
    "selectedSize": "M",
    "isCustom": false
  }],
  "paymentMethod": "bank",
  "paymentProof": "http://localhost:5001/uploads/products/payment-proof.jpg",
  "notes": "Call before delivery"
}
```

Payment methods: `cod`, `easypaisa`, `jazzcash`, `bank`.

For an authenticated customer, omit `password`. A guest may also omit `password` and check out without an account. When a guest supplies a password with `saveAddress: true`, the account/address are saved and the response includes `authToken` and `account`. Non-COD methods require `paymentProof`.

Response `201`: complete order with an order number such as `KMR-20260811-1234`.

Errors: `VALIDATION_ERROR` (`422`), `PRODUCT_UNAVAILABLE` (`422`), `INSUFFICIENT_STOCK` (`409`).
Additional errors: `ACCOUNT_DETAILS_REQUIRED` (`422`), `INVALID_CREDENTIALS` (`401`), `PAYMENT_PROOF_REQUIRED` (`422`).

### `GET /orders/track/:orderNumber`

Public. Returns only tracking-safe fields: order number, status, history, city and timestamps.

Error: `ORDER_NOT_FOUND` (`404`).

### `GET /orders/mine`

Customer authentication required. Returns the signed-in customer's orders with pagination.

### `GET /orders`

Roles: admin/staff. Query: `page`, `limit`, `status`, `search`. Response `200` paginated.

### `GET /orders/:id`

Roles: admin/staff. Full order details. Error `ORDER_NOT_FOUND`.

### `PATCH /orders/:id/status`

Roles: admin/staff.

```json
{ "status": "shipped", "note": "Handed to courier" }
```

Statuses: `pending`, `confirmed`, `processing`, `shipped`, `out-for-delivery`, `delivered`, `cancelled`, `returned`.

Cancelling or returning an active order restores its product stock. Reactivating it deducts stock again after availability validation. Each status change may include a customer-visible tracking note.

### `PATCH /orders/:id/payment`

Roles: admin/staff. Body: `{ "paymentStatus": "paid", "note": "Proof verified" }`. Payment statuses: `pending`, `paid`, `failed`, `refunded`. The customer receives a notification after review.

## Public store configuration

### `GET /public-settings`

Public. Returns the `store`, `payments` and `hero` settings plus active categories. The storefront uses this response for checkout methods, homepage slides and dynamic header categories.

## Notification endpoints

- `GET /notifications` — authenticated customer/admin notification list and unread count.
- `PATCH /notifications/read-all` — mark the signed-in user's relevant notifications as read.
- `PATCH /notifications/:id/read` — mark only the opened notification as read; other unread notifications remain highlighted.
- `GET /notifications/stream?token=...` — authenticated server-sent event stream for instant notifications; no repeated list polling is required.

## Review endpoints

- `GET /reviews/product/:productId` — public verified reviews with total and average rating.
- `POST /reviews` — authenticated customer submits one review for a product item from a delivered order. Body: `{ "orderId": "...", "itemIndex": 0, "rating": 5, "comment": "Great quality" }`.

When an authenticated customer's order first changes to `delivered`, the backend creates a live review-request notification. Duplicate reviews for the same order item are rejected with `409 REVIEW_EXISTS`.

## Address endpoints

- `POST /auth/addresses` — add a saved address.
- `PATCH /auth/addresses/:id` — edit an address or make it default.
- `DELETE /auth/addresses/:id` — remove an address and promote another default when needed.

## Damage claim endpoints

- `POST /claims` — customer submits a claim for an item in their delivered order.
- `GET /claims/mine` — customer's claims.
- `GET /claims` — admin/staff claim queue.
- `PATCH /claims/:id` — admin/staff reviews a claim and notifies the customer.

## Admin endpoints

### `GET /admin/dashboard`

Roles: admin/staff. Returns monthly revenue, product cost, operating expenses, gross profit, net profit, current stock units, stock purchase value, stock retail value, recent orders and low-stock products.

### Expense endpoints

- `GET /admin/expenses` — admin expense history.
- `POST /admin/expenses` — create an expense with `title`, `category`, `amount`, `expenseDate` and optional `note`.
- `DELETE /admin/expenses/:id` — delete an expense.

### `GET /admin/users`

Role: admin. Query: `page`, `limit`, `role`, `search`.

### `PATCH /admin/users/:id`

Role: admin. Body may include `name`, `role`, `isActive`.

Errors: `USER_NOT_FOUND` (`404`), `SELF_DISABLE_NOT_ALLOWED` (`409`).

### `GET /admin/settings`

Roles: admin/staff. Returns all store settings.

### `PUT /admin/settings/:key`

Role: admin.

```json
{ "value": { "currency": "PKR" }, "description": "Store configuration" }
```

### `GET /admin/migration/export`

Role: admin. Exports a complete `komrez-backup-v1` backup containing products, categories, users, carts, orders, settings and notifications.

### `POST /admin/migration/import`

Role: admin. Imports/upserts a previously exported backup into the currently connected MongoDB. Use the admin **Data migration** screen for the guided workflow.

## Global HTTP errors

| Status | Code | Meaning |
| --- | --- | --- |
| `400` | `INVALID_ID` | MongoDB identifier is malformed |
| `401` | `AUTH_REQUIRED` | Bearer token missing |
| `401` | `INVALID_TOKEN` | Token invalid or expired |
| `401` | `ACCOUNT_UNAVAILABLE` | User missing or inactive |
| `403` | `FORBIDDEN` | Role cannot perform action |
| `404` | `ROUTE_NOT_FOUND` | Endpoint does not exist |
| `404` | `*_NOT_FOUND` | Requested record not found |
| `409` | `DUPLICATE_VALUE` | Unique value already exists |
| `422` | `VALIDATION_ERROR` | Body/query validation failed |
| `429` | Express rate-limit response | Too many requests |
| `500` | `INTERNAL_ERROR` | Unexpected server error |

## Production checklist

1. Set a long random `JWT_SECRET` (minimum 32 characters).
2. Change the seeded admin password.
3. Use a MongoDB Atlas connection string or secured MongoDB deployment.
4. Restrict `CLIENT_URL` and `ADMIN_URL` to real HTTPS origins.
5. Run the API behind HTTPS and a reverse proxy.
6. Do not commit `backend/.env`, `admin/.env.local` or root `.env.local`.
- `PATCH /auth/profile` — authenticated customer updates name, phone and uploaded profile photo URL.
- `PATCH /auth/password` — authenticated customer changes their password. Manual accounts must provide `currentPassword`; Google-only accounts can set their first password without one.
