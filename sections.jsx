const { PROFILE, METRICS, EXPERIENCE, PROJECTS, SKILLS, CERTS, EDUCATION, GH_REPOS } = window.PORTFOLIO;

// --- Hero ---
function Hero() {
  const [cmd, setCmd] = useState('');
  const lines = [
    "$ whoami",
    "akshat.vora — b. 27.10.2004 — Mumbai, IN",
    "$ cat /roles",
    "analyst · data scientist · cybersec · fintech · swe · innovator",
    "$ uptime",
    "since 2023 · 28 public repos · 3 internships",
    "$ ./run --focus",
    "ML pipelines · SEBI-compliant algo · secure systems · 0→1 ideas"
  ];
  return (
    <section style={{ position: 'relative', padding: '60px 20px 40px', borderBottom: '1px solid var(--line)' }}>
      <div style={{ position: 'absolute', inset: 0 }} className="grid-bg" />
      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 48, alignItems: 'end' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="chip ok">● LIVE · AVAILABLE FOR 2026</span>
              <span className="chip">ANALYST</span>
              <span className="chip">DATA SCIENTIST</span>
              <span className="chip">CYBERSEC</span>
              <span className="chip">FINTECH</span>
              <span className="chip">SWE</span>
              <span className="chip">INNOVATOR</span>
            </div>
            <h1 className="hero-name">
              Akshat<br />Vora<span style={{ color: 'var(--green)' }}>.</span>
            </h1>
            <div className="mono" style={{ marginTop: 24, fontSize: 14, color: 'var(--ink-dim)', maxWidth: 620, lineHeight: 1.7 }}>
              {PROFILE.tagline}
            </div>
            <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href="#projects">▶ VIEW PROJECTS</a>
              <a className="btn" href="Akshat_Vora_Resume.pdf" download>⇩ RESUME.PDF</a>
              <a className="btn" href={`mailto:${PROFILE.email}`}>✉ CONTACT</a>
              <a className="btn" href={PROFILE.github} target="_blank">◆ GITHUB</a>
            </div>
          </div>
          <div className="cell">
            <div className="cell-head"><span>TERM · /home/akshat</span><span className="dot" /></div>
            <div className="term">
              {lines.map((l, i) => (
                <div key={i} style={{ color: i % 2 === 0 ? 'var(--green)' : 'var(--ink)' }}>{l}</div>
              ))}
              <div><span className="p1">$</span> <span className="cursor" /></div>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', padding: 10 }}>
              <Candles count={80} seed={17} />
            </div>
            <div style={{ display: 'flex', borderTop: '1px solid var(--line)', fontSize: 10 }}>
              {['NSE','BSE','MCX','FX','API','OK'].map((k,i) => (
                <div key={i} style={{ flex: 1, padding: '6px 10px', borderRight: i < 5 ? '1px solid var(--line)' : 'none', color: 'var(--green)', letterSpacing: '0.12em' }}>{k}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--line)' }}>
          {METRICS.map((m, i) => (
            <div key={i} className="metric-tile" style={{ borderRight: i < 3 ? '1px solid var(--line)' : 'none', background: 'var(--bg-1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div className="metric-value">{m.value}</div>
                  <div className="metric-label">{m.label}</div>
                </div>
                <div className="tiny up">{m.delta}</div>
              </div>
              <div style={{ marginTop: 12 }}><Sparkline seed={i * 7 + 3} height={28} /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead({ num, title, sub }) {
  return (
    <div style={{ padding: '48px 20px 24px', borderBottom: '1px dashed var(--line)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', maxWidth: 1400, margin: '0 auto' }}>
      <div>
        <div className="section-num">/ {num} · {sub}</div>
        <div className="section-title">{title}</div>
      </div>
      <div className="mono xs mute">[ scroll ↓ ]</div>
    </div>
  );
}

// --- About ---
function About() {
  return (
    <section id="about">
      <SectionHead num="01" sub="OVERVIEW" title="About." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 48px', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48 }}>
        <div>
          <p className="serif" style={{ fontSize: 28, lineHeight: 1.4, margin: 0, color: 'var(--ink)', textWrap: 'pretty' }}>
            I'm a final-year Computer Engineering student at <span style={{ color: 'var(--green)' }}>NMIMS Mumbai</span>, currently interning with the Planning & Engineering group at <span style={{ color: 'var(--amber)' }}>FedEx Express</span> — building automated ETL workflows and forecasting dashboards across the MEISA region.
          </p>
          <div style={{ marginTop: 28, fontSize: 13, lineHeight: 1.8, color: 'var(--ink-dim)', maxWidth: 640 }}>
            <p>I operate across six modes. As an <b style={{ color: 'var(--cyan)' }}>Analyst</b> — requirements gathering, SQL, Power BI, lending lifecycle, KYC/AML, process improvement. As a <b style={{ color: 'var(--green)' }}>Data Scientist</b> — factor engineering, LightGBM, SHAP attribution, walk-forward backtests and Scikit-Learn. As a <b style={{ color: 'var(--red)' }}>Cybersecurity</b> thinker — ethical hacking certified, anomaly detection, risk frameworks, secure session / MFA design. As a <b style={{ color: 'var(--amber)' }}>Fintech</b> builder — NISM V-A certified (pursuing VIII), SEBI-aware algo strategies and lending analytics.</p>
            <p>As a <b style={{ color: 'var(--blue)' }}>Software Engineer</b> — Python, TypeScript, React, Supabase, Firebase, REST APIs, CI/CD, production shipping. And as an <b style={{ color: 'var(--mag)' }}>Idea Innovator</b> — I keep noticing gaps (quant tools for Indian retail, marine conservation data, DNA variant workbenches) and turning them into working software.</p>
            <p>I've shipped this way for financial services (SERNET), for logistics (FedEx), and across a portfolio of personal builds. Outside work I read a lot of SEBI circulars.</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="cell">
            <div className="cell-head"><span>IDENT · AKLV</span><span className="mute">PUB</span></div>
            <div style={{ padding: 14, fontSize: 12 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {[
                    ['Name', PROFILE.name],
                    ['DOB', PROFILE.birth],
                    ['Base', PROFILE.location],
                    ['Status', 'Final-year · B.Tech CE'],
                    ['Focus', 'Data · Fintech · Automation'],
                    ['Open to', 'Full-time 2026 · Remote + Mumbai'],
                  ].map(([k, v], i) => (
                    <tr key={i} className="xrow">
                      <td style={{ padding: '6px 0', color: 'var(--ink-mute)', width: 90, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k}</td>
                      <td style={{ padding: '6px 0' }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="cell">
            <div className="cell-head"><span>SIGNAL · CURRENT</span><span className="dot" /></div>
            <div style={{ padding: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 11 }}>
              <div><div className="mute tiny">Analyst</div><div className="mono">SQL · PowerBI · DAX</div></div>
              <div><div className="mute tiny">Data Science</div><div className="mono">LightGBM · SHAP</div></div>
              <div><div className="mute tiny">Cybersec</div><div className="mono">EH · Anomaly · MFA</div></div>
              <div><div className="mute tiny">Fintech</div><div className="mono">NISM V-A · SEBI</div></div>
              <div><div className="mute tiny">SWE</div><div className="mono">Py · TS · React</div></div>
              <div><div className="mute tiny">Innovation</div><div className="mono up">6+ 0→1 products</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Experience ---
function Work() {
  return (
    <section id="work" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <SectionHead num="02" sub="EMPLOYMENT LEDGER" title="Experience." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 48px' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Firm</th>
              <th>Role</th>
              <th>Surface</th>
              <th>Period</th>
              <th style={{ width: 80 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {EXPERIENCE.map((e, i) => (
              <tr key={e.id} className="xrow">
                <td className="mono mute">{e.id}</td>
                <td><b>{e.co}</b></td>
                <td>{e.role}</td>
                <td className="mute">{e.dept}</td>
                <td className="mono mute">{e.period}</td>
                <td><span className={`chip ${e.status === 'LIVE' ? 'ok' : ''}`}>{e.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>
          {EXPERIENCE.map((e) => (
            <div key={e.id} className="cell">
              <div className="cell-head">
                <span>{e.id} · {e.co.toUpperCase().slice(0, 18)}</span>
                <span className={e.status === 'LIVE' ? 'up' : 'mute'}>{e.status}</span>
              </div>
              <div style={{ padding: 16 }}>
                <div className="serif" style={{ fontSize: 22, lineHeight: 1.2, marginBottom: 8 }}>{e.role}</div>
                <div className="mono mute xs" style={{ marginBottom: 12 }}>{e.period} · {e.dept}</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.7, color: 'var(--ink-dim)' }}>
                  {e.bullets.map((b, i) => <li key={i} style={{ marginBottom: 4 }}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Projects ---
function Projects() {
  const [active, setActive] = useState(0);
  const p = PROJECTS[active];
  return (
    <section id="projects">
      <SectionHead num="03" sub="SELECTED WORK" title="Projects." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 48px' }}>
        {/* Ticker table */}
        <div className="cell" style={{ marginBottom: 24 }}>
          <div className="cell-head"><span>WATCHLIST · 6 / 28</span><span className="mute">CLICK TO LOAD</span></div>
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Tkr</th>
                <th>Project</th>
                <th>Sector</th>
                <th>Status</th>
                <th style={{ width: 140 }}>Signal</th>
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((pr, i) => (
                <tr key={pr.id} className="xrow" style={{ cursor: 'crosshair', background: i === active ? 'var(--bg-2)' : 'transparent' }} onClick={() => setActive(i)}>
                  <td className="mono" style={{ color: `var(${pr.accent})` }}>{pr.ticker}</td>
                  <td><b>{pr.name}</b></td>
                  <td className="mute tiny">{pr.tag}</td>
                  <td><span className="chip">{pr.status}</span></td>
                  <td style={{ padding: 0 }}><Sparkline seed={i * 11 + 2} color={`var(${pr.accent})`} height={22} /></td>
                  <td className="mono up proj-arrow">↗</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail panel */}
        <div key={p.id} className="cell" style={{ borderColor: `var(${p.accent})` }}>
          <div className="cell-head" style={{ borderColor: `var(${p.accent})` }}>
            <span style={{ color: `var(${p.accent})` }}>● {p.ticker} · {p.tag}</span>
            <span className="mute">{p.year} · {p.status}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 0 }}>
            <div style={{ padding: 28, borderRight: '1px solid var(--line)' }}>
              <div className="mono mute tiny" style={{ marginBottom: 8 }}>PROJECT BRIEF</div>
              <div className="serif" style={{ fontSize: 40, lineHeight: 1.05, letterSpacing: '-0.02em' }}>{p.name}</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)', marginTop: 16, maxWidth: 560 }}>{p.summary}</p>
              <div style={{ marginTop: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {p.stack.map((s, i) => <span key={i} className="chip">{s}</span>)}
              </div>
              <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
                {p.repo && <a className="btn" href={p.repo} target="_blank">◆ REPO</a>}
                {p.live && <a className="btn btn-primary" href={p.live} target="_blank">▶ LIVE</a>}
              </div>
            </div>
            <div style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 20, borderBottom: '1px solid var(--line)' }}>
                <div className="mono mute tiny" style={{ marginBottom: 12 }}>HIGHLIGHTS</div>
                <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, lineHeight: 1.7 }}>
                  {p.highlights.map((h, i) => <li key={i} style={{ marginBottom: 6 }}>{h}</li>)}
                </ul>
              </div>
              <div style={{ padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1 }}>
                {p.kpis.map((k, i) => (
                  <div key={i} style={{ padding: 16, borderRight: i % 2 === 0 ? '1px solid var(--line)' : 'none', borderTop: i > 1 ? '1px solid var(--line)' : 'none' }}>
                    <div className="mono xs mute">{k.k}</div>
                    <div className="serif" style={{ fontSize: 26, marginTop: 2, color: `var(${p.accent})` }}>{k.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--line)' }}>
            <Candles count={100} seed={(active + 1) * 7} />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Skills ---
function Skills() {
  return (
    <section id="skills" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <SectionHead num="04" sub="FACTOR EXPOSURES" title="Skills Matrix." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {SKILLS.map((g, gi) => (
          <div key={gi} className="cell">
            <div className="cell-head"><span>{g.group}</span><span className="mute">{g.items.length}</span></div>
            <div style={{ padding: 16 }}>
              {g.items.map(([name, pct], i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                    <span>{name}</span>
                    <span className="mono mute xs">{pct}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-bar-fill" style={{ width: pct + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// --- Education & Certs ---
function EduCerts() {
  return (
    <section id="edu">
      <SectionHead num="05" sub="CREDENTIALS" title="Education & Certs." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div className="cell">
          <div className="cell-head"><span>EDUCATION</span><span className="mute">{EDUCATION.length}</span></div>
          <div>
            {EDUCATION.map((e, i) => (
              <div key={i} style={{ padding: 20, borderBottom: i < EDUCATION.length - 1 ? '1px dashed var(--line)' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div className="serif" style={{ fontSize: 22, lineHeight: 1.2 }}>{e.school}</div>
                    <div style={{ marginTop: 4, fontSize: 12 }}>{e.degree}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="mono xs mute">{e.period}</div>
                    <div className="mono up" style={{ marginTop: 4 }}>{e.score}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="cell">
          <div className="cell-head"><span>CERTIFICATIONS</span><span className="mute">{CERTS.length}</span></div>
          <table className="data-table">
            <tbody>
              {CERTS.map((c, i) => (
                <tr key={i} className="xrow">
                  <td style={{ width: 10 }}><span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} /></td>
                  <td><b>{c.name}</b><div className="mute xs" style={{ marginTop: 2 }}>{c.desc}</div></td>
                  <td className="mono mute xs" style={{ textAlign: 'right' }}>{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// --- All Repos ---
function Repos() {
  const [filter, setFilter] = useState('ALL');
  const langs = ['ALL', 'Python', 'TypeScript', 'Other'];
  const filtered = GH_REPOS.filter(r => {
    if (filter === 'ALL') return true;
    if (filter === 'Python') return r.lang.startsWith('Py');
    if (filter === 'TypeScript') return r.lang === 'TS';
    return !r.lang.startsWith('Py') && r.lang !== 'TS';
  });
  return (
    <section style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <SectionHead num="06" sub="FULL INDEX" title="All Repositories." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px 48px' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <span className="mute tiny">FILTER:</span>
          {langs.map(l => (
            <button key={l} className="btn" style={{ padding: '4px 10px', fontSize: 10, borderColor: filter === l ? 'var(--green)' : 'var(--line-2)', color: filter === l ? 'var(--green)' : 'var(--ink)' }} onClick={() => setFilter(l)}>{l}</button>
          ))}
          <span className="mute xs" style={{ marginLeft: 'auto' }}>{filtered.length} / {GH_REPOS.length} repos · live from Akilucky-rogue</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: '1px solid var(--line)' }}>
          {filtered.map((r, i) => (
            <a key={r.name} href={`https://github.com/Akilucky-rogue/${r.name}`} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="proj-card" style={{ border: 'none', borderRight: (i+1) % 4 ? '1px solid var(--line)' : 'none', borderBottom: '1px solid var(--line)', padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div className="mono xs" style={{ color: 'var(--green)' }}>{r.lang}</div>
                  <span className="mono mute xs proj-arrow">↗</span>
                </div>
                <div style={{ marginTop: 6, fontSize: 13, fontWeight: 500 }}>{r.name}</div>
                <div className="mute xs" style={{ marginTop: 4, lineHeight: 1.4, minHeight: 32 }}>{r.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- GitHub stats (live-feeling, deterministic) ---
function GHStats() {
  const cells = useMemo(() => {
    let rng = 7;
    const random = () => { rng = (rng * 9301 + 49297) % 233280; return rng / 233280; };
    return Array.from({ length: 52 * 7 }).map(() => {
      const r = random();
      if (r < 0.55) return 0;
      if (r < 0.75) return 1;
      if (r < 0.88) return 2;
      if (r < 0.96) return 3;
      return 4;
    });
  }, []);
  const colors = ['var(--bg-3)', 'rgba(34,197,94,0.25)', 'rgba(34,197,94,0.5)', 'rgba(34,197,94,0.75)', 'var(--green)'];
  return (
    <section>
      <SectionHead num="07" sub="ACTIVITY FEED" title="GitHub Heartbeat." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 48px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        <div className="cell">
          <div className="cell-head"><span>COMMITS · 52W</span><span className="dot" /></div>
          <div style={{ padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(52, 1fr)', gap: 2, gridAutoFlow: 'column', gridTemplateRows: 'repeat(7, 1fr)' }}>
              {cells.map((v, i) => (
                <div key={i} style={{ aspectRatio: 1, background: colors[v], borderRadius: 1 }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
              <span>MAY '25</span><span>AUG</span><span>NOV</span><span>FEB '26</span><span>APR '26</span>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 12, fontSize: 10 }}>
              <span className="mute">LESS</span>
              {colors.map((c, i) => <div key={i} style={{ width: 10, height: 10, background: c }} />)}
              <span className="mute">MORE</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="cell">
            <div className="cell-head"><span>LANG · BREAKDOWN</span></div>
            <div style={{ padding: 16 }}>
              {[['Python', 38, 'var(--green)'], ['TypeScript', 31, 'var(--blue)'], ['JavaScript', 12, 'var(--amber)'], ['Java / C++', 9, 'var(--mag)'], ['Other', 10, 'var(--ink-mute)']].map(([n, p, c], i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                    <span>{n}</span><span className="mono mute">{p}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg-3)', marginTop: 4 }}>
                    <div style={{ height: '100%', width: p + '%', background: c }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="cell">
            <div className="cell-head"><span>LAST PUSH</span><span className="up">JUST NOW</span></div>
            <div className="term" style={{ borderTop: 'none' }}>
              <div><span className="p2">feat:</span> add SHAP waterfall to IQSP</div>
              <div className="mute xs">Akilucky-rogue/StockScreener · main</div>
              <div style={{ marginTop: 6 }}><span className="p2">chore:</span> ETL retry backoff</div>
              <div className="mute xs">private/FedEx · dev</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Contact ---
function Contact() {
  const [copied, setCopied] = useState('');
  const copy = (v) => { navigator.clipboard?.writeText(v); setCopied(v); setTimeout(() => setCopied(''), 1500); };
  return (
    <section id="contact" style={{ background: 'var(--bg-1)', borderTop: '1px solid var(--line)' }}>
      <SectionHead num="08" sub="OPEN CHANNEL" title="Contact." />
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 20px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div className="serif" style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.05 }}>
              Let's build<br />something that ships.
            </div>
            <p style={{ marginTop: 20, fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)', maxWidth: 560 }}>
              Open to full-time roles from mid-2026. Happiest at the seam of data engineering, fintech, and AI-glue work — bonus points if the codebase needs somebody to tidy the pipeline and the requirements document simultaneously.
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="btn btn-primary" href={`mailto:${PROFILE.email}`}>✉ {PROFILE.email}</a>
              <a className="btn" href={PROFILE.linkedin} target="_blank">LinkedIn</a>
              <a className="btn" href={PROFILE.github} target="_blank">GitHub</a>
            </div>
          </div>
          <div className="cell">
            <div className="cell-head"><span>CONTACT · RELAY</span><span className="up">OPEN</span></div>
            <table className="data-table">
              <tbody>
                {[
                  ['EMAIL', PROFILE.email],
                  ['PHONE', PROFILE.phone],
                  ['CITY', PROFILE.location],
                  ['LINKEDIN', '/in/akshat-vora-4930131a1'],
                  ['GITHUB', '@Akilucky-rogue'],
                ].map(([k, v], i) => (
                  <tr key={i} className="xrow" style={{ cursor: 'pointer' }} onClick={() => copy(v)}>
                    <td className="mono tiny mute" style={{ width: 80 }}>{k}</td>
                    <td className="mono xs">{v}</td>
                    <td style={{ width: 60, textAlign: 'right' }}><span className="mono xs" style={{ color: copied === v ? 'var(--green)' : 'var(--ink-mute)' }}>{copied === v ? 'COPIED' : 'COPY'}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--line)', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ink-mute)', letterSpacing: '0.1em' }}>
        <span>© AKSHAT VORA · 2026 · MUMBAI</span>
        <span>BUILT WITH REACT · DEPLOYED ON VIBES</span>
        <span>TKR: AKLV · v2026.04</span>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, About, Work, Projects, Skills, EduCerts, Repos, GHStats, Contact });
