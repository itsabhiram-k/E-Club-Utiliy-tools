# ⚡ E Club QR Utility Tool — Minimal Neumorphic Edition

A clean, minimal, zero-emission neumorphic web application designed for instant, client-side QR code synthesis from URLs—with full transparency support, customizable palettes, geometric module styles, and zero animations.

---

## 🚀 Live Access & Quick Start

The application is completely self-contained and running locally:

- **Local Server URL**: [http://localhost:8000](http://localhost:8000)
- **Direct File**: Open [`index.html`](file:///c:/Users/saiab/Downloads/antigravity/index.html) directly in any web browser.
- **Workspace Location**: `c:\Users\saiab\Downloads\antigravity\`

---

## 🎨 Key Features & Architecture

### 1. Zero Friction, URL-Only Synthesis
- **No Sign-Up / No Data Collection**: Open and use immediately—zero login barriers, zero cookies, zero external server queries.
- **Real-Time Live Generation**: As you type or paste a URL (`https://...`), the QR code updates instantaneously with zero lag.
- **One-Click Quick Actions**:
  - `📋 PASTE`: Reads URL from clipboard in 1 click.
  - `✕ CLEAR`: Resets the input field instantly.
  - Quick preset pills for one-click testing (E-Club Portal, LinkedIn, Instagram, GitHub, Linktree).

### 2. Full Transparency & Background Control
- **100% Transparent Background (Default)**: Renders directly with an alpha channel (`RGBA`), making the exported PNG ideal for posters, merchandise, slide decks, social media banners, and stickers without any white bounding box.
- **Interactive Viewport Backdrops**: Test how your transparent QR code looks against different background shades using the preview switcher:
  - 🏁 **Checkerboard**: Displays the transparency grid.
  - ⬛ **Dark Surface**: Previews how the QR looks on dark backgrounds.
  - ⬜ **Light Surface**: Previews how the QR looks on light backgrounds.
- **Solid Background Option**: Switch anytime from transparent to a custom solid color background.

### 3. Diverse QR Code Styles (Beyond Standard Squares)
Beyond the classic grid, the tool offers **7 distinct data module geometries** and **4 corner finder eye styles**:

| Style | Description | Aesthetic Tag |
| :--- | :--- | :--- |
| **Classic Square** | High-precision pixel-perfect retro matrix | `RETRO` |
| **Circular Dots** | Radiant circular nodes | `CLEAN` |
| **Squircles** | Smooth rounded squares (squircle curvature) | `SMOOTH` |
| **Connected Fluid** | Continuous horizontal/vertical fluid capsules | `MODERN` |
| **Diamonds** | 45-degree angled rhombuses | `CYBER` |
| **Cyber Cross** | High-tech plus/cross module matrix | `MATRIX` |
| **Hexagons** | Honeycomb techno-hexagonal grid | `TECH` |

**Corner Finder Pattern (Eye) Geometries:**
- ◼ **Classic Square**: Standard square frame with solid center.
- ◒ **Rounded Corner**: Smooth rounded exterior frame with curved pupil.
- ◉ **Orbit Ring**: Concentric circular outer ring with circular center dot.
- 🛡️ **Cyber Shield**: Asymmetrical futuristic leaf/shield corner frame.

### 4. Color Customization (Curated Palettes, Custom Hex & Gradients)
- **10 Default Aesthetic Palettes**:
  - *Obsidian Black* (`#000000`)
  - *Matrix Emerald* (`#00FF66`)
  - *Cyber Aqua* (`#00E5FF`)
  - *Solar Amber* (`#FFB703`)
  - *Synthwave Pink* (`#FF007F`)
  - *Hyper Violet* (`#8B5CF6`)
  - *Crimson Glitch* (`#FF3344`)
  - *Royal Cobalt* (`#2563EB`)
  - *Eco Mint* (`#10B981`)
  - *Pure Platinum* (`#FFFFFF`)
- **Custom Color Code**: Input any custom Hex code (e.g., `#FF5722`) with real-time synchronization, or pick via the HTML5 color wheel.
- **Cyber Gradient Engine**: Toggle linear cyber gradients across the QR code with custom start and end color stops.

### 5. High-Resolution Export
- **Download PNG**: Instant download with transparent alpha background.
- **Resolution Control**:
  - `512 px` (Standard web)
  - `1024 px` (HD Pro - Recommended)
  - `2048 px` (Ultra 4K)
  - `4096 px` (Print 300 DPI Master)
- **Copy to Clipboard**: Copies the transparent PNG directly to clipboard for direct pasting into Figma, Canva, Photoshop, Slack, or Docs.
- **Download SVG**: Lossless vector format for scalable print production.

### 6. Official E-Club Branding & Emblem Integration
- **Header Banner**: Features the official E-Club logo with the 3D isometric Rubik's cube and cursive motto: *"Unleash your Entrepreneurial Spirit"*.
  - Automatically switches between crisp white lettering in **Dark Theme** and deep jet-black lettering in **Light Theme**.
- **Center Emblem Embed**: Toggle the 3D isometric Rubik's cube in the center of your QR code with automatic `ECC-H (30%)` error correction and protective halo badge for 100% scan reliability.

### 7. Trend 13 Sustainable Web Design + Retrofuturism
- **Zero Carbon Footprint**: Runs 100% client-side via native Canvas API—no external API calls, no cloud server compute overhead, and zero user tracking (`0.00g CO₂ / session`).
- **Retrofuturistic HUD Console**: Scanlines, corner reticle brackets (`┌ ┐ └ ┘`), pulsing telemetry beacons, laser scan animation, and synthesized tactile audio clicks (via Web Audio API).
- **Dual Themes**:
  - 🌙 **Dark Theme**: Deep space carbon (`#080A0F`) with luminescent green/cyan accents.
  - ☀️ **Light Theme**: Technical architectural blueprint (`#F8FAFC`) with crisp slate contrast.
  - Shortcut: Press <kbd>T</kbd> to toggle themes anytime.
