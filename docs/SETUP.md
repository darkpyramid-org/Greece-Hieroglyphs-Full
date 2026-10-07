# 🛠️ Development Setup Guide

Welcome to the **GREECE** developer guide! This document is the single source of truth for configuring your local workspace, running the development environment, managing environment variables, writing code, and submitting contributions.

---

## 📋 Prerequisites

Before setting up the repository, ensure your local machine satisfies these requirements:

* **Node.js**: `18.x` or `20.x` (LTS versions recommended)
* **npm**: `9.x` or higher
* **pnpm**: `9.x` or higher (required for `greece-mobile` workspace dependencies)
* **Git**: `2.x` or higher
* **Expo Go**: Installed on a physical mobile device, or a set-up Android Emulator / iOS Simulator.

---

## 🚀 Getting Started

### 1. Clone the Repository

Clone the project to your local workspace and navigate to the root directory:

```bash
git clone https://github.com/Mostafa-SAID7/greece-hieroglyphs-full.git
cd greece-hieroglyphs-full
```

### 2. Workspace Installation

The repository contains three primary directories: `api-server` (backend API), `greece` (web storefront), and `greece-mobile` (Expo mobile client). You must install dependencies in all folders.

> [!NOTE]
> * For the backend dependencies, the `--legacy-peer-deps` flag is required to handle legacy peer dependency trees.
> * The mobile client utilizes `pnpm` to manage package dependencies.

```bash
# Install backend dependencies
cd api-server
npm install --legacy-peer-deps

# Install frontend web dependencies
cd ../greece
npm install

# Install mobile client dependencies
cd ../greece-mobile
pnpm install
```

---

## ⚙️ Environment Configuration

The backend server is configured via environment variables.

Copy the `.env.example` file to create a local `.env` configuration:

```bash
cd ../api-server
cp .env.example .env
```

### Environment Variables Registry

| Variable Name | Required | Default Value | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | No | `3001` | The port the backend server will listen on. |
| `NODE_ENV` | No | `development` | Environment mode (`development` or `production`). |
| `STRIPE_SECRET_KEY` | No | *None* | Stripe secret key. If left blank, the server automatically uses a mock checkout flow. |
| `CORS_ORIGINS` | No | *None* | Comma-separated list of allowed origins. Defaults to common localhost origins if not specified. |

---

## 🏃 Running Locally

To run the application, start the backend, frontend, and mobile dev servers in separate terminal sessions:

### Terminal 1: Backend Server

```bash
cd api-server
npm run dev
```
* **Endpoint**: `http://localhost:3001`
* **Swagger Documentation**: `http://localhost:3001/api-docs`

### Terminal 2: Frontend Web Storefront

```bash
cd greece
npm run dev
```
* **Endpoint**: `http://localhost:5173`

### Terminal 3: Mobile Storefront (Metro Bundler)

```bash
cd greece-mobile
pnpm dev
```
* **Metro URL**: `http://localhost:8081`
* **Run on iOS**: Press `i` in the Metro console to boot the simulator.
* **Run on Android**: Press `a` in the Metro console to boot the emulator.
* **Run on Physical Device**: Scan the QR code displayed in the terminal using your phone's camera (iOS) or the Expo Go app (Android).

---

## 📜 Available Scripts

Here is a quick reference for the scripts defined in each component package:

### Backend Express Server (`api-server/`)

* `npm run dev`: Starts the development server with automated hot-reloading (via `ts-node-dev`).
* `npm run build`: Compiles TypeScript source files to JavaScript in the `dist/` directory.
* `npm start`: Runs the built production server using `node`.
* `npm run typecheck`: Runs the TypeScript compiler (`tsc`) in dry-run mode to validate types.

### Frontend Storefront (`greece/`)

* `npm run dev`: Starts the Vite development server with hot-module replacement (HMR).
* `npm run build`: Bundles assets for production into the `dist/` directory.
* `npm run preview`: Statically serves the production build locally for verification.
* `npm run typecheck`: Performs full type checks using the TypeScript compiler.

### Mobile Client (`greece-mobile/`)

* `pnpm dev`: Starts the Metro development bundler via Expo CLI.
* `pnpm start`: Alias for starting the Metro bundler.
* `pnpm android`: Starts the Metro bundler and runs the app on Android.
* `pnpm ios`: Starts the Metro bundler and runs the app on iOS (macOS only).

---

## 🔌 API Code Generation & Specs

The frontend API client is auto-generated directly from the backend's OpenAPI specification using **Orval**.

If you make modifications to the API endpoints or spec schemas:

1. Update the specification JSON file:
   `api-server/src/api-spec/openapi.json`
2. Run code generation to update types on both frontend and backend:
   ```bash
   cd api-server/api-spec
   npm run codegen
   ```
3. This will rebuild:
   * **Frontend API Client**: `greece/src/api/generated/`
   * **Backend Shared Types**: `api-server/src/api/generated/`

---

## 🧪 Manual API Verification

You can manually trigger and inspect backend endpoints using standard `curl` commands:

### Server Health Check
```bash
curl http://localhost:3001/api/healthz
```

### Submit Contact Form
```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "subject": "Collab Query",
    "message": "Love the streetwear collection!"
  }'
```

### Initialize E-Commerce Checkout
```bash
curl -X POST http://localhost:3001/api/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product": {
          "name": "HORUS HOODIE",
          "price": 1200
        },
        "quantity": 1
      }
    ],
    "successUrl": "http://localhost:5173/success",
    "cancelUrl": "http://localhost:5173/cancel"
  }'
```

---

## 🛠️ Troubleshooting

### 1. Port Conflict ("Address already in use")
If ports `3001`, `5173`, or `8081` are occupied by other services:
* **For Backend**: Define a different port in your environment:
  ```bash
  PORT=3002 npm run dev
  ```
* **For Frontend Web**: Pass the port flag directly to Vite:
  ```bash
  npm run dev -- --port 5174
  ```
* **For Mobile Client**: Force Metro to bind to a different port:
  ```bash
  pnpm dev --port 8082
  ```

### 2. CORS Issues
If the frontend cannot communicate with the backend due to CORS security policies, verify that the frontend domain is registered in the backend's `.env` configuration:
```
CORS_ORIGINS=http://localhost:5173,http://localhost:8081
```

### 3. Stripe Checkout Fails
* If you want to use real Stripe integration, ensure your key is valid and prefixed with `sk_test_`.
* If no key is set, the API will use a fallback mock checkout which routes seamlessly to the success URL.

### 4. Expo / Metro Cache Mismatch
If you encounter layout or resolution errors in the mobile client:
* Clear Metro's bundler cache:
  ```bash
  pnpm dev -c
  ```

### 5. Deep Clean / Hard Reinstall
If you run into dependency mismatches or corrupt cache errors, execute this clean script inside the root directory to purge and re-initialize both modules:

```bash
# Clean backend
cd api-server
rm -rf node_modules dist
npm install --legacy-peer-deps

# Clean frontend web
cd ../greece
rm -rf node_modules dist
npm install

# Clean mobile client
cd ../greece-mobile
rm -rf node_modules
pnpm install
```

---

## 🤝 Engineering & Contribution Rules

### Git Branch Strategy

* `feature/your-feature`: Adding new capabilities.
* `fix/your-fix`: Bug resolution.
* `docs/your-doc-update`: Restructuring docs.
* `refactor/your-refactor`: Non-functional code changes.

### Conventional Commits Format

Follow structured commit syntax to keep histories clean and parseable:

```
<type>(<scope>): <short summary>

[Optional body text detailing the changes and design reasoning]

[Optional footer references like Closes #12]
```

#### Example Commits:
* `feat(checkout): support checkout discount coupon applications`
* `fix(frontend): adjust navbar mobile menu alignment`
* `docs(readme): clean up outdated setup instructions`
