/**
 * E CLUB QR UTILITY TOOL
 * Pure Client-Side Vector QR Synthesis Engine
 * Sustainable Architecture • Trend 13 • Retrofuturism HUD
 */

(() => {
  'use strict';

  // --- AUDIO SYNTHESIS ENGINE (Tactile Retro Clicks) ---
  const AudioEngine = {
    ctx: null,
    enabled: true,

    init() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      } catch (e) {
        this.enabled = false;
      }
    },

    playClick(freq = 880, type = 'sine', duration = 0.02) {
      if (!this.enabled) return;
      try {
        if (!this.ctx) this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.4, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Silent catch for audio policy
      }
    },

    playSuccess() {
      this.playClick(1046.5, 'sine', 0.05);
      setTimeout(() => this.playClick(1318.5, 'sine', 0.06), 40);
    }
  };

  // --- PRELOAD LOGO ASSETS FOR CENTER EMBED & HEADER ---
  const assets = {
    cubeLight: new Image(),
    cubeDark: new Image(),
    loaded: false
  };

  assets.cubeLight.src = 'cube-icon.png';
  assets.cubeDark.src = 'cube-icon-dark.png';
  let loadedCount = 0;
  const onAssetLoad = () => {
    loadedCount++;
    if (loadedCount >= 2) assets.loaded = true;
    renderQR();
  };
  assets.cubeLight.onload = onAssetLoad;
  assets.cubeDark.onload = onAssetLoad;

  // --- COLOR METADATA LOOKUP ---
  const ColorNames = {
    '#000000': 'OBSIDIAN BLACK',
    '#0A0A0A': 'NEO BLACK',
    '#00FF66': 'MATRIX EMERALD',
    '#00E5FF': 'CYBER AQUA',
    '#FFB703': 'SOLAR AMBER',
    '#FF007F': 'SYNTHWAVE PINK',
    '#8B5CF6': 'HYPER VIOLET',
    '#FF3344': 'CRIMSON GLITCH',
    '#2563EB': 'ROYAL COBALT',
    '#10B981': 'ECO MINT',
    '#FFFFFF': 'PURE PLATINUM'
  };

  // --- APPLICATION STATE ---
  const urlParams = new URLSearchParams(window.location.search);
  const initialTheme = urlParams.get('theme') || localStorage.getItem('eclub_theme') || 'dark';
  const defaultColor = initialTheme === 'dark' ? '#00FF66' : '#000000';

  const state = {
    url: '',
    fillMode: 'solid', // 'solid' | 'gradient'
    color: defaultColor,
    gradStart: '#00e5ff',
    gradEnd: '#ff007f',
    bgMode: 'transparent', // 'transparent' | 'solid'
    bgColor: '#ffffff',
    shape: 'squares', // 'squares' | 'dots' | 'squircles' | 'connected' | 'diamonds' | 'crosses' | 'hexagons'
    eyeStyle: 'square', // 'square' | 'rounded' | 'orbit' | 'shield'
    embedLogo: false,
    resolution: 1024,
    theme: initialTheme,
    audioMuted: localStorage.getItem('eclub_audio') === 'muted',
    backdrop: 'checkerboard'
  };

  AudioEngine.enabled = !state.audioMuted;

  // --- DOM ELEMENT REFERENCES ---
  const elements = {
    urlInput: document.getElementById('urlInput'),
    charCounter: document.getElementById('charCounter'),
    pasteBtn: document.getElementById('pasteBtn'),
    clearBtn: document.getElementById('clearBtn'),
    sampleChips: document.querySelectorAll('.sample-chip'),
    
    // Fill mode & colors
    fillSolidBtn: document.getElementById('fillSolidBtn'),
    fillGradientBtn: document.getElementById('fillGradientBtn'),
    solidColorRow: document.getElementById('solidColorRow'),
    gradientControlsRow: document.getElementById('gradientControlsRow'),
    paletteSwatches: document.querySelectorAll('.color-swatch'),
    nativeColorPicker: document.getElementById('nativeColorPicker'),
    pickerSwatchPreview: document.getElementById('pickerSwatchPreview'),
    hexInput: document.getElementById('hexInput'),
    colorNameBadge: document.getElementById('colorNameBadge'),

    // Gradients
    gradStartPicker: document.getElementById('gradStartPicker'),
    gradStartHex: document.getElementById('gradStartHex'),
    gradEndPicker: document.getElementById('gradEndPicker'),
    gradEndHex: document.getElementById('gradEndHex'),
    gradPresetBtns: document.querySelectorAll('.grad-preset-btn'),

    // Background
    bgTransparentBtn: document.getElementById('bgTransparentBtn'),
    bgSolidBtn: document.getElementById('bgSolidBtn'),
    solidBgControls: document.getElementById('solidBgControls'),
    bgColorPicker: document.getElementById('bgColorPicker'),
    bgHexInput: document.getElementById('bgHexInput'),
    solidPresets: document.querySelectorAll('.solid-presets .mini-swatch'),

    // Shapes & Eyes
    styleCards: document.querySelectorAll('.style-card'),
    eyeButtons: document.querySelectorAll('#eyeStyleControl .segment-btn'),
    embedLogoToggle: document.getElementById('embedLogoToggle'),

    // Resolution
    resButtons: document.querySelectorAll('#resControl .segment-btn'),

    // Viewport & Canvas
    canvas: document.getElementById('qrCanvas'),
    canvasContainer: document.getElementById('canvasContainer'),
    backdropBtns: document.querySelectorAll('.backdrop-btn'),
    transparencyStatusTag: document.getElementById('transparencyStatusTag'),

    // Telemetry
    tFormat: document.getElementById('tFormat'),
    tRes: document.getElementById('tRes'),
    tEcc: document.getElementById('tEcc'),
    tMatrix: document.getElementById('tMatrix'),

    // Export buttons
    downloadPngBtn: document.getElementById('downloadPngBtn'),
    copyPngBtn: document.getElementById('copyPngBtn'),
    downloadSvgBtn: document.getElementById('downloadSvgBtn'),

    // Navigation & Global
    brandLogo: document.getElementById('brandLogo'),
    themeToggle: document.getElementById('themeToggle'),
    audioToggle: document.getElementById('audioToggle'),
    audioIcon: document.getElementById('audioIcon'),
    toast: document.getElementById('toastNotification'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage')
  };

  // --- INITIALIZE THEME ---
  function applyTheme(newTheme) {
    state.theme = newTheme;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('eclub_theme', newTheme);

    if (newTheme === 'dark') {
      elements.brandLogo.src = 'logo-dark.png';
      // In dark mode default to pure platinum or cyber aqua if black was active
      if (state.color === '#000000' && state.bgMode === 'transparent') {
        // If user hasn't explicitly customized, white QR on dark background looks brilliant!
        // But user can pick any color!
      }
    } else {
      elements.brandLogo.src = 'logo.png';
    }

    renderQR();
  }

  // --- HELPER: SHOW TOAST ---
  let toastTimer = null;
  function showToast(message, icon = '✓') {
    elements.toastMessage.textContent = message;
    elements.toastIcon.textContent = icon;
    elements.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      elements.toast.classList.remove('show');
    }, 2800);
  }

  // --- HELPER: NORMALIZE HEX ---
  function normalizeHex(hex) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    return '#' + hex.toUpperCase();
  }

  // --- QR RENDERING CORE ---
  function renderQR() {
    const text = state.url.trim();
    const canvas = elements.canvas;
    const ctx = canvas.getContext('2d');

    // Update Telemetry character count
    elements.charCounter.textContent = `${text.length} chars`;

    // Set canvas dimension
    canvas.width = state.resolution;
    canvas.height = state.resolution;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render Background
    if (state.bgMode === 'solid') {
      ctx.fillStyle = state.bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      elements.transparencyStatusTag.textContent = 'Solid Color';
      elements.tFormat.textContent = 'PNG (Opaque)';
    } else {
      elements.transparencyStatusTag.textContent = 'Transparent Alpha';
      elements.tFormat.textContent = 'PNG (RGBA)';
    }

    elements.tRes.textContent = `${state.resolution} × ${state.resolution} px`;

    // If input is empty, show clean aesthetic empty state prompt
    if (!text) {
      elements.tEcc.textContent = 'Awaiting URL';
      elements.tMatrix.textContent = '—';

      ctx.save();
      const isDark = state.theme === 'dark';
      
      // Dashed boundary
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';
      ctx.lineWidth = Math.round(canvas.width * 0.0035);
      ctx.setLineDash([Math.round(canvas.width * 0.015), Math.round(canvas.width * 0.015)]);
      const margin = canvas.width * 0.12;
      ctx.strokeRect(margin, margin, canvas.width - margin * 2, canvas.height - margin * 2);

      // Icon & Message
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isDark ? '#64748b' : '#94a3b8';
      ctx.font = `${Math.round(canvas.width * 0.09)}px sans-serif`;
      ctx.fillText('🔗', canvas.width / 2, canvas.height / 2 - canvas.width * 0.04);
      ctx.font = `600 ${Math.round(canvas.width * 0.034)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillText('Enter your URL above to generate QR code', canvas.width / 2, canvas.height / 2 + canvas.width * 0.05);
      ctx.restore();
      return;
    }

    // Determine Error Correction Level
    // If embedding logo, require high redundancy (H = 30%)
    const eccLevel = state.embedLogo ? 'H' : 'M';
    elements.tEcc.textContent = state.embedLogo ? 'ECC-H (30% HIGH)' : 'ECC-M (15% MED)';

    let qr;
    try {
      qr = qrcode(0, eccLevel);
      qr.addData(text);
      qr.make();
    } catch (err) {
      console.warn('QR make failed with automatic version, falling back:', err);
      try {
        qr = qrcode(4, eccLevel);
        qr.addData(text);
        qr.make();
      } catch (err2) {
        console.error('Fatal QR generation error:', err2);
        return;
      }
    }

    const moduleCount = qr.getModuleCount();
    elements.tMatrix.textContent = `${moduleCount} × ${moduleCount}`;

    // Geometry Calculation
    const quietZone = 3.5; // Modules of quiet border margin
    const totalModules = moduleCount + quietZone * 2;
    const cellSize = canvas.width / totalModules;
    const offset = quietZone * cellSize;

    // Setup Fill Color / Gradient
    let fillStyle;
    if (state.fillMode === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, state.gradStart);
      grad.addColorStop(1, state.gradEnd);
      fillStyle = grad;
    } else {
      fillStyle = state.color;
    }
    ctx.fillStyle = fillStyle;

    // Helper: Identify if module is within the 3 corner Finder Patterns (7x7 eyes + 1 module border)
    function isFinder(r, c) {
      // Top Left
      if (r <= 7 && c <= 7) return true;
      // Top Right
      if (r <= 7 && c >= moduleCount - 8) return true;
      // Bottom Left
      if (r >= moduleCount - 8 && c <= 7) return true;
      return false;
    }

    // Center Logo exclusion zone if logo is embedded
    let logoMinModule = -1, logoMaxModule = -1;
    if (state.embedLogo) {
      const centerMod = Math.floor(moduleCount / 2);
      const modRadius = Math.ceil(moduleCount * 0.14);
      logoMinModule = centerMod - modRadius;
      logoMaxModule = centerMod + modRadius;
    }

    function isInsideLogoZone(r, c) {
      if (!state.embedLogo) return false;
      return (r >= logoMinModule && r <= logoMaxModule && c >= logoMinModule && c <= logoMaxModule);
    }

    // --- DRAW DATA MODULES ---
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        // Skip finder patterns (drawn separately with high precision)
        if (isFinder(r, c)) continue;
        // Skip modules covered by logo badge
        if (isInsideLogoZone(r, c)) continue;

        if (qr.isDark(r, c)) {
          const x = offset + c * cellSize;
          const y = offset + r * cellSize;

          drawModule(ctx, x, y, cellSize, state.shape, r, c, qr, moduleCount);
        }
      }
    }

    // --- DRAW FINDER CORNER PATTERNS (The 3 Eyes) ---
    const finderPositions = [
      { r: 0, c: 0 },
      { r: 0, c: moduleCount - 7 },
      { r: moduleCount - 7, c: 0 }
    ];

    finderPositions.forEach(pos => {
      const x = offset + pos.c * cellSize;
      const y = offset + pos.r * cellSize;
      drawFinderPattern(ctx, x, y, cellSize, state.eyeStyle, pos);
    });

    // --- DRAW CENTER EMBED LOGO (IF ENABLED) ---
    if (state.embedLogo) {
      drawCenterLogo(ctx, canvas.width, canvas.height);
    }
  }

  // --- DRAW INDIVIDUAL DATA MODULE (CUSTOM SHAPES) ---
  function drawModule(ctx, x, y, size, shape, r, c, qr, count) {
    const pad = size * 0.05; // tiny aesthetic micro-inset
    const innerSize = size - pad * 2;
    const cx = x + size / 2;
    const cy = y + size / 2;

    switch (shape) {
      case 'dots': {
        // Crisp circular dot
        ctx.beginPath();
        ctx.arc(cx, cy, innerSize * 0.44, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'squircles': {
        // Smooth squircle / rounded rectangle
        const radius = innerSize * 0.32;
        drawRoundRect(ctx, x + pad, y + pad, innerSize, innerSize, radius);
        ctx.fill();
        break;
      }

      case 'connected': {
        // Fluid continuous modules: check 4 neighbors
        const top = r > 0 && qr.isDark(r - 1, c);
        const bottom = r < count - 1 && qr.isDark(r + 1, c);
        const left = c > 0 && qr.isDark(r, c - 1);
        const right = c < count - 1 && qr.isDark(r, c + 1);

        const rad = size * 0.42;
        ctx.beginPath();
        // Custom connected pill path
        ctx.moveTo(x + (left ? 0 : rad), y);
        ctx.lineTo(x + size - (right ? 0 : rad), y);
        if (!right && !top) ctx.arcTo(x + size, y, x + size, y + rad, rad);
        else ctx.lineTo(x + size, y);

        ctx.lineTo(x + size, y + size - (bottom ? 0 : rad));
        if (!right && !bottom) ctx.arcTo(x + size, y + size, x + size - rad, y + size, rad);
        else ctx.lineTo(x + size, y + size);

        ctx.lineTo(x + (left ? 0 : rad), y + size);
        if (!left && !bottom) ctx.arcTo(x, y + size, x, y + size - rad, rad);
        else ctx.lineTo(x, y + size);

        ctx.lineTo(x, y + (top ? 0 : rad));
        if (!left && !top) ctx.arcTo(x, y, x + rad, y, rad);
        else ctx.lineTo(x, y);

        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'diamonds': {
        // 45-degree diamond rhombus
        ctx.beginPath();
        ctx.moveTo(cx, y + pad);
        ctx.lineTo(x + size - pad, cy);
        ctx.lineTo(cx, y + size - pad);
        ctx.lineTo(x + pad, cy);
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'crosses': {
        // Futuristic cyber cross
        const thick = size * 0.38;
        ctx.fillRect(cx - thick / 2, y + pad, thick, innerSize);
        ctx.fillRect(x + pad, cy - thick / 2, innerSize, thick);
        break;
      }

      case 'hexagons': {
        // Honeycomb hexagon
        const hexRad = innerSize * 0.48;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = cx + hexRad * Math.cos(angle);
          const hy = cy + hexRad * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.closePath();
        ctx.fill();
        break;
      }

      case 'squares':
      default: {
        // Classic crisp square with subpixel seal
        ctx.fillRect(x, y, size + 0.4, size + 0.4);
        break;
      }
    }
  }

  // --- DRAW ROUNDED RECT HELPER ---
  function drawRoundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // --- DRAW FINDER PATTERNS (CORNER EYES) ---
  function drawFinderPattern(ctx, x, y, cellSize, style, pos) {
    const eyeSize = 7 * cellSize;
    const centerSize = 3 * cellSize;
    const centerOffset = 2 * cellSize;
    const cx = x + eyeSize / 2;
    const cy = y + eyeSize / 2;

    switch (style) {
      case 'orbit': {
        // Full circular concentric orbit
        // Outer ring
        const outerRad = eyeSize / 2 - cellSize / 2;
        ctx.lineWidth = cellSize;
        ctx.beginPath();
        ctx.arc(cx, cy, outerRad, 0, Math.PI * 2);
        ctx.stroke();

        // Inner circular dot
        const innerRad = centerSize / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, innerRad, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      case 'rounded': {
        // Smooth rounded frame and center
        const outerRadius = cellSize * 2.2;
        const innerRadius = cellSize * 1.2;

        // Outer frame: thick stroke
        ctx.lineWidth = cellSize;
        drawRoundRect(ctx, x + cellSize / 2, y + cellSize / 2, eyeSize - cellSize, eyeSize - cellSize, outerRadius);
        ctx.stroke();

        // Inner solid core
        drawRoundRect(ctx, x + centerOffset, y + centerOffset, centerSize, centerSize, innerRadius);
        ctx.fill();
        break;
      }

      case 'shield': {
        // Asymmetric futuristic cyber shield corner
        // The outer corner curves smoothly, others stay tech-sharp
        const isTopLeft = pos.r === 0 && pos.c === 0;
        const isTopRight = pos.r === 0 && pos.c > 0;
        const isBottomLeft = pos.r > 0 && pos.c === 0;

        ctx.lineWidth = cellSize;
        ctx.beginPath();
        ctx.roundRect ? 
          ctx.roundRect(x + cellSize/2, y + cellSize/2, eyeSize - cellSize, eyeSize - cellSize, [
            isTopLeft ? 24 : 4,
            isTopRight ? 24 : 4,
            4,
            isBottomLeft ? 24 : 4
          ]) :
          ctx.rect(x + cellSize/2, y + cellSize/2, eyeSize - cellSize, eyeSize - cellSize);
        ctx.stroke();

        // Inner shield
        ctx.beginPath();
        ctx.roundRect ?
          ctx.roundRect(x + centerOffset, y + centerOffset, centerSize, centerSize, [
            isTopLeft ? 12 : 2,
            isTopRight ? 12 : 2,
            2,
            isBottomLeft ? 12 : 2
          ]) :
          ctx.rect(x + centerOffset, y + centerOffset, centerSize, centerSize);
        ctx.fill();
        break;
      }

      case 'square':
      default: {
        // Classic high-precision square
        // Outer box: outer 7x7 minus inner 5x5
        ctx.fillRect(x, y, eyeSize, cellSize);
        ctx.fillRect(x, y + eyeSize - cellSize, eyeSize, cellSize);
        ctx.fillRect(x, y, cellSize, eyeSize);
        ctx.fillRect(x + eyeSize - cellSize, y, cellSize, eyeSize);

        // Inner 3x3 solid box
        ctx.fillRect(x + centerOffset, y + centerOffset, centerSize, centerSize);
        break;
      }
    }
  }

  // --- DRAW CENTER EMBEDDED E-CLUB LOGO ---
  function drawCenterLogo(ctx, width, height) {
    const cx = width / 2;
    const cy = height / 2;
    const logoDimension = width * 0.22;
    const badgePadding = width * 0.025;
    const badgeSize = logoDimension + badgePadding * 2;

    // Draw protective clean halo badge behind logo so QR code always scans
    ctx.save();
    
    // Badge background: in transparent mode, make it clean high-contrast plate
    // In light theme: white badge; in dark theme: deep slate badge or transparent glass with border
    const isDarkTheme = state.theme === 'dark';
    ctx.fillStyle = state.bgMode === 'solid' ? state.bgColor : (isDarkTheme ? '#0b0e14' : '#ffffff');
    
    // Draw rounded badge plate
    drawRoundRect(ctx, cx - badgeSize / 2, cy - badgeSize / 2, badgeSize, badgeSize, badgeSize * 0.25);
    ctx.fill();

    // Subtle outline matching QR color
    ctx.lineWidth = width * 0.005;
    ctx.strokeStyle = state.fillMode === 'gradient' ? state.gradStart : state.color;
    ctx.stroke();

    // Pick appropriate logo variant for maximum contrast
    const logoImg = isDarkTheme ? assets.cubeDark : assets.cubeLight;

    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      // Calculate aspect ratio
      const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
      let drawW = logoDimension;
      let drawH = logoDimension;
      if (aspect > 1) {
        drawH = drawW / aspect;
      } else {
        drawW = drawH * aspect;
      }
      ctx.drawImage(logoImg, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    }
    ctx.restore();
  }

  // --- GENERATE LOSSLESS VECTOR SVG ---
  function generateSVG() {
    const text = state.url.trim();
    if (!text) return null;
    const eccLevel = state.embedLogo ? 'H' : 'M';
    const qr = qrcode(0, eccLevel);
    qr.addData(text);
    qr.make();

    const moduleCount = qr.getModuleCount();
    const quietZone = 3.5;
    const totalModules = moduleCount + quietZone * 2;
    const cellSize = 16;
    const svgSize = totalModules * cellSize;
    const offset = quietZone * cellSize;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" width="${svgSize}" height="${svgSize}">\n`;
    
    // Background
    if (state.bgMode === 'solid') {
      svg += `  <rect width="100%" height="100%" fill="${state.bgColor}"/>\n`;
    }

    // Gradient def if needed
    let fillAttr = `fill="${state.color}"`;
    if (state.fillMode === 'gradient') {
      svg += `  <defs>
    <linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${state.gradStart}"/>
      <stop offset="100%" stop-color="${state.gradEnd}"/>
    </linearGradient>
  </defs>\n`;
      fillAttr = `fill="url(#qrGrad)"`;
    }

    // Helper: is finder
    function isFinder(r, c) {
      if (r <= 7 && c <= 7) return true;
      if (r <= 7 && c >= moduleCount - 8) return true;
      if (r >= moduleCount - 8 && c <= 7) return true;
      return false;
    }

    // Modules
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (isFinder(r, c)) continue;
        if (qr.isDark(r, c)) {
          const x = offset + c * cellSize;
          const y = offset + r * cellSize;
          if (state.shape === 'dots') {
            svg += `  <circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.44}" ${fillAttr}/>\n`;
          } else if (state.shape === 'squircles') {
            svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.3}" ${fillAttr}/>\n`;
          } else {
            svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" ${fillAttr}/>\n`;
          }
        }
      }
    }

    // Finder corners
    const finders = [
      { r: 0, c: 0 },
      { r: 0, c: moduleCount - 7 },
      { r: moduleCount - 7, c: 0 }
    ];

    finders.forEach(pos => {
      const x = offset + pos.c * cellSize;
      const y = offset + pos.r * cellSize;
      const eyeSize = 7 * cellSize;
      const centerSize = 3 * cellSize;
      const centerOff = 2 * cellSize;
      
      // Outer
      svg += `  <rect x="${x}" y="${y}" width="${eyeSize}" height="${cellSize}" ${fillAttr}/>\n`;
      svg += `  <rect x="${x}" y="${y + eyeSize - cellSize}" width="${eyeSize}" height="${cellSize}" ${fillAttr}/>\n`;
      svg += `  <rect x="${x}" y="${y}" width="${cellSize}" height="${eyeSize}" ${fillAttr}/>\n`;
      svg += `  <rect x="${x + eyeSize - cellSize}" y="${y}" width="${cellSize}" height="${eyeSize}" ${fillAttr}/>\n`;
      // Center
      svg += `  <rect x="${x + centerOff}" y="${y + centerOff}" width="${centerSize}" height="${centerSize}" ${fillAttr}/>\n`;
    });

    svg += `</svg>`;
    return svg;
  }

  // --- DOWNLOAD PNG (PRIMARY) ---
  function downloadPNG() {
    if (!state.url.trim()) {
      showToast('Please enter a URL first', '⚠️');
      elements.urlInput.focus();
      return;
    }
    AudioEngine.playSuccess();
    const canvas = elements.canvas;
    
    // Generate safe clean filename based on destination
    let safeName = 'eclub-qr';
    try {
      const u = new URL(state.url);
      safeName += '-' + (u.hostname.replace(/www\.|\.com|\.org|\.io/g, '') || 'code');
    } catch (e) {
      safeName += '-code';
    }
    const filename = `${safeName}-${state.shape}-${state.resolution}px.png`;

    canvas.toBlob((blob) => {
      if (!blob) {
        showToast('Error generating PNG export', '⚠️');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Downloaded ${filename}`, '⬇️');
    }, 'image/png');
  }

  // --- COPY PNG TO CLIPBOARD ---
  async function copyPNG() {
    if (!state.url.trim()) {
      showToast('Please enter a URL first', '⚠️');
      elements.urlInput.focus();
      return;
    }
    AudioEngine.playClick(1200);
    const canvas = elements.canvas;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          showToast('Failed to create clipboard blob', '⚠️');
          return;
        }
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          AudioEngine.playSuccess();
          showToast('Copied Transparent PNG to clipboard!', '📋');
        } catch (err) {
          console.warn('Clipboard write failed, trying fallback:', err);
          showToast('Clipboard permissions denied', '⚠️');
        }
      }, 'image/png');
    } catch (e) {
      showToast('Clipboard not supported in this browser', '⚠️');
    }
  }

  // --- DOWNLOAD SVG ---
  function downloadSVG() {
    if (!state.url.trim()) {
      showToast('Please enter a URL first', '⚠️');
      elements.urlInput.focus();
      return;
    }
    AudioEngine.playSuccess();
    const svgData = generateSVG();
    if (!svgData) return;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eclub-qr-${state.shape}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded Vector SVG', '📐');
  }

  // --- SET COLOR HELPER ---
  function setColor(color) {
    state.color = color;
    state.fillMode = 'solid';
    elements.fillSolidBtn.classList.add('active');
    elements.fillGradientBtn.classList.remove('active');
    elements.solidColorRow.style.display = 'flex';
    elements.gradientControlsRow.style.display = 'none';

    elements.nativeColorPicker.value = color;
    elements.pickerSwatchPreview.style.backgroundColor = color;
    elements.hexInput.value = color.replace('#', '').toUpperCase();

    const lookupName = ColorNames[color.toUpperCase()] || 'CUSTOM HEX';
    elements.colorNameBadge.textContent = lookupName;

    // Update active swatch state
    elements.paletteSwatches.forEach(s => {
      if (s.getAttribute('data-color').toUpperCase() === color.toUpperCase()) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    renderQR();
  }

  // --- EVENT ATTACHMENTS & LISTENERS ---
  function setupEventListeners() {
    // URL Input Real-Time
    elements.urlInput.addEventListener('input', (e) => {
      state.url = e.target.value;
      renderQR();
    });

    // Paste Button
    elements.pasteBtn.addEventListener('click', async () => {
      AudioEngine.playClick();
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          elements.urlInput.value = text;
          state.url = text;
          renderQR();
          showToast('Pasted URL from clipboard', '📋');
        }
      } catch (e) {
        elements.urlInput.focus();
        showToast('Press Ctrl+V to paste', 'ℹ️');
      }
    });

    // Clear Button
    elements.clearBtn.addEventListener('click', () => {
      AudioEngine.playClick(440);
      elements.urlInput.value = '';
      state.url = '';
      elements.urlInput.focus();
      renderQR();
    });

    // Preset Sample Chips
    elements.sampleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        AudioEngine.playClick(660);
        const url = chip.getAttribute('data-sample');
        elements.urlInput.value = url;
        state.url = url;
        renderQR();
        showToast(`Loaded ${chip.textContent}`, '🔗');
      });
    });

    // Fill Mode: Solid vs Cyber Gradient
    elements.fillSolidBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      state.fillMode = 'solid';
      elements.fillSolidBtn.classList.add('active');
      elements.fillGradientBtn.classList.remove('active');
      elements.solidColorRow.style.display = 'flex';
      elements.gradientControlsRow.style.display = 'none';
      renderQR();
    });

    elements.fillGradientBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      state.fillMode = 'gradient';
      elements.fillGradientBtn.classList.add('active');
      elements.fillSolidBtn.classList.remove('active');
      elements.solidColorRow.style.display = 'none';
      elements.gradientControlsRow.style.display = 'flex';
      renderQR();
    });

    // Palette Swatches
    elements.paletteSwatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        AudioEngine.playClick(750);
        const color = swatch.getAttribute('data-color');
        setColor(color);
      });
    });

    // Native Color Picker
    elements.nativeColorPicker.addEventListener('input', (e) => {
      setColor(e.target.value);
    });

    // Hex Input typing
    elements.hexInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
      if (val.length === 6) {
        setColor('#' + val);
      }
    });

    // Gradient Controls
    elements.gradStartPicker.addEventListener('input', (e) => {
      state.gradStart = e.target.value;
      elements.gradStartHex.value = e.target.value.replace('#', '').toUpperCase();
      renderQR();
    });
    elements.gradEndPicker.addEventListener('input', (e) => {
      state.gradEnd = e.target.value;
      elements.gradEndHex.value = e.target.value.replace('#', '').toUpperCase();
      renderQR();
    });
    elements.gradPresetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick(800);
        state.gradStart = btn.getAttribute('data-s');
        state.gradEnd = btn.getAttribute('data-e');
        elements.gradStartPicker.value = state.gradStart;
        elements.gradStartHex.value = state.gradStart.replace('#', '').toUpperCase();
        elements.gradEndPicker.value = state.gradEnd;
        elements.gradEndHex.value = state.gradEnd.replace('#', '').toUpperCase();
        renderQR();
      });
    });

    // Background Mode Toggle: Transparent vs Solid
    elements.bgTransparentBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      state.bgMode = 'transparent';
      elements.bgTransparentBtn.classList.add('active');
      elements.bgSolidBtn.classList.remove('active');
      elements.solidBgControls.style.display = 'none';
      renderQR();
    });

    elements.bgSolidBtn.addEventListener('click', () => {
      AudioEngine.playClick();
      state.bgMode = 'solid';
      elements.bgSolidBtn.classList.add('active');
      elements.bgTransparentBtn.classList.remove('active');
      elements.solidBgControls.style.display = 'block';
      renderQR();
    });

    // Solid Background Color Controls
    elements.bgColorPicker.addEventListener('input', (e) => {
      state.bgColor = e.target.value;
      elements.bgHexInput.value = e.target.value.replace('#', '').toUpperCase();
      renderQR();
    });
    elements.solidPresets.forEach(preset => {
      preset.addEventListener('click', () => {
        AudioEngine.playClick();
        state.bgColor = preset.getAttribute('data-bgcolor');
        elements.bgColorPicker.value = state.bgColor;
        elements.bgHexInput.value = state.bgColor.replace('#', '').toUpperCase();
        renderQR();
      });
    });

    // Module Shapes (7 Styles!)
    elements.styleCards.forEach(card => {
      card.addEventListener('click', () => {
        AudioEngine.playClick(900);
        elements.styleCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        state.shape = card.getAttribute('data-shape');
        renderQR();
      });
    });

    // Finder Corner Eye Styles
    elements.eyeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick(850);
        elements.eyeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.eyeStyle = btn.getAttribute('data-eye');
        renderQR();
      });
    });

    // Logo Embed Toggle
    elements.embedLogoToggle.addEventListener('change', (e) => {
      AudioEngine.playClick(1000);
      state.embedLogo = e.target.checked;
      renderQR();
      showToast(state.embedLogo ? 'E-Club Center Emblem Enabled' : 'Center Emblem Disabled');
    });

    // Resolution Buttons
    elements.resButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        elements.resButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.resolution = parseInt(btn.getAttribute('data-res'), 10);
        renderQR();
      });
    });

    // Viewport Preview Backdrop Switcher (Checkerboard / Dark / Light)
    elements.backdropBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.playClick();
        elements.backdropBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mode = btn.getAttribute('data-backdrop');
        elements.canvasContainer.className = `canvas-viewport-container backdrop-${mode}`;
      });
    });

    // Export Buttons
    elements.downloadPngBtn.addEventListener('click', downloadPNG);
    elements.copyPngBtn.addEventListener('click', copyPNG);
    elements.downloadSvgBtn.addEventListener('click', downloadSVG);

    // Theme Switcher Button
    elements.themeToggle.addEventListener('click', () => {
      AudioEngine.playClick(1000);
      const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });

    // Audio Switcher Button
    elements.audioToggle.addEventListener('click', () => {
      AudioEngine.enabled = !AudioEngine.enabled;
      elements.audioIcon.textContent = AudioEngine.enabled ? '🔊' : '🔇';
      localStorage.setItem('eclub_audio', AudioEngine.enabled ? 'enabled' : 'muted');
      if (AudioEngine.enabled) AudioEngine.playClick();
      showToast(AudioEngine.enabled ? 'Tactile Audio Feedback ON' : 'Tactile Audio Feedback MUTED');
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Don't trigger if user is actively typing in an input
      const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        downloadPNG();
      } else if (!isInput && e.key.toLowerCase() === 't') {
        e.preventDefault();
        const nextTheme = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      } else if (!isInput && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        AudioEngine.enabled = !AudioEngine.enabled;
        elements.audioIcon.textContent = AudioEngine.enabled ? '🔊' : '🔇';
        localStorage.setItem('eclub_audio', AudioEngine.enabled ? 'enabled' : 'muted');
      }
    });
  }

  // --- INITIALIZE APPLICATION ---
  function init() {
    applyTheme(state.theme);
    setColor(state.color);
    if (!AudioEngine.enabled) {
      elements.audioIcon.textContent = '🔇';
    }
    setupEventListeners();
    renderQR();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
