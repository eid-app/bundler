#!/usr/bin/env node

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { readFileSync, cpSync, mkdirSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USER_CWD = process.cwd();
const DIST_DIR = path.join(USER_CWD, 'dist');

// Load the user project's package.json
const USER_PKG_PATH = path.join(USER_CWD, 'package.json');
const SRC_MAC_TEMPLATE = path.join(__dirname, 'mac.app');

const userPackageJson = JSON.parse(readFileSync(USER_PKG_PATH, 'utf8'));

const APP_NAME = userPackageJson.name || 'app';
const SRC_MAC_ICON = path.join(USER_CWD, userPackageJson.quickJs?.icons?.mac ?? 'AppIcon.icns');

const targets = [
//   { id: 'x86_64-windows-gnu', app: `${APP_NAME}_win64.exe` },
//   { id: 'x86-windows-gnu', app: `${APP_NAME}_win32.exe` },
//   { id: 'x86_64-linux-gnu', app: `${APP_NAME}_linux64` },
//   { id: 'x86-linux-gnu', app: `${APP_NAME}_linux32` },
  { id: 'x86_64-macos', app: `${APP_NAME}_mac_intel`, isMac: true, bundleSuffix: 'mac_intel' },
  { id: 'aarch64-macos', app: `${APP_NAME}_mac_arm`, isMac: true, bundleSuffix: 'mac_arm' }
];

// ==========================================================
// PACKAGING MACOS BUNDLE
// ==========================================================
console.log(`\n=== STAGE 3: Packaging MacOS Bundles ===`);
targets.filter(t => t.isMac).forEach(target => {
    const bundlePath = path.join(DIST_DIR, `${APP_NAME}_${target.bundleSuffix}.app`);
    const destIcon = path.join(bundlePath, 'Contents', 'Resources', 'AppIcon.icns');
    const destBinary = path.join(bundlePath, 'Contents', 'MacOS', APP_NAME);
    const infoPlist = path.join(bundlePath, 'Contents', 'Info.plist');
    try {
        const plist = readFileSync(path.join(SRC_MAC_TEMPLATE, 'Contents', 'Info.plist')).toString();
        cpSync(SRC_MAC_TEMPLATE, bundlePath, { recursive: true });
        if (existsSync(SRC_MAC_ICON)) {
            cpSync(SRC_MAC_ICON, destIcon, { recursive: true });
        }
        writeFileSync(infoPlist, plist.replaceAll('#APP_NAME#', APP_NAME));
        mkdirSync(path.dirname(destBinary), { recursive: true });
        cpSync(path.join(DIST_DIR, target.app), destBinary);
        execSync(`chmod +x "${destBinary}"`);
        console.log(`✅ Bundle ready: ${bundlePath}`);
    } catch (err) {
        console.error(`❌ Packaging failed for ${target.id}`);
        console.error(err.message);
    }
});
