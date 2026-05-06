// Three.js 3D DNA Staircase Intro — SCROLL-DRIVEN
// User scrolls -> camera climbs the helix -> gate opens -> flash -> terminal reveals.
// Scrolling back up reverses the entire sequence.

(function () {
  function startIntro({ onProgress, onComplete, mount, scrollEl }) {
    const THREE = window.THREE;
    if (!THREE) { onComplete?.(); return; }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060a, 0.009);

    const camera = new THREE.PerspectiveCamera(64, window.innerWidth / window.innerHeight, 0.1, 1200);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05060a, 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mount.appendChild(renderer.domElement);

    // ---- Nebula backdrop (soft gradient discs) ----
    const nebulaCanvas = document.createElement('canvas');
    nebulaCanvas.width = nebulaCanvas.height = 512;
    const nctx = nebulaCanvas.getContext('2d');
    const grd = nctx.createRadialGradient(256, 256, 20, 256, 256, 256);
    grd.addColorStop(0, 'rgba(255, 200, 130, 0.55)');
    grd.addColorStop(0.4, 'rgba(180, 110, 60, 0.25)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    nctx.fillStyle = grd; nctx.fillRect(0,0,512,512);
    const nebTex = new THREE.CanvasTexture(nebulaCanvas);
    const nebMat = new THREE.SpriteMaterial({ map: nebTex, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.65, depthWrite: false });
    [
      { x: -60, y: 80,  z: -180, s: 220, o: 0.55 },
      { x:  90, y: 140, z: -240, s: 280, o: 0.45 },
      { x:   0, y: 220, z: -160, s: 200, o: 0.7 },
      { x: -40, y: 30,  z: -120, s: 140, o: 0.4 },
    ].forEach(n => {
      const m = nebMat.clone(); m.opacity = n.o;
      const s = new THREE.Sprite(m);
      s.position.set(n.x, n.y, n.z);
      s.scale.set(n.s, n.s, 1);
      scene.add(s);
    });

    // ---- Starfield (two layers, depth + parallax) ----
    function makeStars(count, rMin, rMax, size, opacity, color) {
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        const r = rMin + Math.random() * (rMax - rMin);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
        pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
        pos[i*3+2] = r * Math.cos(phi);
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      return new THREE.Points(g, new THREE.PointsMaterial({ color, size, transparent: true, opacity, sizeAttenuation: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    }
    const starsFar  = makeStars(1800, 350, 600, 0.5, 0.55, 0xc8d2e4);
    const starsMid  = makeStars(800,  200, 350, 0.8, 0.85, 0xffffff);
    const starsWarm = makeStars(300,  150, 320, 1.1, 0.7,  0xffd9a0);
    scene.add(starsFar, starsMid, starsWarm);

    // ---- DNA helix staircase ----
    const TOP = 240;
    const HELIX_RADIUS = 6.5;
    const TURNS = 7;
    const RUNGS = 160;
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);

    // Build parametric strands
    const strandPointsA = [], strandPointsB = [];
    for (let i = 0; i <= 1000; i++) {
      const t = i / 1000;
      const y = t * TOP;
      const angle = t * Math.PI * 2 * TURNS;
      strandPointsA.push(new THREE.Vector3(Math.cos(angle) * HELIX_RADIUS, y, Math.sin(angle) * HELIX_RADIUS));
      strandPointsB.push(new THREE.Vector3(Math.cos(angle + Math.PI) * HELIX_RADIUS, y, Math.sin(angle + Math.PI) * HELIX_RADIUS));
    }

    // Strand A — warm amber, glassy + emissive (bloom-feeling)
    const tubeMatA = new THREE.MeshPhysicalMaterial({
      color: 0xffb547, emissive: 0xff8a1f, emissiveIntensity: 1.4,
      roughness: 0.15, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.1,
    });
    // Strand B — cool ivory/cyan complement
    const tubeMatB = new THREE.MeshPhysicalMaterial({
      color: 0xeaf6ff, emissive: 0xa8d8ff, emissiveIntensity: 0.9,
      roughness: 0.2, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.15,
    });
    helixGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandPointsA), 800, 0.22, 16, false), tubeMatA));
    helixGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandPointsB), 800, 0.22, 16, false), tubeMatB));

    // Outer ghost strands — additive halo around each spine
    const haloMatA = new THREE.MeshBasicMaterial({ color: 0xff8a1f, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false });
    const haloMatB = new THREE.MeshBasicMaterial({ color: 0xa8d8ff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
    helixGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandPointsA), 800, 0.55, 14, false), haloMatA));
    helixGroup.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(strandPointsB), 800, 0.55, 14, false), haloMatB));

    // Rungs as glowing capsule beams
    const rungs = [];
    const rungMatBase = new THREE.MeshPhysicalMaterial({
      color: 0xfff3d0, emissive: 0xffb547, emissiveIntensity: 1.2,
      roughness: 0.1, metalness: 0.4, transparent: true, opacity: 0.92,
      clearcoat: 1, clearcoatRoughness: 0.08,
    });
    for (let i = 0; i < RUNGS; i++) {
      const t = i / (RUNGS - 1);
      const y = t * TOP;
      const angle = t * Math.PI * 2 * TURNS;
      const ax = Math.cos(angle) * HELIX_RADIUS, az = Math.sin(angle) * HELIX_RADIUS;
      const bx = Math.cos(angle + Math.PI) * HELIX_RADIUS, bz = Math.sin(angle + Math.PI) * HELIX_RADIUS;
      const dx = bx - ax, dz = bz - az;
      const len = Math.sqrt(dx*dx + dz*dz);
      const rung = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, len - 0.4, 6, 12), rungMatBase.clone());
      rung.position.set((ax+bx)/2, y, (az+bz)/2);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -Math.atan2(dz, dx);
      helixGroup.add(rung);
      rungs.push(rung);

      // Beads at each strand attachment point
      const beadGeo = new THREE.SphereGeometry(0.42, 16, 16);
      const beadA = new THREE.Mesh(beadGeo, tubeMatA); beadA.position.set(ax, y, az);
      const beadB = new THREE.Mesh(beadGeo, tubeMatB); beadB.position.set(bx, y, bz);
      helixGroup.add(beadA); helixGroup.add(beadB);

      // Ghost bead halos
      if (i % 3 === 0) {
        const haloGeo = new THREE.SphereGeometry(0.9, 12, 12);
        const ghA = new THREE.Mesh(haloGeo, haloMatA.clone()); ghA.position.copy(beadA.position); helixGroup.add(ghA);
        const ghB = new THREE.Mesh(haloGeo, haloMatB.clone()); ghB.position.copy(beadB.position); helixGroup.add(ghB);
      }
    }

    // Vertical light beam through the center of the helix
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xffd49a, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false });
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, TOP + 12, 24, 1, true), beamMat);
    beam.position.y = TOP / 2;
    helixGroup.add(beam);

    // Slow orbiting particle ring at multiple altitudes
    const orbitParts = [];
    for (let band = 0; band < 5; band++) {
      const count = 60;
      const g = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const baseY = (band + 0.5) * (TOP / 5);
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const r = 9 + Math.random() * 2.5;
        pos[i*3] = Math.cos(a) * r;
        pos[i*3+1] = baseY + (Math.random() - 0.5) * 8;
        pos[i*3+2] = Math.sin(a) * r;
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const m = new THREE.PointsMaterial({
        color: band % 2 === 0 ? 0xffb547 : 0xa8d8ff,
        size: 0.22, transparent: true, opacity: 0.85,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const pts = new THREE.Points(g, m);
      pts.userData = { baseY, speed: 0.15 + band * 0.05 };
      helixGroup.add(pts);
      orbitParts.push(pts);
    }

    // ---- Gate ----
    const gateGroup = new THREE.Group();
    gateGroup.position.y = TOP + 8;
    scene.add(gateGroup);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(14, 0.5, 16, 80), new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1.4, roughness: 0.2, metalness: 0.7 }));
    gateGroup.add(ring);
    const portalMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7, transparent: true, opacity: 0, side: THREE.DoubleSide });
    gateGroup.add(new THREE.Mesh(new THREE.CircleGeometry(13.4, 64), portalMat));

    const doorMat = new THREE.MeshStandardMaterial({ color: 0x0a0a10, emissive: 0x1a1410, emissiveIntensity: 0.4, roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide });
    const doorShape = new THREE.Shape();
    doorShape.moveTo(0,0); doorShape.absarc(0,0,13.4,-Math.PI/2,Math.PI/2,false); doorShape.lineTo(0,0);
    const doorGeo = new THREE.ShapeGeometry(doorShape);
    const doorL = new THREE.Mesh(doorGeo, doorMat); doorL.rotation.z = Math.PI;
    const doorR = new THREE.Mesh(doorGeo, doorMat);
    const doorLPivot = new THREE.Group(); doorLPivot.add(doorL);
    const doorRPivot = new THREE.Group(); doorRPivot.add(doorR);
    gateGroup.add(doorLPivot); gateGroup.add(doorRPivot);

    const tickMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 1 });
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.8, 0.4), tickMat);
      tick.position.set(Math.cos(a) * 14.8, Math.sin(a) * 14.8, 0);
      tick.rotation.z = a;
      gateGroup.add(tick);
    }

    const gateLight = new THREE.PointLight(0xffe9b0, 0, 220, 1.5);
    gateLight.position.set(0, TOP + 8, -2);
    scene.add(gateLight);
    scene.add(new THREE.AmbientLight(0x2a1c30, 0.55));
    // Travelling lights along the helix to give a 'rising glow' feel
    const helixLight1 = new THREE.PointLight(0xff9a3c, 2.5, 55); helixLight1.position.set(0, TOP * 0.2, 0); scene.add(helixLight1);
    const helixLight2 = new THREE.PointLight(0xffd49a, 1.8, 55); helixLight2.position.set(0, TOP * 0.5, 0); scene.add(helixLight2);
    const helixLight3 = new THREE.PointLight(0xa8d8ff, 1.4, 55); helixLight3.position.set(0, TOP * 0.8, 0); scene.add(helixLight3);
    // Subtle rim from above to catch the strands
    const rim = new THREE.DirectionalLight(0xffffff, 0.5); rim.position.set(0, TOP + 50, 30); scene.add(rim);

    // ---- Embers / dust (rising) ----
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 700;
    const dustPos = new Float32Array(dustCount * 3);
    const dustSpd = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3 + Math.random() * 18;
      dustPos[i*3] = Math.cos(a) * r;
      dustPos[i*3+1] = Math.random() * TOP;
      dustPos[i*3+2] = Math.sin(a) * r;
      dustSpd[i] = 0.8 + Math.random() * 2.6;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffd49a, size: 0.22, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(dust);

    // Floor pool light reflection (faux ground glow)
    const floorMat = new THREE.MeshBasicMaterial({ color: 0xff9a3c, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const floor = new THREE.Mesh(new THREE.RingGeometry(0.5, 18, 64), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1;
    scene.add(floor);

    // ---- HUD ----
    const hud = document.createElement('div');
    hud.className = 'intro-hud';
    hud.innerHTML = `
      <div class="intro-corner tl">
        <div class="hud-line">⊹ AKLV / TERMINAL · BOOT</div>
        <div class="hud-line dim" id="hud-stage">// scroll to ascend ↓</div>
      </div>
      <div class="intro-corner tr">
        <div class="hud-line dim">CAM_01 · SCROLL-DRIVEN</div>
        <div class="hud-line dim" id="hud-alt">ALT 0000 · GATE 240</div>
      </div>
      <div class="intro-corner bl">
        <div class="hud-line dim">DNA · TURNS 07 · STEPS 130</div>
      </div>
      <div class="intro-corner br">
        <button class="intro-skip" id="intro-skip">SKIP →</button>
      </div>
      <div class="intro-narr" id="intro-narr"></div>
      <div class="intro-glyphs" id="intro-glyphs"></div>
      <div class="intro-cta" id="intro-cta">
        <div class="cta-pre">— THE ASCENT —</div>
        <div class="cta-line">"Every step up was a decision. The gate opens for those who built."</div>
        <div class="scroll-hint"><span class="scroll-mouse"><span class="scroll-wheel"></span></span><div class="cta-foot">SCROLL TO ASCEND</div></div>
      </div>
      <div class="intro-flash" id="intro-flash"></div>
      <div class="intro-vignette"></div>
      <div class="intro-progress"><div class="intro-progress-fill" id="intro-progress-fill"></div></div>
    `;
    mount.appendChild(hud);

    const elStage = hud.querySelector('#hud-stage');
    const elAlt = hud.querySelector('#hud-alt');
    const elNarr = hud.querySelector('#intro-narr');
    const elCta = hud.querySelector('#intro-cta');
    const elFlash = hud.querySelector('#intro-flash');
    const elProgress = hud.querySelector('#intro-progress-fill');
    const elGlyphs = hud.querySelector('#intro-glyphs');

    // ---- Side glyphs: milestones along the climb ----
    // Each item: { at: 0..1, side: 'L'|'R', kind, ...content }
    const GLYPHS = [
      { at: 0.06, side: 'L', kind: 'origin',  year: '2004',     title: 'Origin',          sub: 'Mumbai, IN \u00b7 27.10' },
      { at: 0.13, side: 'R', kind: 'school',  year: '2010\u201322', title: 'Foundations',     sub: 'Witty International School \u00b7 80%' },
      { at: 0.22, side: 'L', kind: 'edu',     year: '2023\u201326', title: 'NMIMS MPSTME',    sub: 'B.Tech CE \u00b7 CGPA 3.05' },
      { at: 0.30, side: 'R', kind: 'cert',    year: '2024',     title: 'NISM V-A',        sub: 'Mutual Fund Distributors' },
      { at: 0.37, side: 'L', kind: 'work',    year: '2024',     title: 'SERNET',          sub: 'Lending analytics \u00b7 KYC/AML' },
      { at: 0.44, side: 'R', kind: 'project', year: 'Q3 24',    title: 'IQSP',            sub: 'Quant screener \u00b7 LightGBM' },
      { at: 0.51, side: 'L', kind: 'project', year: 'Q4 24',    title: 'Wall-ette',       sub: 'Wallet \u00b7 React/Firebase' },
      { at: 0.57, side: 'R', kind: 'cert',    year: '2025',     title: 'Ethical Hacking', sub: 'Cybersec foundations' },
      { at: 0.64, side: 'L', kind: 'project', year: 'Q1 25',    title: 'GenoScan',        sub: 'DNA workbench \u00b7 ML' },
      { at: 0.71, side: 'R', kind: 'project', year: 'Q2 25',    title: 'Eco-Sanjivani',   sub: 'Marine conservation' },
      { at: 0.78, side: 'L', kind: 'work',    year: '2025\u201326', title: 'FedEx Express',   sub: 'Planning \u00b7 MEISA \u00b7 ETL/PowerBI' },
      { at: 0.86, side: 'R', kind: 'now',     year: 'Now',      title: 'Building',        sub: 'Open to 2026 roles' },
    ];

    GLYPHS.forEach((g, i) => {
      const el = document.createElement('div');
      el.className = `glyph ${g.side === 'L' ? 'left' : 'right'} kind-${g.kind}`;
      el.dataset.idx = i;
      el.innerHTML = `
        <div class="glyph-rail"></div>
        <div class="glyph-card">
          <div class="glyph-head">
            <span class="glyph-tag">${g.kind.toUpperCase()}</span>
            <span class="glyph-year">${g.year}</span>
          </div>
          <div class="glyph-title">${g.title}</div>
          <div class="glyph-sub">${g.sub}</div>
        </div>
      `;
      elGlyphs.appendChild(el);
    });
    const glyphEls = Array.from(elGlyphs.querySelectorAll('.glyph'));

    function updateGlyphs(p) {
      // p = scroll progress 0..1; ascent ends at 0.70 -> map to 0..1 internally
      const ASCENT = 0.70;
      GLYPHS.forEach((g, i) => {
        const el = glyphEls[i];
        // visibility band: 0.08 wide centered on g.at, but expand for entry from below
        const dist = (p - g.at);
        const FADE_IN = 0.06; // appears slightly before its anchor
        const HOLD    = 0.05;
        const FADE_OUT = 0.07;
        let opacity = 0, slide = 28;
        if (dist > -FADE_IN && dist < HOLD + FADE_OUT) {
          if (dist < 0) {
            const k = (dist + FADE_IN) / FADE_IN;     // 0..1 entering
            opacity = k;
            slide = (1 - k) * 28;
          } else if (dist < HOLD) {
            opacity = 1;
            slide = 0;
          } else {
            const k = 1 - (dist - HOLD) / FADE_OUT;   // 1..0 leaving
            opacity = Math.max(0, k);
            slide = (1 - k) * -22;
          }
        }
        el.style.opacity = String(opacity);
        const dir = g.side === 'L' ? -1 : 1;
        el.style.transform = `translateY(${slide * 0.6}px) translateX(${dir * (1 - opacity) * 24}px)`;
        // After ascent ends, hide
        if (p > ASCENT) el.style.opacity = '0';
      });
    }

    let lastNarr = '';
    function showNarrator(text) {
      if (text === lastNarr) return;
      lastNarr = text;
      elNarr.textContent = text;
      elNarr.classList.add('on');
      clearTimeout(showNarrator._t);
      showNarrator._t = setTimeout(() => elNarr.classList.remove('on'), 3500);
    }

    let cancelled = false;
    let completed = false;
    function skip() {
      if (cancelled) return;
      cancelled = true;
      finish(true);
    }
    function finish(skipped) {
      if (completed) return;
      completed = true;
      hud.classList.add('fading');
      renderer.domElement.classList.add('fading');
      setTimeout(() => {
        cleanup();
        onComplete?.(skipped);
      }, 900);
    }
    function cleanup() {
      try {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('scroll', onScroll, { passive: true });
        renderer.domElement.remove();
        hud.remove();
        renderer.dispose();
        scene.traverse((o) => {
          if (o.geometry) o.geometry.dispose();
          if (o.material) {
            if (Array.isArray(o.material)) o.material.forEach(m => m.dispose());
            else o.material.dispose();
          }
        });
      } catch {}
    }

    hud.querySelector('#intro-skip').addEventListener('click', () => skip());

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      sizeMatrix();
      if (matrixCols.length) initMatrixCols();
    }
    window.addEventListener('resize', onResize);

    function onKey(e) {
      if (e.code === 'Escape') skip();
      // Allow PageDown / End to jump
      if (e.code === 'End') { window.scrollTo({ top: scrollEl.offsetHeight, behavior: 'smooth' }); }
    }
    window.addEventListener('keydown', onKey);

    // ---- SCROLL DRIVER ----
    let scrollProgress = 0;
    let targetProgress = 0;
    function readScroll() {
      const total = scrollEl.offsetHeight - window.innerHeight;
      const y = window.scrollY || window.pageYOffset || 0;
      targetProgress = total > 0 ? Math.max(0, Math.min(1, y / total)) : 0;
    }
    function onScroll() { readScroll(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    readScroll();

    // Map total progress to phases:
    //   0.00 - 0.95 : ASCEND  (camera climbs helix to t=0.97, doors stay closed)
    //   0.95 - 1.00 : ARRIVAL (camera holds before sealed door, "ENTER" prompt appears)
    //   click ENTER : OPENING (cinematic 1.6s — doors swing, camera dollies in)
    //                 -> MATRIX RAIN takeover (~2.5s) -> finish()

    // ---- Door arrival overlay (the dramatic ENTER button) ----
    const elDoorPrompt = document.createElement('div');
    elDoorPrompt.className = 'intro-door-prompt';
    elDoorPrompt.innerHTML = `
      <div class="dp-eyebrow">// SEAL HOLDING</div>
      <div class="dp-title">You arrived at the gate.</div>
      <button class="dp-btn" id="dp-enter">
        <span class="dp-btn-label">ENTER</span>
        <span class="dp-btn-sub">click to break the seal</span>
      </button>
    `;
    hud.appendChild(elDoorPrompt);
    let arrivalReady = false;
    let openingState = 'idle'; // 'idle' | 'opening' | 'matrix' | 'done'
    let openingT = 0;
    let matrixT = 0;

    // Matrix rain overlay
    const elMatrix = document.createElement('canvas');
    elMatrix.className = 'intro-matrix';
    hud.appendChild(elMatrix);
    const mctx = elMatrix.getContext('2d');
    function sizeMatrix() {
      elMatrix.width = window.innerWidth;
      elMatrix.height = window.innerHeight;
    }
    sizeMatrix();
    const matrixCols = [];
    function initMatrixCols() {
      const fontSize = 16;
      const cols = Math.ceil(elMatrix.width / fontSize);
      matrixCols.length = 0;
      for (let i = 0; i < cols; i++) {
        matrixCols.push({
          x: i * fontSize,
          y: -Math.random() * elMatrix.height,
          speed: 220 + Math.random() * 320,
          glyphs: [],
          len: 8 + Math.floor(Math.random() * 22),
        });
      }
    }
    const MATRIX_CHARS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEF<>/[]{}*+';
    function renderMatrix(dt, alpha) {
      mctx.fillStyle = `rgba(0, 0, 0, ${0.12 + (1 - alpha) * 0.05})`;
      mctx.fillRect(0, 0, elMatrix.width, elMatrix.height);
      mctx.font = "16px 'JetBrains Mono', monospace";
      for (const col of matrixCols) {
        col.y += col.speed * dt;
        if (col.y > elMatrix.height + col.len * 16) {
          col.y = -col.len * 16 - Math.random() * 200;
          col.speed = 220 + Math.random() * 320;
        }
        for (let k = 0; k < col.len; k++) {
          const ch = MATRIX_CHARS[(Math.random() * MATRIX_CHARS.length) | 0];
          const yy = col.y - k * 16;
          if (yy < -16 || yy > elMatrix.height + 16) continue;
          if (k === 0) {
            mctx.fillStyle = `rgba(220, 255, 230, ${alpha})`;
          } else {
            const fade = (1 - k / col.len);
            mctx.fillStyle = `rgba(80, 220, 130, ${fade * alpha})`;
          }
          mctx.fillText(ch, col.x, yy);
        }
      }
    }

    document.getElementById('dp-enter').addEventListener('click', () => {
      if (openingState !== 'idle' || !arrivalReady) return;
      openingState = 'opening';
      openingT = 0;
      elDoorPrompt.classList.add('gone');
      // hide HUD chrome during cinematic
      hud.querySelectorAll('.intro-corner').forEach(el => el.classList.add('fading'));
      elNarr.classList.remove('on');
      elGlyphs.style.opacity = '0';
      initMatrixCols();
    });

    function computeCameraOnPath(progress) {
      const TURNS_CAM = TURNS;
      const angle = progress * Math.PI * 2 * TURNS_CAM + Math.PI/2;
      const y = progress * TOP;
      const wobble = Math.sin(progress * 30) * 0.4;
      const x = Math.cos(angle) * 0.5 + wobble;
      const z = Math.sin(angle) * 0.5;
      const aheadAngle = (progress + 0.02) * Math.PI * 2 * TURNS_CAM + Math.PI/2;
      const aheadY = Math.min(progress + 0.06, 1) * TOP + 4;
      const lookX = Math.cos(aheadAngle) * 0.5;
      const lookZ = Math.sin(aheadAngle) * 0.5;
      return { pos: new THREE.Vector3(x, y, z), look: new THREE.Vector3(lookX, aheadY, lookZ) };
    }

    let last = performance.now();
    let elapsed = 0;
    function tick(now) {
      const dt = Math.min(60, now - last) / 1000;
      last = now;
      elapsed += dt;

      // Smooth scroll progress (lerp toward target for buttery motion)
      scrollProgress += (targetProgress - scrollProgress) * Math.min(1, dt * 8);
      const p = scrollProgress;
      elProgress.style.transform = `scaleX(${p})`;

      // Persistent ambient
      starsFar.rotation.y  += dt * 0.003;
      starsMid.rotation.y  += dt * 0.006;
      starsWarm.rotation.y -= dt * 0.004;
      ring.rotation.z -= dt * 0.2;
      const dPos = dustGeo.attributes.position.array;
      for (let i = 0; i < dustCount; i++) {
        dPos[i*3+1] += dt * dustSpd[i];
        // gentle horizontal drift
        dPos[i*3]   += Math.sin(elapsed * 0.5 + i) * dt * 0.05;
        dPos[i*3+2] += Math.cos(elapsed * 0.5 + i) * dt * 0.05;
        if (dPos[i*3+1] > TOP) {
          dPos[i*3+1] = 0;
          const a = Math.random() * Math.PI * 2;
          const r = 3 + Math.random() * 18;
          dPos[i*3]   = Math.cos(a) * r;
          dPos[i*3+2] = Math.sin(a) * r;
        }
      }
      dustGeo.attributes.position.needsUpdate = true;

      // Pulse wave traveling up the rungs
      rungs.forEach((r, i) => {
        const t = i / rungs.length;
        const wave = (elapsed * 0.18 - t) % 1;
        const w = wave < 0 ? wave + 1 : wave;
        const pulse = Math.exp(-Math.pow((w - 0.5) * 4, 2));
        r.material.emissiveIntensity = 0.6 + pulse * 1.8 + Math.sin(elapsed * 2 + i * 0.3) * 0.15;
        r.material.opacity = 0.65 + pulse * 0.35;
      });

      // Orbit particles slowly rotate at varied speeds
      orbitParts.forEach((p, i) => { p.rotation.y += dt * p.userData.speed; });

      // Travelling key lights
      helixLight1.position.y = ((TOP * 0.2 + elapsed * 18) % TOP);
      helixLight2.position.y = ((TOP * 0.5 + elapsed * 14) % TOP);
      helixLight3.position.y = ((TOP * 0.8 + elapsed * 22) % TOP);
      // Floor glow breathes
      floor.material.opacity = 0.18 + Math.sin(elapsed * 0.8) * 0.08;
      // Beam shimmer
      beam.material.opacity = 0.06 + Math.sin(elapsed * 0.6) * 0.03;

      // CTA fades on first scroll input
      if (p > 0.005 && !elCta.classList.contains('gone')) {
        elCta.classList.add('gone');
      } else if (p <= 0.005 && elCta.classList.contains('gone')) {
        elCta.classList.remove('gone');
      }

      // PHASE 1: Ascend (0..0.70 -> path 0..0.96)
      // PHASE 1: Ascend (0..0.95 -> path 0..0.97)
      // PHASE 2: Arrival (0.95..1.00) — camera holds in front of sealed door, click ENTER to proceed
      const ASCEND_END = 0.95;

      if (openingState === 'idle' && p < ASCEND_END) {
        const ap = p / ASCEND_END; // 0..1
        const ep = ap < 0.5 ? 2*ap*ap : 1 - Math.pow(-2*ap+2, 2)/2; // ease
        const camP = ep * 0.97;
        const { pos, look } = computeCameraOnPath(camP);
        camera.position.copy(pos);
        camera.lookAt(look);
        camera.fov = 72;
        camera.updateProjectionMatrix();

        // Reset gate state
        doorLPivot.rotation.y = 0;
        doorRPivot.rotation.y = 0;
        portalMat.opacity = 0;
        gateLight.intensity = 0;
        elFlash.style.opacity = '0';
        if (arrivalReady) {
          arrivalReady = false;
          elDoorPrompt.classList.remove('on');
        }

        elAlt.textContent = `ALT ${String(Math.floor(ep * TOP)).padStart(4,'0')} · GATE 240`;
        elStage.textContent = ap < 0.05 ? '// scroll to ascend ↓' : '// ascending helix';
        if (ap > 0.15 && ap < 0.45) showNarrator('Climb. The strands remember.');
        else if (ap > 0.55 && ap < 0.85) showNarrator('Each rung a question answered.');
      } else if (openingState === 'idle') {
        // ARRIVAL — camera locks just below the gate, faces the doors
        const arrivalCam = computeCameraOnPath(0.97);
        // Push camera slightly back+down so the door fills the view
        camera.position.set(
          arrivalCam.pos.x * 0.4,
          TOP - 4,
          arrivalCam.pos.z * 0.4 - 6
        );
        camera.lookAt(0, TOP + 6, 0);
        camera.fov = 64;
        camera.updateProjectionMatrix();

        doorLPivot.rotation.y = 0;
        doorRPivot.rotation.y = 0;
        // faint glow seeping through the seal
        portalMat.opacity = 0.18 + Math.sin(elapsed * 1.4) * 0.08;
        gateLight.intensity = 1.5 + Math.sin(elapsed * 1.4) * 0.6;
        elFlash.style.opacity = '0';

        elStage.textContent = '// arrival — seal active';
        elAlt.textContent = `ALT ${TOP} · SEAL 100%`;
        if (!arrivalReady) {
          arrivalReady = true;
          // give it a beat before showing the prompt
          setTimeout(() => { if (arrivalReady) elDoorPrompt.classList.add('on'); }, 350);
        }
        showNarrator('You arrived. The seal awaits your hand.');
      } else if (openingState === 'opening') {
        // CINEMATIC OPEN — 1.8s
        openingT += dt;
        const T = 1.8;
        const k = Math.min(1, openingT / T);
        const ek = 1 - Math.pow(1 - k, 3);   // ease-out cubic
        const ek2 = k * k;                   // ease-in for camera dolly

        // Doors swing open with a touch of recoil
        const swing = ek * Math.PI * 0.62 + Math.sin(k * Math.PI) * 0.04;
        doorLPivot.rotation.y = -swing;
        doorRPivot.rotation.y =  swing;
        portalMat.opacity = 0.4 + ek * 0.6;
        gateLight.intensity = 1.5 + ek * 12;

        // Camera dollies forward & rises through the gate
        const arrivalCam = computeCameraOnPath(0.97);
        const startX = arrivalCam.pos.x * 0.4;
        const startZ = arrivalCam.pos.z * 0.4 - 6;
        camera.position.set(
          startX * (1 - ek),
          (TOP - 4) + ek2 * 26,
          startZ * (1 - ek) + ek2 * -10
        );
        camera.lookAt(0, TOP + 10 + ek * 30, -10 - ek * 30);
        camera.fov = 64 + ek * 38;
        camera.updateProjectionMatrix();

        elFlash.style.opacity = String(Math.min(1, ek2 * 1.6));
        elStage.textContent = '// breaking the seal';
        elAlt.textContent = 'ALT ∞ · TRANSCENDING';

        if (k >= 1) {
          openingState = 'matrix';
          matrixT = 0;
          elMatrix.classList.add('on');
          // Hide 3D scene under the rain
          renderer.domElement.classList.add('fading');
        }
      } else if (openingState === 'matrix') {
        matrixT += dt;
        const RAIN_T = 2.6;
        const k = Math.min(1, matrixT / RAIN_T);
        // alpha rises 0..1 in first 0.4s, holds, then fades 0.85..1
        const alpha = k < 0.18 ? (k / 0.18) : (k > 0.85 ? Math.max(0, 1 - (k - 0.85) / 0.15) : 1);
        renderMatrix(dt, alpha);
        elMatrix.style.opacity = String(alpha);
        elFlash.style.opacity = String(Math.max(0, 0.6 - k * 0.6));
        elStage.textContent = '// decoding...';
        elAlt.textContent = `STREAM 0x${(Math.floor(matrixT * 1000)).toString(16).toUpperCase()}`;

        if (k >= 1 && !cancelled) {
          openingState = 'done';
          finish(false);
        }
      }

      onProgress?.(p);
      updateGlyphs(p);
      renderer.render(scene, camera);
      if (!completed) requestAnimationFrame(tick);
    }
    requestAnimationFrame((t) => { last = t; tick(t); });

    return { skip };
  }

  function loadThree() {
    return new Promise((resolve, reject) => {
      if (window.THREE) return resolve();
      const s = document.createElement('script');
      s.src = 'https://unpkg.com/three@0.160.0/build/three.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  window.AKLVIntro = {
    play({ onComplete } = {}) {
      const KEY = 'aklv-intro-played';

      // Mount full-viewport sticky scene
      const mount = document.createElement('div');
      mount.className = 'intro-stage';
      document.body.appendChild(mount);

      // Create the scroll driver: a tall element behind the canvas that gives us scroll runway
      const scrollEl = document.createElement('div');
      scrollEl.className = 'intro-scroll-driver';
      // 4 viewport heights of scroll for the entire intro
      scrollEl.style.height = `${window.innerHeight * 4}px`;
      document.body.appendChild(scrollEl);

      // Lock body to scrollable but hide the rest of the site
      document.body.classList.add('intro-active');
      window.scrollTo(0, 0);

      loadThree().then(() => {
        startIntro({
          mount,
          scrollEl,
          onComplete: (skipped) => {
            try { mount.remove(); } catch {}
            try { scrollEl.remove(); } catch {}
            document.body.classList.remove('intro-active');
            window.scrollTo(0, 0);
            try { sessionStorage.setItem(KEY, '1'); } catch {}
            onComplete?.(skipped);
          },
        });
      }).catch(() => {
        try { mount.remove(); scrollEl.remove(); } catch {}
        document.body.classList.remove('intro-active');
        onComplete?.(true);
      });
    },
    shouldPlay() {
      try {
        const params = new URLSearchParams(location.search);
        if (params.get('intro') === '0') return false;
        if (params.get('intro') === '1') return true;
        return sessionStorage.getItem('aklv-intro-played') !== '1';
      } catch { return true; }
    },
    forceReplay() {
      try { sessionStorage.removeItem('aklv-intro-played'); } catch {}
    },
  };
})();
