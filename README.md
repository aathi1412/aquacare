# AquaCare - Water Purifier Product Showcase & Service Management Platform

AquaCare is a modern, full-stack web application designed for a premier residential and commercial water purification enterprise.

> **Important Architecture Notice**:
> This platform is an **informational showcase and technical service portal**, **NOT an online checkout store**. It is engineered specifically around customer education, product specification transparency, interactive visual inspection (including an interactive **360-degree rotational product viewer**), customer enquiry workflows, and service booking dispatch. Online carts, payments, and checkout flows are strictly omitted in favor of direct consultation and quotation actions.

---

## 🌟 Key Features

### 1. Customer Product Discovery & Visual Showcase
- **Dynamic Catalogue**: Filter by purifier category (Wall-Mounted, Under-Sink, Hot & Cold, Commercial) and real-time search by purifier name or purification feature.
- **Detailed Specifications**: Comprehensive technical tables (TDS range, flow rates, dimensions, power consumption, filtration stages).
- **Interactive Multi-Image Gallery**: Primary hero preview, thumbnail switcher, next/prev arrow navigation, and full-resolution lightbox zoom modal.
- **Interactive 360-Degree Product Viewer**: Real frame-sequence rotational viewer supporting smooth horizontal mouse drag, mobile touch swipe gestures, auto-rotation, frame sliders, and fallback states.
- **Quotation & Enquiries**: Product-specific "Enquire Now" modals with React Hook Form + Zod validation.

### 2. Service Booking & Maintenance Portal
- **Service Offerings**: Detailed cards for Certified Installation, Routine Filter Replacement & Sanitization, Breakdown Troubleshooting, and Annual Maintenance Contracts (AMC).
- **Online Service Request Desk**: Submission form for service type, location, preferred date, purifier model, and issue description.
- **Non-E-Commerce Consultation Model**: Transparent disclaimers clarifying that appointments are confirmed by direct phone coordinator consultation.

### 3. Comprehensive Admin Dashboard (`/admin`)
- **Dashboard Overview**: Real-time computed metrics directly from database records (Published products, categories, new enquiries, pending service dispatches, new contact messages).
- **Product Management**: Full CRUD, auto-generated editable slugs, category reassignment, publish/draft toggles, specification editor, and safe deletion.
- **Gallery & 360 Frame Management**: Upload/order gallery images, designate primary thumbnail, edit alt text, and configure 360 viewer sensitivity and frame sequences.
- **Category Management**: Create, edit, and safely delete categories with automated dependency protection (prevents deletion if products are assigned).
- **Service Management**: Create, edit, update pricing display modes, and manage service conditions.
- **Enquiry & Service Request Desks**: Searchable and filterable data tables with status lifecycles (`New`, `Contacted`, `In Progress`, `Resolved`, `Closed`) and private internal staff notes.
- **Website Settings**: Configure business name, helpline numbers, WhatsApp direct chat link, physical address, business hours, hero banner, footer, and Google Maps embed.

---

## 🛠 Technology Stack

- **JavaScript exclusively** (ES Modules, NO TypeScript).
- **Frontend** (`apps/web`):
  - **Framework**: React 18 + Vite
  - **Component Library**: Material UI (MUI v6) with custom theme configuration
  - **Styling**: Tailwind CSS v3 with custom brand blue & aqua palettes
  - **State Management**: Zustand (Auth session, toast notifications, site settings cache)
  - **HTTP Client**: Axios with central interceptors and credentials support
  - **Routing**: React Router v6
  - **Forms & Validation**: React Hook Form + Zod with `@hookform/resolvers/zod`
  - **Icons**: Lucide React
  - **Testing**: Vitest + React Testing Library + JSDOM
- **Backend** (`apps/api`):
  - **Server Engine**: Fastify v4
  - **Database & ODM**: MongoDB Atlas + Mongoose v8
  - **Plugins**: `@fastify/cors`, `@fastify/helmet`, `@fastify/jwt`, `@fastify/cookie`, `@fastify/rate-limit`, `@fastify/multipart`
  - **Authentication**: JWT tokens + HTTP-only cookies + bcryptjs password hashing
  - **Media Storage**: Cloudinary Node.js SDK (with graceful local fallback adapter for zero-credential development)
  - **Logging**: Pino logger integration
  - **Testing**: Node.js built-in test runner (`node:test` + `node:assert`) with Fastify `inject()`

---

## 📁 Monorepo Structure

```
water-purifier-ecommerce/
├── apps/
│   ├── web/                     # React + Vite Frontend Application
│   │   ├── public/              # Static public assets
│   │   └── src/
│   │       ├── components/
│   │       │   ├── common/      # Breadcrumbs, Modal, Toast, FormField, States
│   │       │   ├── layout/      # Header, Footer, PublicLayout, AdminLayout
│   │       │   ├── products/    # ProductCard, ProductGallery, Product360Viewer, EnquiryModal
│   │       │   ├── services/    # ServiceCard, ServiceRequestModal
│   │       │   └── forms/       # EnquiryForm, ServiceRequestForm, ContactForm
│   │       ├── pages/
│   │       │   ├── home/        # HomePage
│   │       │   ├── products/    # ProductsPage, ProductDetailPage
│   │       │   ├── services/    # ServicesPage
│   │       │   ├── contact/     # ContactPage
│   │       │   ├── about/       # AboutPage
│   │       │   ├── faq/         # FAQPage
│   │       │   ├── legal/       # PrivacyPage, TermsPage
│   │       │   └── admin/       # AdminLoginPage, AdminDashboardPage, AdminProductsPage, ...
│   │       ├── stores/          # authStore, toastStore, settingsStore
│   │       ├── services/        # Centralized Axios API client
│   │       ├── schemas/         # Zod schemas for forms
│   │       ├── theme/           # Material UI centralized theme
│   │       ├── test/            # Vitest component test suites
│   │       ├── App.jsx          # Route definitions
│   │       └── main.jsx         # App mounting
│   │
│   └── api/                     # Node.js + Fastify Backend Application
│       ├── scripts/             # seed.js (Admin bootstrap & demo catalogue)
│       ├── src/
│       │   ├── config/          # env.js, db.js, store.js, seed-data.js
│       │   ├── plugins/         # cors, helmet, auth, rate-limit, cloudinary, error-handler
│       │   ├── modules/
│       │   │   ├── auth/        # Admin authentication controller & routes
│       │   │   ├── categories/  # Category models & controllers
│       │   │   ├── products/    # Product models, gallery & 360 viewer controllers
│       │   │   ├── services/    # Service packages controllers
│       │   │   ├── enquiries/   # Product enquiries controllers
│       │   │   ├── service-requests/ # Customer service bookings
│       │   │   ├── contact/     # General contact messages
│       │   │   ├── faqs/        # Knowledgebase FAQs
│       │   │   ├── settings/    # Public & admin website settings
│       │   │   ├── dashboard/   # Live metrics calculation
│       │   │   ├── media/       # Cloudinary asset management
│       │   │   └── health/      # Health check endpoint
│       │   ├── utils/           # response.js, slugify.js
│       │   ├── app.js           # Fastify application builder
│       │   └── server.js        # Server listener and graceful shutdown
│       └── tests/               # API route integration tests
├── package.json                 # Monorepo workspaces configuration
├── .gitignore                   # Ignore node_modules, build artifacts, .env
├── .env.example                 # Root environment variable documentation
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on v22.19.0).
- **npm**: v9.0.0 or higher.
- *(Optional)*: MongoDB Atlas connection string and Cloudinary account credentials.

### 2. Installation
From the root directory, install all dependencies across all workspaces:
```bash
npm install
```

### 3. Environment Setup
Create environment files from the provided templates:
```bash
# In the root or apps/api/
copy .env.example apps/api/.env
copy apps/web/.env.example apps/web/.env
```

**Key Backend Variables (`apps/api/.env`):**
```ini
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/AquaCare_db
JWT_SECRET=your_jwt_secret_key_minimum_32_characters
COOKIE_SECRET=your_cookie_secret_key_minimum_32_characters
CORS_ORIGIN=http://localhost:5173
ADMIN_NAME=Admin AquaCare
ADMIN_EMAIL=admin@AquaCare.com
ADMIN_PASSWORD=Admin@123456
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Key Frontend Variable (`apps/web/.env`):**
```ini
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

> **Zero-Credential Local Mode**: If you do not have a live MongoDB Atlas URI or Cloudinary credentials immediately available, the application automatically activates high-fidelity fallback repositories and mock adapters. The public website, admin portal, 360 viewer, forms, and tests work immediately right out of the box!

### 4. Seed Database & Bootstrap Admin
To populate MongoDB Atlas with initial purifier categories, products, services, FAQs, and create the initial admin user:
```bash
npm run seed
```

**Default Admin Credentials:**
- **URL**: `http://localhost:5173/admin/login`
- **Email**: `admin@AquaCare.com`
- **Password**: `Admin@123456`

### 5. Running the Application Locally
Run backend and frontend concurrently:
```bash
# Start backend API (Port 5000)
npm run dev:api

# In another terminal, start frontend (Port 5173)
npm run dev:web
```

Open your browser at:
- **Public Website**: `http://localhost:5173/`
- **Product Catalogue**: `http://localhost:5173/products`
- **Service Booking**: `http://localhost:5173/services`
- **Admin Portal**: `http://localhost:5173/admin`
- **Backend Health Check**: `http://localhost:5000/api/v1/health`

---

## 🧪 Testing and Verification

Run backend integration tests:
```bash
npm run test:api
```

Run frontend component tests:
```bash
npm run test:web
```

Run the entire suite together:
```bash
npm run test
```

Build the production frontend bundle:
```bash
npm run build
```

---

## 📡 REST API Summary (`/api/v1`)

| Endpoint | Method | Access | Description |
|---|---|---|---|
| `/health` | `GET` | Public | Returns service uptime and connectivity status |
| `/auth/login` | `POST` | Public | Admin login (sets JWT cookie + bearer token) |
| `/auth/logout` | `POST` | Public | Clears admin session cookie |
| `/auth/me` | `GET` | Protected | Returns authenticated admin profile |
| `/categories` | `GET` | Public | List published product categories |
| `/categories/:slug` | `GET` | Public | Get category details by slug |
| `/products` | `GET` | Public | Search, filter, paginate published purifiers |
| `/products/:slug` | `GET` | Public | Product details, gallery images, 360 config, related items |
| `/services` | `GET` | Public | List published service packages |
| `/enquiries` | `POST` | Public | Submit customer product quotation/enquiry |
| `/service-requests`| `POST` | Public | Submit technician appointment request |
| `/contact` | `POST` | Public | Submit general contact message |
| `/faqs` | `GET` | Public | Get published frequently asked questions |
| `/settings/public`| `GET` | Public | Safe public business contact and hero configuration |
| `/dashboard/stats`| `GET` | Protected | Real-time computed database metrics & recent submissions |
| `/products/admin/all` | `GET` | Protected | List all products including drafts |
| `/products/admin` | `POST` | Protected | Create new water purifier product |
| `/products/admin/:id` | `PUT` | Protected | Update product details & specifications |
| `/products/admin/:id/publish` | `PATCH` | Protected | Toggle published / draft status |
| `/products/admin/:id` | `DELETE` | Protected | Delete product |
| `/categories/admin/all` | `GET` | Protected | List all categories |
| `/categories/admin` | `POST` | Protected | Create category |
| `/categories/admin/:id` | `DELETE` | Protected | Safely delete category (blocks if products assigned) |
| `/enquiries/admin/all` | `GET` | Protected | List customer enquiries with status filtering |
| `/enquiries/admin/:id` | `PATCH` | Protected | Update status & internal notes (never public) |
| `/service-requests/admin/all` | `GET` | Protected | List service requests |
| `/service-requests/admin/:id` | `PATCH` | Protected | Update dispatch status & technician notes |
| `/settings/admin` | `PUT` | Protected | Update global business information & branding |

---

## 🛡 Security Highlights
- **No Plaintext Passwords**: Uses `bcryptjs` with 10 salt rounds.
- **Protected Endpoints**: Server-side JWT validation on all `/admin/*` operations.
- **Safe Public Projection**: Sensitive admin notes (`internalNotes`) and password hashes are never returned on public APIs.
- **CORS & Rate Limiting**: Strict origins and rate limiting on submission endpoints to prevent spam and abuse.
- **Safe Category Deletion**: Prevents orphaned products by blocking category deletion when products are linked.

---

## 📄 License
MIT License. © 2026 AquaCare Solutions.
