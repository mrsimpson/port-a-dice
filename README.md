# 3D Dice Roller - Mobile Web App

A beautiful mobile-first 3D dice rolling application built with Vue 3, Three.js, and physics simulation.

## Features

- 🎲 Realistic 3D dice with physics-based rolling animations
- 📱 Mobile-first design with touch interactions
- 🎨 Customizable dice colors
- 📍 Parking areas for organizing rolled dice
- 📜 Roll history with persistence
- 💾 Local storage for saving state
- ⚡ PWA support for installation on mobile devices

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

Open your browser to `http://localhost:5173`

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

## Project Structure

```
packages/
  dice-app/          - Vue 3 web application
```

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **3D Graphics**: Three.js
- **Physics**: cannon-es
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest
- **Monorepo**: pnpm + Turborepo
