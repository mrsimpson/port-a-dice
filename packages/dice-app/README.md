# 3D Dice Roller

A beautiful mobile-first 3D dice rolling application built with Vue 3, Three.js, and physics simulation.

## Features

- **3D Dice Rendering**: Realistic 3D dice with physically accurate rendering using Three.js
- **Physics Simulation**: Real physics-based rolling animations powered by cannon-es
- **Touch Interactions**: Optimized for mobile with tap-to-select and gesture controls
- **Parking Areas**: Organize rolled dice into customizable parking areas
- **Roll History**: Keep track of all your rolls with persistent history
- **Color Customization**: Choose from 7 different dice colors
- **PWA Support**: Install on your mobile device for a native app experience
- **Local Persistence**: All state saved to localStorage

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open your browser to `http://localhost:5173`

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

## Usage

### Adding Dice

1. Select a color from the color picker
2. Click "Add Dice" to add a new die
3. Repeat to add more dice

### Rolling Dice

- Click "Roll" to roll all dice
- Tap a die to select it, then click "Roll" to roll only selected dice
- Watch the physics simulation in action

### Parking Areas

- Tap a parking area to assign selected dice to it
- Click the edit icon to rename or delete an area
- Click the "+" button to add new parking areas

### History

- Click the clock icon in the header to view roll history
- See all past rolls with timestamps
- Clear history when needed

### Reset

- Click "Reset" to remove all dice and start fresh
- Confirm the action in the dialog

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **3D Graphics**: Three.js
- **Physics**: cannon-es
- **State Management**: Pinia with persistence
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Testing**: Vitest

## Project Structure

```
src/
  components/       - Vue components
  composables/      - Vue composables (Three.js integration)
  stores/           - Pinia stores
  types/            - TypeScript type definitions
  utils/            - Utility functions
  App.vue           - Main app component
  main.ts           - App entry point
  style.css         - Global styles
```

## Future Enhancements

- Add backend integration for config storage (Supabase ready)
- Implement dice sharing between users
- Add more dice types (d4, d8, d10, d12, d20)
- Custom dice skins and textures
- Sound effects for rolling
- Haptic feedback improvements

## License

MIT
