/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ❄️ PEACEFUL WINTER & REALISTIC ANIMATED CAMPFIRE ENGINE
 * joey luvs u <3
 * Features:
 *   - Serene winter twilight sky with twinkling stars
 *   - Snowy mountain silhouettes and frosted evergreen pine trees
 *   - Rolling snowdrifts with dynamic pulsating firelight radiance
 *   - Natural textured crossed wooden logs with glowing incandescent embers (NOT BLOCKS)
 *   - Multi-layered Bézier flame tongues with additive bloom ('lighter' / 'screen')
 *   - Fluid upward flame particles transitioning from white-hot -> gold -> fiery red
 *   - Chaotic swirling ember sparks rising into the winter night
 *   - 3-layer parallax drifting snowfall with thermal melting near fire
 *   - 60 FPS hardware accelerated, automatic pause on tab blur or proxy fullscreen
 * ═══════════════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // Avoid duplicate injection
  if (document.getElementById('winter-campfire-canvas')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'winter-campfire-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    display: block;
  `;

  // Attach canvas to body
  if (document.body) {
    document.body.prepend(canvas);
  } else {
    document.addEventListener('DOMContentLoaded', () => document.body.prepend(canvas));
  }

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let animId = null;
  let lastTime = performance.now();

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // ── Starfield (Serene Winter Night) ──
  const STARS_COUNT = 65;
  const stars = [];
  for (let i = 0; i < STARS_COUNT; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random() * 0.65, // Upper sky
      r: Math.random() * 1.2 + 0.4,
      baseAlpha: Math.random() * 0.5 + 0.25,
      speed: Math.random() * 1.5 + 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  // ── Snowfall Particles (3 Parallax Layers) ──
  const SNOW_COUNT = 140;
  const snowflakes = [];
  for (let i = 0; i < SNOW_COUNT; i++) {
    const layer = Math.random();
    let speed, radius, alpha, blur;
    if (layer < 0.45) {
      // Distant tiny slow snow
      radius = Math.random() * 1.2 + 0.6;
      speed = Math.random() * 0.5 + 0.35;
      alpha = Math.random() * 0.3 + 0.25;
      blur = 0;
    } else if (layer < 0.85) {
      // Midground crisp flakes
      radius = Math.random() * 1.8 + 1.2;
      speed = Math.random() * 1.0 + 0.7;
      alpha = Math.random() * 0.4 + 0.45;
      blur = 0;
    } else {
      // Foreground soft bokeh flakes
      radius = Math.random() * 2.8 + 2.2;
      speed = Math.random() * 1.6 + 1.2;
      alpha = Math.random() * 0.35 + 0.55;
      blur = 1;
    }

    snowflakes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: radius,
      speed: speed,
      sway: Math.random() * 1.2 + 0.4,
      swaySpeed: Math.random() * 1.8 + 0.8,
      phase: Math.random() * Math.PI * 2,
      alpha: alpha,
      blur: blur
    });
  }

  // ── Campfire Particles & Embers (Fluid Physics) ──
  const FLAME_PARTICLES_COUNT = 75;
  const flameParticles = [];
  for (let i = 0; i < FLAME_PARTICLES_COUNT; i++) {
    flameParticles.push(createFlameParticle(true));
  }

  function createFlameParticle(randomInit = false) {
    const life = randomInit ? Math.random() : 0;
    return {
      x: (Math.random() - 0.5) * 36, // Offset from fire center
      y: (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 2.4 + 2.0), // Upward buoyant draft
      radius: Math.random() * 14 + 10,
      life: life,
      decay: Math.random() * 0.022 + 0.016,
      heat: 1.0
    };
  }

  const EMBERS_COUNT = 45;
  const embers = [];
  for (let i = 0; i < EMBERS_COUNT; i++) {
    embers.push(createEmber(true));
  }

  function createEmber(randomInit = false) {
    const life = randomInit ? Math.random() : 0;
    return {
      x: (Math.random() - 0.5) * 30,
      y: (Math.random() - 0.5) * 12,
      vx: (Math.random() - 0.5) * 1.4,
      vy: -(Math.random() * 2.8 + 1.6),
      swaySpeed: Math.random() * 4 + 2,
      phase: Math.random() * Math.PI * 2,
      size: Math.random() * 2.2 + 1.0,
      life: life,
      decay: Math.random() * 0.014 + 0.008,
      wobble: Math.random() * 1.5 + 0.5
    };
  }

  // Soft rising smoke puffs
  const SMOKE_COUNT = 18;
  const smokePuffs = [];
  for (let i = 0; i < SMOKE_COUNT; i++) {
    smokePuffs.push({
      x: (Math.random() - 0.5) * 20,
      y: -(Math.random() * 60 + 40),
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 0.8 + 0.6),
      size: Math.random() * 18 + 12,
      growth: Math.random() * 0.35 + 0.2,
      alpha: Math.random() * 0.15 + 0.05,
      life: Math.random(),
      decay: Math.random() * 0.009 + 0.006
    });
  }

  // ── Campfire Placement ──
  function getFirePosition() {
    // Elegant bottom-right positioning on desktop, bottom-center on mobile
    if (width < 768) {
      return { x: width * 0.5, y: height - 52 };
    }
    // Place at 83% width in serene corner of viewport
    return { x: Math.min(width - 150, Math.max(width * 0.82, 380)), y: height - 55 };
  }

  // ── Render Frame ──
  function render(time) {
    animId = requestAnimationFrame(render);

    // Skip drawing if tab is in background or proxy iframe is in active fullscreen
    if (document.hidden) return;
    const proxyContainer = document.getElementById('proxy-container');
    if (proxyContainer && proxyContainer.classList.contains('active')) return;

    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    const firePos = getFirePosition();
    const fx = firePos.x;
    const fy = firePos.y;

    // 1. Serene Winter Twilight Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0.0, '#060a15'); // Deep midnight navy zenith
    skyGrad.addColorStop(0.45, '#0a1224');
    skyGrad.addColorStop(0.8, '#121b33'); // Soft twilight indigo horizon
    skyGrad.addColorStop(1.0, '#17223d');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Stars
    ctx.save();
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const twinkle = Math.sin(time * 0.002 * s.speed + s.phase);
      const alpha = s.baseAlpha + twinkle * 0.2;
      ctx.fillStyle = `rgba(224, 235, 255, ${Math.max(0.1, Math.min(1, alpha))})`;
      ctx.beginPath();
      ctx.arc(s.x * width, s.y * height, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Distant Snowy Mountains Silhouette
    drawMountains(time);

    // 4. Snowy Pine Trees Silhouette
    drawPineTrees(fx, fy);

    // 5. Rolling Snowdrifts
    drawSnowbanks(fx, fy, time);

    // 6. Dynamic Pulsating Firelight Glow onto Snow & Sky
    const flicker1 = Math.sin(time * 0.006) * 0.08 + Math.sin(time * 0.019) * 0.05 + Math.sin(time * 0.035) * 0.03;
    const glowRadius = 320 + flicker1 * 50;
    const glowAlpha = 0.38 + flicker1 * 0.12;

    const fireGlow = ctx.createRadialGradient(fx, fy - 18, 15, fx, fy - 10, glowRadius);
    fireGlow.addColorStop(0.0, `rgba(255, 175, 45, ${glowAlpha})`);
    fireGlow.addColorStop(0.2, `rgba(245, 105, 15, ${glowAlpha * 0.65})`);
    fireGlow.addColorStop(0.5, `rgba(220, 45, 10, ${glowAlpha * 0.3})`);
    fireGlow.addColorStop(0.8, `rgba(180, 25, 10, ${glowAlpha * 0.1})`);
    fireGlow.addColorStop(1.0, 'rgba(10, 15, 30, 0)');

    ctx.save();
    ctx.fillStyle = fireGlow;
    ctx.beginPath();
    ctx.arc(fx, fy - 10, glowRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 7. Realistic Campfire Logs (Structured Wooden Cross with Glowing Heart)
    drawCampfireLogs(fx, fy, time);

    // 8. Soft Smoke Wisps
    drawSmokePuffs(fx, fy, dt);

    // 9. Moving Flames (Multi-Layer Bézier Fluid Tongues + Particles)
    drawFlames(fx, fy, time, dt);

    // 10. Floating Glowing Embers & Sparks
    drawEmbers(fx, fy, time, dt);

    // 11. Peaceful Parallax Falling Snow
    drawSnowfall(fx, fy, time, dt);
  }

  // ── Mountains Background ──
  function drawMountains(time) {
    ctx.save();
    // Far mountain ridge
    ctx.fillStyle = '#0c152a';
    ctx.beginPath();
    ctx.moveTo(0, height);
    const mHeight = height * 0.72;
    ctx.lineTo(0, mHeight + 30);
    ctx.lineTo(width * 0.22, mHeight - 75);
    ctx.lineTo(width * 0.42, mHeight + 20);
    ctx.lineTo(width * 0.65, mHeight - 90);
    ctx.lineTo(width * 0.85, mHeight - 30);
    ctx.lineTo(width, mHeight + 10);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Near mountain ridge with snow highlights
    ctx.fillStyle = '#101a33';
    ctx.beginPath();
    ctx.moveTo(0, height);
    const nHeight = height * 0.78;
    ctx.lineTo(0, nHeight + 40);
    ctx.lineTo(width * 0.15, nHeight - 45);
    ctx.lineTo(width * 0.35, nHeight + 15);
    ctx.lineTo(width * 0.55, nHeight - 65);
    ctx.lineTo(width * 0.78, nHeight - 20);
    ctx.lineTo(width, nHeight + 25);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // ── Pine Trees ──
  function drawPineTrees(fx, fy) {
    ctx.save();
    // Dark winter silhouettes with frost
    const trees = [
      { x: fx - 160, y: fy - 4, h: 85, w: 32 },
      { x: fx - 110, y: fy + 8, h: 65, w: 26 },
      { x: fx + 120, y: fy + 6, h: 70, w: 28 },
      { x: fx + 175, y: fy - 6, h: 95, w: 36 },
      { x: 55, y: height - 42, h: 90, w: 34 },
      { x: 105, y: height - 36, h: 72, w: 28 }
    ];

    trees.forEach(t => {
      if (t.x < -40 || t.x > width + 40) return;
      // Tree trunk
      ctx.fillStyle = '#0a0d18';
      ctx.fillRect(t.x - 3, t.y - 10, 6, 20);

      // 3 Tiers of pine foliage
      const tiers = 3;
      for (let i = 0; i < tiers; i++) {
        const tierY = t.y - (t.h * (i + 1) / tiers);
        const tierW = t.w * (1 - i * 0.24);
        const tierH = t.h * 0.44;

        ctx.fillStyle = '#0b1120';
        ctx.beginPath();
        ctx.moveTo(t.x, tierY - tierH);
        ctx.lineTo(t.x + tierW, tierY + 5);
        ctx.lineTo(t.x - tierW, tierY + 5);
        ctx.closePath();
        ctx.fill();

        // Snow frost on top of branches
        ctx.fillStyle = 'rgba(215, 230, 255, 0.45)';
        ctx.beginPath();
        ctx.moveTo(t.x, tierY - tierH);
        ctx.lineTo(t.x + tierW * 0.75, tierY - 2);
        ctx.quadraticCurveTo(t.x, tierY + 2, t.x - tierW * 0.75, tierY - 2);
        ctx.closePath();
        ctx.fill();
      }
    });
    ctx.restore();
  }

  // ── Snowbanks & Mound ──
  function drawSnowbanks(fx, fy, time) {
    ctx.save();
    // Rolling base snowbank
    const snowGrad = ctx.createLinearGradient(0, height - 70, 0, height);
    snowGrad.addColorStop(0.0, '#1c2847');
    snowGrad.addColorStop(0.4, '#151f38');
    snowGrad.addColorStop(1.0, '#0e1628');
    ctx.fillStyle = snowGrad;

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, height - 45);
    ctx.quadraticCurveTo(width * 0.25, height - 60, width * 0.5, height - 40);
    ctx.quadraticCurveTo(width * 0.75, height - 30, width, height - 48);
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fill();

    // Campfire mound
    ctx.fillStyle = '#18233d';
    ctx.beginPath();
    ctx.ellipse(fx, fy + 16, 95, 26, 0, 0, Math.PI * 2);
    ctx.fill();

    // Snow highlights
    ctx.strokeStyle = 'rgba(220, 235, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(fx, fy + 14, 85, 20, 0, Math.PI * 0.8, Math.PI * 1.8);
    ctx.stroke();

    ctx.restore();
  }

  // ── Realistic Campfire Logs (Hand-Crafted Organic Wood) ──
  function drawCampfireLogs(fx, fy, time) {
    ctx.save();

    // Ground shadow beneath logs
    ctx.fillStyle = 'rgba(5, 7, 12, 0.7)';
    ctx.beginPath();
    ctx.ellipse(fx, fy + 8, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Charcoal hot bed in center (Pulsing incandescent heat)
    const heatPulse = Math.sin(time * 0.008) * 0.15 + 0.85;
    const emberBed = ctx.createRadialGradient(fx, fy, 4, fx, fy, 32);
    emberBed.addColorStop(0.0, `rgba(255, 240, 160, ${heatPulse * 0.95})`);
    emberBed.addColorStop(0.3, `rgba(255, 110, 20, ${heatPulse * 0.85})`);
    emberBed.addColorStop(0.7, `rgba(180, 30, 5, ${heatPulse * 0.6})`);
    emberBed.addColorStop(1.0, 'rgba(40, 10, 5, 0)');
    ctx.fillStyle = emberBed;
    ctx.beginPath();
    ctx.ellipse(fx, fy + 2, 38, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Helper to render textured birch/oak log with bark & cut rings
    function drawLog(x1, y1, x2, y2, thickness, angle) {
      ctx.save();
      ctx.translate((x1 + x2) / 2, (y1 + y2) / 2);
      ctx.rotate(angle);

      const len = Math.hypot(x2 - x1, y2 - y1);
      const halfL = len / 2;
      const halfT = thickness / 2;

      // Dark bark body
      const logGrad = ctx.createLinearGradient(-halfL, -halfT, -halfL, halfT);
      logGrad.addColorStop(0.0, '#3a2012');
      logGrad.addColorStop(0.3, '#2a160c');
      logGrad.addColorStop(0.7, '#1d0e07');
      logGrad.addColorStop(1.0, '#120803');
      ctx.fillStyle = logGrad;

      ctx.beginPath();
      ctx.roundRect(-halfL, -halfT, len, thickness, thickness * 0.4);
      ctx.fill();

      // Wood grain bark lines
      ctx.strokeStyle = '#180b05';
      ctx.lineWidth = 1.2;
      for (let s = -halfL + 10; s < halfL - 10; s += 14) {
        ctx.beginPath();
        ctx.moveTo(s, -halfT + 2);
        ctx.lineTo(s + 4, halfT - 2);
        ctx.stroke();
      }

      // Cut log end rings
      ctx.fillStyle = '#6e4324';
      ctx.beginPath();
      ctx.ellipse(-halfL + 2, 0, halfT * 0.85, halfT * 0.95, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#422410';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Charred inner face highlight from fire
      ctx.fillStyle = 'rgba(255, 120, 20, 0.35)';
      ctx.beginPath();
      ctx.arc(0, -halfT + 3, halfT * 0.7, 0, Math.PI);
      ctx.fill();

      ctx.restore();
    }

    // 4 Crossed Campfire Logs in Teepee Structure
    drawLog(fx - 40, fy + 12, fx + 16, fy - 6, 12, -0.32);
    drawLog(fx + 38, fy + 10, fx - 18, fy - 6, 12, 0.35);
    drawLog(fx - 34, fy - 2, fx + 36, fy + 8, 11, 0.18);
    drawLog(fx + 28, fy - 4, fx - 28, fy + 12, 11, -0.22);

    ctx.restore();
  }

  // ── Fluid Bézier Flames with Additive Glow ──
  function drawFlames(fx, fy, time, dt) {
    ctx.save();
    // Switch to additive blending for brilliant organic flame luminosity!
    ctx.globalCompositeOperation = 'lighter';

    // 1. Multi-Tongue Sinuous Flames (Smooth Bézier Curves)
    const flameCount = 5;
    for (let i = 0; i < flameCount; i++) {
      const offsetRatio = (i / (flameCount - 1) - 0.5); // -0.5 to 0.5
      const flameBaseX = fx + offsetRatio * 24;
      const flameBaseY = fy + 2;

      // Sinuous dynamic tip calculation
      const waveFreq = 0.007;
      const sway = Math.sin(time * waveFreq + i * 1.8) * 12 + Math.cos(time * 0.015 + i) * 6;
      const heightNoise = Math.sin(time * 0.012 + i * 2.3) * 18 + Math.cos(time * 0.024) * 10;
      const flameH = (i === 2 ? 88 : (i === 1 || i === 3 ? 72 : 55)) + heightNoise;
      const tipX = flameBaseX + sway * 0.6;
      const tipY = flameBaseY - flameH;

      // Bézier control points
      const cp1x = flameBaseX - offsetRatio * 14 + Math.sin(time * 0.018 + i) * 8;
      const cp1y = flameBaseY - flameH * 0.45;
      const cp2x = tipX + Math.cos(time * 0.014 + i) * 10;
      const cp2y = flameBaseY - flameH * 0.75;

      // Dynamic Flame Gradient
      const fGrad = ctx.createLinearGradient(flameBaseX, flameBaseY, tipX, tipY);
      fGrad.addColorStop(0.0, 'rgba(255, 255, 230, 0.95)'); // White-hot root
      fGrad.addColorStop(0.2, 'rgba(255, 215, 60, 0.9)');  // Brilliant gold
      fGrad.addColorStop(0.55, 'rgba(255, 105, 15, 0.75)'); // Fiery amber
      fGrad.addColorStop(0.85, 'rgba(230, 45, 10, 0.4)');  // Crimson tip
      fGrad.addColorStop(1.0, 'rgba(160, 15, 5, 0.0)');

      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.moveTo(flameBaseX - 12, flameBaseY);
      ctx.bezierCurveTo(cp1x - 8, cp1y, cp2x - 4, cp2y, tipX, tipY);
      ctx.bezierCurveTo(cp2x + 4, cp2y, cp1x + 8, cp1y, flameBaseX + 12, flameBaseY);
      ctx.closePath();
      ctx.fill();
    }

    // 2. Fluid Rising Flame Particles (Organic Core)
    for (let i = 0; i < flameParticles.length; i++) {
      const p = flameParticles[i];
      p.life += p.decay;
      if (p.life >= 1.0) {
        Object.assign(p, createFlameParticle(false));
      }

      p.y += p.vy;
      p.x += p.vx + Math.sin(time * 0.01 + p.y * 0.05) * 0.35;
      p.radius *= 0.985; // Gently tapers as it rises

      const px = fx + p.x;
      const py = fy + p.y;
      const progress = p.life;

      // Color mapping: White-gold -> vibrant orange -> crimson -> smoke
      let r, g, b, a;
      if (progress < 0.25) {
        // Core white-gold
        r = 255;
        g = Math.floor(255 - progress * 160);
        b = Math.floor(200 - progress * 600);
        a = (1 - progress * 0.5) * 0.85;
      } else if (progress < 0.65) {
        // Mid orange
        const t = (progress - 0.25) / 0.4;
        r = 255;
        g = Math.floor(215 - t * 140);
        b = 20;
        a = (0.75 - t * 0.45);
      } else {
        // High crimson smoke
        const t = (progress - 0.65) / 0.35;
        r = Math.floor(220 - t * 140);
        g = Math.floor(50 - t * 40);
        b = 10;
        a = (0.3 - t * 0.3);
      }

      ctx.fillStyle = `rgba(${r}, ${Math.max(0, g)}, ${Math.max(0, b)}, ${Math.max(0, a)})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, p.radius), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Floating Glowing Embers & Sparks ──
  function drawEmbers(fx, fy, time, dt) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    for (let i = 0; i < embers.length; i++) {
      const e = embers[i];
      e.life += e.decay;
      if (e.life >= 1.0) {
        Object.assign(e, createEmber(false));
      }

      e.y += e.vy;
      e.x += e.vx + Math.sin(time * 0.003 * e.swaySpeed + e.phase) * e.wobble;

      const ex = fx + e.x;
      const ey = fy + e.y;
      const progress = e.life;

      // Embers cool down as they drift into the night sky
      let color;
      if (progress < 0.3) {
        color = `rgba(255, 245, 160, ${1 - progress})`;
      } else if (progress < 0.7) {
        color = `rgba(255, 140, 20, ${0.9 - progress * 0.8})`;
      } else {
        color = `rgba(220, 50, 15, ${0.7 - progress * 0.7})`;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(ex, ey, e.size * (1 - progress * 0.5), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ── Rising Smoke Puffs ──
  function drawSmokePuffs(fx, fy, dt) {
    ctx.save();
    for (let i = 0; i < smokePuffs.length; i++) {
      const s = smokePuffs[i];
      s.life += s.decay;
      if (s.life >= 1.0) {
        s.life = 0;
        s.x = (Math.random() - 0.5) * 16;
        s.y = -40;
        s.size = Math.random() * 14 + 10;
      }

      s.y += s.vy;
      s.x += s.vx;
      s.size += s.growth;

      const alpha = (1 - s.life) * s.alpha;
      ctx.fillStyle = `rgba(140, 155, 185, ${alpha})`;
      ctx.beginPath();
      ctx.arc(fx + s.x, fy + s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // ── Peaceful Falling Snow (Parallax + Thermal Melt) ──
  function drawSnowfall(fx, fy, time, dt) {
    ctx.save();
    ctx.fillStyle = 'rgba(235, 245, 255, 0.9)';

    for (let i = 0; i < snowflakes.length; i++) {
      const flake = snowflakes[i];
      flake.y += flake.speed;
      flake.x += Math.sin(time * 0.001 * flake.swaySpeed + flake.phase) * flake.sway;

      // Wrap around edges
      if (flake.y > height) {
        flake.y = -10;
        flake.x = Math.random() * width;
      }
      if (flake.x > width) flake.x = 0;
      if (flake.x < 0) flake.x = width;

      // Thermal check: Flakes close to campfire melt away in rising warmth
      const distToFire = Math.hypot(flake.x - fx, flake.y - (fy - 25));
      let currentAlpha = flake.alpha;
      if (distToFire < 90) {
        currentAlpha *= (distToFire / 90);
        flake.x += (flake.x > fx ? 0.4 : -0.4); // Thermal air deflection
      }

      if (currentAlpha <= 0.02) continue;

      ctx.fillStyle = `rgba(235, 245, 255, ${currentAlpha})`;
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Start animation loop
  animId = requestAnimationFrame(render);

  // Expose global controller
  window.__winterCampfire = {
    canvas,
    resize,
    getFirePosition
  };
})();

