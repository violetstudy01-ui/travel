# Travel Explorer

Travel Explorer is a React Native and Expo travel discovery app focused on curated destinations across India. It includes Discover, Search, and Wishlist tabs, destination detail pages, category filters, related destinations, and locally persisted wishlist storage.

## Requirements

- macOS on Apple Silicon or Intel
- Node.js with npm
- Visual Studio Code
- An iOS Simulator, Android Emulator, or Expo Go-compatible phone for native preview

The project uses Expo SDK 57, Expo Router, React Native, and AsyncStorage. Destination and attraction content is bundled locally. No backend or login is required for the app's core features.

## Extract and open on macOS

1. Double-click the downloaded ZIP in Finder, or Control-click it and choose **Open With > Archive Utility**.
2. Open Terminal and move into the extracted folder:

```bash
cd /path/to/Travel-Explorer
```

3. Open the project in VS Code:

```bash
code .
```

If the `code` command is unavailable, open VS Code and choose **File > Open Folder**.

## Install and run

From the project folder, install the locked dependency set:

```bash
npm install
```

Start the Expo development server with the existing project script:

```bash
npm run dev
```

Use the Expo developer menu to open the app in an available iOS Simulator, Android Emulator, or compatible Expo Go device. The app can also be exported for web with:

```bash
npm run build:web
```

## Environment variables

The current Travel Explorer experience does not require environment variables because destination content and wishlist storage are local. The backup includes `.env.example` with safe placeholders for the existing Expo public Supabase variable names, but no private credentials are included.

If you later enable a feature that uses those services, copy the example file to `.env` and fill in the values supplied by that service. Never commit `.env` to source control.

## Useful checks

```bash
npm run typecheck
npm run lint
```

## Troubleshooting

- If dependencies appear incomplete, remove the extracted project's `node_modules` folder if one exists and run `npm install` again. The backup does not include `node_modules`.
- If Expo reports a stale cache, stop the development server and start it again from the project folder.
- If `code .` is not recognized, use VS Code's **File > Open Folder** menu instead.
- If a simulator is not available, run the Expo server and open the project with a compatible Expo Go device on the same network.
- If a remote travel image is unavailable, the app shows its built-in neutral image fallback instead of a broken-image indicator.
# Travel-explorer
