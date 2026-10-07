# 📱 GREECE Mobile Client

This directory houses the iOS/Android mobile storefront application for the **GREECE** Egyptian Streetwear platform, built using Expo and React Native.

---

## 🛠️ Tech Stack

* **Framework & Build**: React Native (0.81.x) + Expo (v54.x)
* **Routing**: Expo Router (v6.x)
* **Type Safety**: TypeScript
* **State & Fetching**: React Query (TanStack)
* **Optimization**: React Compiler enabled
* **Style Systems**: Custom components with Blur and Glass effects (using `expo-glass-effect`, `expo-blur`, and `expo-linear-gradient`).

---

## 📁 Project Directory Layout

```
greece-mobile/
├── app/                  # Expo Router views (navigation screens, layout entry)
├── assets/               # Branding assets, local fonts (Cinzel, Inter)
├── components/           # Mobile custom component library
├── constants/            # Global theme settings and colors
├── contexts/             # Session, state, and shopping cart providers
├── hooks/                # Custom React hooks (React Query integrations)
├── scripts/              # Expo build and export tools
└── server/               # Dev/preview server files
```

---

## 🧭 Developer Guides

To avoid configuration and guide divergence, all local running setups, styling guides, and build targets are referenced inside the primary documentation portal:

* 🛠️ **[Local Development Setup](../docs/SETUP.md)**: Installing packages, booting the Metro bundler, starting Expo Go, and troubleshooting mobile app errors.
* 📐 **[System Design & Architecture](../docs/ARCHITECTURE.md)**: Repositories layouts, generated network types, and cross-application architectures.
* 🚀 **[Mobile Build & Release](../docs/DEPLOYMENT.md)**: Generating native application bundles (EAS Build), export tasks, and production configurations.
