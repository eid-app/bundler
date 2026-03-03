# Bundler App

A zero-config Node.js CLI utility to package native binaries into distributable macOS application bundles (`.app`).

Designed for developers using cross-compilation tools, this bundler automates the final packaging stage by generating the necessary macOS structure and metadata.

## Features

* **Dual Architecture**: Supports both `x86_64` (Intel) and `aarch64` (Apple Silicon) macOS targets.
* **Smart Manifests**: Dynamically injects your application name and icon into the `Info.plist`.
* **Permissions**: Automatically handles `chmod +x` for the generated binaries inside the bundle.
* **Linux Ready**: Architected to support Linux packaging formats in future updates.

## Installation

### For Users

Install it as a development dependency via npm:

```bash
npm install --save-dev bundler-app

```

### For Local Testing (Development)

To test the bundler locally without publishing to npm:

1. In the **bundler-app** directory:
```bash
npm link

```


2. In your **target project** directory:
```bash
npm link bundler-app

```



## Configuration

The bundler reads your project's `package.json` to configure the bundle:

```json
{
  "name": "my-awesome-app",
  "bundler": {
    "icons": {
      "mac": "assets/icon.icns"
    }
  }
}

```

* **`name`**: Used for the `.app` filename and the internal executable name.
* **`bundler.icons.mac`**: Path to your `.icns` file relative to your project root (defaults to `AppIcon.icns`).

## Usage

Ensure your compiled binaries are located in a `dist/` folder at the root of your project, following this naming convention:

* `dist/your-app-name_mac_intel`
* `dist/your-app-name_mac_arm`

Then, run the bundler:

```bash
npx bundler-app

```

The tool will generate the finalized `.app` bundles inside your `dist/` directory.

## Roadmap

* [ ] **Linux Support**: Implementation of common Linux distribution formats.

## License

MIT - Developed by **eid-app**.

---
