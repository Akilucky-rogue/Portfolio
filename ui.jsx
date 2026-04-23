// Reusable UI bits
const { useState, useEffect, useRef, useMemo } = React;

// --- Ticker tape ---
function Ticker() {
  const items = [
    ["NIFTY", "24,812.35", "+0.42%", "up"],
    ["SENSEX", "81,239.10", "+0.38%", "up"],
    ["BANKNIFTY", "54,201.80", "-0.15%", "down"],
    ["INR/USD", "83.47", "+0.02%", "up"],
    ["BRENT", "74.22", "-0.81%", "down"],
    ["GOLD", "2,418.50", "+1.12%", "up"],
    ["BTC", "68,420", "+2.04%", "up"],
    ["AKLV:BUILD", "ONLINE", "+100%", "up"],
    ["AKLV:SHIP", "MEISA", "+4 QTD", "up"],
    ["AKLV:SLEEP", "6.2h", "-3.0%", "down"],
    ["COFFEE.IN", "3 cups", "+50%", "up"],
    ["CGPA", "3.05/4", "holding", "up"],
  ];
  const row = items.concat(items);
  return (
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--bg-1)', overflow: 'hidden' }}>
      <div className="ticker-track">
        {row.map((it, i) => (
          <span key={i} className="mono xs" style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
            <span className="mute" style={{ letterSpacing: '0.12em' }}>{it[0]}</span>
            <span>{it[1]}</span>
            <span className={it[3]}>{it[2]}</span>
            <span className="mute">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// --- Crosshair ---
function Crosshair() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(max-width: 760px)').matches) return;
    let raf;
    const onMove = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return (
    <>
      <div className="xhair-h" style={{ top: pos.y }} />
      <div className="xhair-v" style={{ left: pos.x }} />
      <div style={{
        position: 'fixed', left: pos.x + 10, top: pos.y + 10,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10,
        color: 'var(--green)', pointerEvents: 'none', zIndex: 40,
        background: 'rgba(11,14,18,0.7)', padding: '2px 6px', border: '1px solid var(--line)',
      }}>
        {String(pos.x).padStart(4, '0')},{String(pos.y).padStart(4, '0')}
      </div>
    </>
  );
}

// --- Sparkline ---
function Sparkline({ seed = 1, color = 'var(--green)', height = 36 }) {
  const pts = useMemo(() => {
    let rng = seed;
    const random = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };
    const n = 40;
    let y = 50;
    const arr = [];
    for (let i = 0; i < n; i++) {
      y += (random() - 0.45) * 14;
      y = Math.max(10, Math.min(90, y));
      arr.push(y);
    }
    return arr;
  }, [seed]);
  const path = pts.map((y, i) => `${i === 0 ? 'M' : 'L'} ${(i / (pts.length - 1)) * 100} ${y}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="spark-wrap" style={{ height }}>
      <path d={path} fill="none" stroke={color} strokeWidth="1" />
      <path d={`${path} L 100 100 L 0 100 Z`} fill={color} opacity="0.08" />
    </svg>
  );
}

// --- Candles ---
function Candles({ count = 60, seed = 3 }) {
  const bars = useMemo(() => {
    let rng = seed;
    const random = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };
    const out = [];
    let v = 50;
    for (let i = 0; i < count; i++) {
      const delta = (random() - 0.5) * 20;
      const nv = Math.max(10, Math.min(90, v + delta));
      out.push({ open: v, close: nv, up: nv >= v });
      v = nv;
    }
    return out;
  }, [count, seed]);
  return (
    <svg viewBox={`0 0 ${count * 4} 100`} preserveAspectRatio="none" style={{ width: '100%', height: 100 }}>
      {bars.map((b, i) => {
        const x = i * 4;
        const top = 100 - Math.max(b.open, b.close);
        const h = Math.abs(b.close - b.open) || 1;
        return <rect key={i} x={x} y={top} width={3} height={h} fill={b.up ? 'var(--green)' : 'var(--red)'} opacity={0.85} />;
      })}
    </svg>
  );
}

// --- Header ---
function Header({ theme, setTheme, onOpenCmd }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = (n) => String(n).padStart(2, '0');
  const hhmmss = `${fmt(time.getHours())}:${fmt(time.getMinutes())}:${fmt(time.getSeconds())}`;
  const dd = `${fmt(time.getDate())}.${fmt(time.getMonth() + 1)}.${time.getFullYear()}`;

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 30, background: 'var(--bg)', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 20px', fontSize: 11, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 8, height: 8, background: 'var(--green)', boxShadow: '0 0 6px var(--green)', borderRadius: '50%' }} />
          <span className="mono" style={{ letterSpacing: '0.12em' }}>AKLV · TERMINAL</span>
        </div>
        <span className="mute hide-sm">|</span>
        <div className="mono mute hide-sm">SESS {hhmmss} IST · {dd}</div>
        <span className="mute hide-md">|</span>
        <div className="mono hide-md" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="mute">FEED</span>
          <span className="led-row">{Array.from({length:12}).map((_,i)=> <span key={i} className={`led ${i<10?'on':(i===10?'warn':'')}`} />)}</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <a href="#about" className="ulink xs hide-md">01 · About</a>
          <a href="#work" className="ulink xs hide-md">02 · Work</a>
          <a href="#projects" className="ulink xs hide-md">03 · Projects</a>
          <a href="#skills" className="ulink xs hide-md">04 · Skills</a>
          <a href="#edu" className="ulink xs hide-md">05 · Edu</a>
          <a href="#contact" className="ulink xs">Contact</a>
          <button className="btn" style={{ padding: '6px 10px', fontSize: 10 }} onClick={onOpenCmd}>
            <span>⌘</span><span>/</span>
          </button>
          <button className="btn" style={{ padding: '6px 10px', fontSize: 10 }} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? 'LIGHT' : 'DARK'}
          </button>
        </div>
      </div>
      <Ticker />
    </header>
  );
}

// --- Command palette ---
function CmdK({ open, onClose }) {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef(null);

  const items = [
    { label: 'Jump · About', action: () => location.hash = '#about' },
    { label: 'Jump · Experience', action: () => location.hash = '#work' },
    { label: 'Jump · Projects', action: () => location.hash = '#projects' },
    { label: 'Jump · Skills', action: () => location.hash = '#skills' },
    { label: 'Open · GitHub', action: () => window.open('https://github.com/Akilucky-rogue', '_blank') },
    { label: 'Open · LinkedIn', action: () => window.open('https://www.linkedin.com/in/akshat-vora-4930131a1/', '_blank') },
    { label: 'Open · StockScreener repo', action: () => window.open('https://github.com/Akilucky-rogue/StockScreener', '_blank') },
    { label: 'Copy · Email', action: () => navigator.clipboard?.writeText('akshatbvora@gmail.com') },
    { label: 'Copy · Phone', action: () => navigator.clipboard?.writeText('+91 8850490510') },
    { label: 'Download · Résumé (PDF)', action: () => { const a = document.createElement('a'); a.href = 'Akshat_Vora_Resume.pdf'; a.download = 'Akshat_Vora_Resume.pdf'; a.click(); } },
    { label: 'Trigger · Konami', action: () => alert('🎮 Cheat activated: You now have +1 internship at FedEx. Oh wait...') },
  ];
  const filtered = items.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => { if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 10); } }, [open]);

  if (!open) return null;
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx(i => Math.min(filtered.length - 1, i + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx(i => Math.max(0, i - 1)); }
    if (e.key === 'Enter') { filtered[idx]?.action(); onClose(); }
    if (e.key === 'Escape') onClose();
  };

  return (
    <div className="cmdk" onClick={onClose}>
      <div className="cmdk-box" onClick={(e) => e.stopPropagation()}>
        <input ref={inputRef} className="cmdk-input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey} placeholder="> jump, open, copy, download…" />
        <div style={{ maxHeight: 320, overflow: 'auto' }}>
          {filtered.map((it, i) => (
            <div key={i} className={`cmdk-item ${i === idx ? 'active' : ''}`} onMouseEnter={() => setIdx(i)} onClick={() => { it.action(); onClose(); }}>
              <span>{it.label}</span>
              <span className="kbd">↵</span>
            </div>
          ))}
          {filtered.length === 0 && <div className="cmdk-item mute">No results.</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 20px', borderTop: '1px solid var(--line)', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
          <span>↑↓ NAVIGATE · ↵ SELECT</span>
          <span>ESC CLOSE</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Ticker, Crosshair, Sparkline, Candles, Header, CmdK });
