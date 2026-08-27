import { useState, useEffect, useCallback, useRef } from "react";

const API = "/api";
const cls = (...args) => args.filter(Boolean).join(" ");

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true); setError(null); setData(null);
    fetch(url)
      .then(r => r.json())
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [url]);
  return { data, loading, error };
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --border: #1e1e2e;
    --accent: #e50914; --accent2: #ff6b35;
    --text: #e8e8f0; --muted: #6b6b80; --card: #141420; --badge: #1a1a2e;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--text); font-family: 'Inter', sans-serif; min-height: 100vh; overflow-x: hidden; }

  .nav { position: sticky; top: 0; z-index: 100; background: rgba(10,10,15,0.95); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 16px; padding: 0 24px; height: 60px; }
  .nav-logo { font-family: 'Bebas Neue', cursive; font-size: 28px; letter-spacing: 2px; background: linear-gradient(135deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; cursor: pointer; flex-shrink: 0; }
  .search-wrap { flex: 1; max-width: 420px; position: relative; }
  .search-input { width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 8px 40px 8px 14px; color: var(--text); font-size: 14px; outline: none; transition: border-color .2s; }
  .search-input:focus { border-color: var(--accent); }
  .search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--muted); }
  .search-results { position: absolute; top: calc(100% + 6px); left: 0; right: 0; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden; z-index: 200; max-height: 380px; overflow-y: auto; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
  .search-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; cursor: pointer; transition: background .15s; border-bottom: 1px solid var(--border); }
  .search-item:last-child { border-bottom: none; }
  .search-item:hover { background: var(--card); }
  .search-thumb { width: 36px; height: 54px; object-fit: cover; border-radius: 4px; flex-shrink: 0; background: var(--card); }
  .search-name { font-size: 13px; font-weight: 500; }
  .search-badge { font-size: 10px; color: var(--accent); background: rgba(229,9,20,.12); padding: 2px 6px; border-radius: 4px; margin-top: 3px; display: inline-block; }

  .tabs { display: flex; padding: 0 24px; border-bottom: 1px solid var(--border); overflow-x: auto; }
  .tab { padding: 14px 18px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--muted); border-bottom: 2px solid transparent; white-space: nowrap; transition: color .2s, border-color .2s; }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--accent); border-bottom-color: var(--accent); }

  .hero { position: relative; overflow: hidden; height: min(520px, 56vw); min-height: 320px; display: flex; align-items: flex-end; }
  .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center top; filter: brightness(0.45); }
  .hero-grad { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, transparent 60%); }
  .hero-content { position: relative; z-index: 1; padding: 32px; max-width: 600px; }
  .hero-title { font-family: 'Bebas Neue', cursive; font-size: clamp(32px, 5vw, 64px); line-height: 1; letter-spacing: 1px; margin-bottom: 8px; }
  .hero-dots { display: flex; gap: 8px; margin-top: 20px; }
  .hero-dot { width: 28px; height: 3px; border-radius: 2px; background: rgba(255,255,255,.2); cursor: pointer; transition: all .2s; }
  .hero-dot.active { background: var(--accent); width: 48px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; background: var(--accent); color: #fff; border: none; padding: 10px 22px; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; margin-top: 16px; transition: background .15s; }
  .btn:hover { background: #c40811; }
  .btn:disabled { background: var(--muted); cursor: not-allowed; }
  .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
  .btn-outline:hover { background: var(--card); }

  .main { padding: 0 0 60px; }
  .section { margin: 32px 0 0; padding: 0 24px; }
  .section-head { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
  .section-title { font-family: 'Bebas Neue', cursive; font-size: 22px; letter-spacing: 1px; }
  .section-count { font-size: 11px; color: var(--muted); background: var(--badge); padding: 2px 8px; border-radius: 20px; }

  .row-wrap { position: relative; }
  .row { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; scroll-behavior: smooth; }
  .row::-webkit-scrollbar { display: none; }
  .row-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(10,10,15,.85); border: 1px solid var(--border); color: var(--text); width: 36px; height: 80px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; justify-content: center; z-index: 10; transition: background .15s; font-size: 18px; }
  .row-btn:hover { background: var(--accent); }
  .row-btn.left { left: -18px; }
  .row-btn.right { right: -18px; }

  .card { flex-shrink: 0; width: 130px; cursor: pointer; border-radius: 8px; overflow: hidden; transition: transform .2s; position: relative; background: var(--card); }
  .card:hover { transform: scale(1.05); }
  .card img { width: 100%; aspect-ratio: 2/3; object-fit: cover; display: block; }
  .card-info { padding: 6px 4px 2px; }
  .card-name { font-size: 11px; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .card-rating { font-size: 10px; color: #ffc107; margin-top: 2px; }
  .card-badge { position: absolute; top: 6px; right: 6px; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; background: var(--accent); color: #fff; }

  /* Detail */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.85); z-index: 300; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(6px); }
  .detail-box { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; width: 100%; max-width: 700px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 30px 80px rgba(0,0,0,.7); }
  .detail-img { width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block; border-radius: 14px 14px 0 0; filter: brightness(0.55); }
  .detail-img-wrap { position: relative; }
  .detail-title-over { position: absolute; bottom: 16px; left: 20px; font-family: 'Bebas Neue', cursive; font-size: clamp(28px, 5vw, 48px); line-height: 1; text-shadow: 0 2px 8px rgba(0,0,0,.8); }
  .detail-body { padding: 20px; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .chip { font-size: 11px; padding: 3px 10px; border-radius: 20px; background: var(--badge); color: var(--muted); border: 1px solid var(--border); }
  .chip.accent { background: rgba(229,9,20,.15); color: var(--accent); border-color: rgba(229,9,20,.3); }
  .close-btn { position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,.6); border: 1px solid var(--border); color: var(--text); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; z-index: 10; }
  .ep-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 8px; margin-top: 14px; }
  .ep-card { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 10px; cursor: pointer; transition: border-color .15s; }
  .ep-card:hover { border-color: var(--accent); }
  .ep-num { font-size: 11px; color: var(--muted); }
  .ep-name { font-size: 12px; font-weight: 500; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .season-tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
  .season-tab { padding: 5px 14px; font-size: 12px; border-radius: 20px; background: var(--badge); border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all .15s; }
  .season-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* Player */
  .player-overlay { position: fixed; inset: 0; background: #000; z-index: 400; display: flex; flex-direction: column; }
  .player-bar { display: flex; align-items: center; gap: 14px; padding: 12px 20px; background: rgba(0,0,0,.8); flex-shrink: 0; }
  .player-back { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; padding: 4px; }
  .player-title { font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .player-body { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .player-frame { flex: 1; width: 100%; border: none; }
  .server-tabs { display: flex; gap: 8px; padding: 10px 16px; background: rgba(10,10,15,.9); flex-wrap: wrap; }
  .server-tab { font-size: 11px; padding: 5px 12px; border-radius: 20px; background: var(--badge); border: 1px solid var(--border); color: var(--muted); cursor: pointer; transition: all .15s; }
  .server-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }

  .loading-wrap { display: flex; align-items: center; justify-content: center; padding: 60px; flex-direction: column; gap: 14px; flex: 1; }
  .spinner { width: 36px; height: 36px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .err { text-align: center; padding: 40px; color: var(--muted); font-size: 14px; }
  .catalog-grid { display: flex; flex-wrap: wrap; gap: 12px; padding: 24px; }
  .pagination { display: flex; gap: 12px; justify-content: center; padding: 16px; align-items: center; }

  .detail-box::-webkit-scrollbar { width: 4px; }
  .detail-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  @media (max-width: 640px) {
    .nav, .section { padding-left: 14px; padding-right: 14px; }
    .card { width: 110px; }
    .overlay { padding: 0; align-items: flex-end; }
    .detail-box { border-radius: 14px 14px 0 0; max-height: 95vh; }
    .row-btn { display: none; }
    .catalog-grid { padding: 14px; }
  }
`;

// ── Search ──────────────────────────────────────────────────────
function SearchBar({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const doSearch = useCallback(v => {
    if (!v.trim()) { setResults([]); setOpen(false); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(`${API}/search?q=${encodeURIComponent(v)}`);
        const d = await r.json();
        setResults(d.results?.slice(0, 8) || []);
        setOpen(true);
      } catch { setResults([]); }
    }, 350);
  }, []);
  return (
    <div className="search-wrap" ref={ref}>
      <input className="search-input" placeholder="Search movies & series…" value={q}
        onChange={e => { setQ(e.target.value); doSearch(e.target.value); }}
        onFocus={() => results.length && setOpen(true)} />
      <span className="search-icon">🔍</span>
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map(r => (
            <div key={r.slug} className="search-item" onClick={() => { onSelect(r.slug); setQ(""); setResults([]); setOpen(false); }}>
              <img className="search-thumb" src={r.poster_url} alt={r.name} onError={e => e.target.style.background = "#1a1a2e"} />
              <div>
                <div className="search-name">{r.name}</div>
                {r.badge && <span className="search-badge">{r.badge}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Card ────────────────────────────────────────────────────────
function MediaCard({ item, onClick }) {
  return (
    <div className="card" onClick={() => onClick(item.slug)}>
      <img src={item.poster_url} alt={item.name} loading="lazy"
        onError={e => { e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='130' height='195'%3E%3Crect width='130' height='195' fill='%231a1a2e'/%3E%3C/svg%3E"; }} />
      {item.badge && <span className="card-badge">{item.badge}</span>}
      <div className="card-info">
        <div className="card-name">{item.name}</div>
        {item.rating && <div className="card-rating">★ {item.rating}</div>}
      </div>
    </div>
  );
}

// ── Row ─────────────────────────────────────────────────────────
function Section({ section, onCardClick }) {
  const rowRef = useRef(null);
  const scroll = d => rowRef.current?.scrollBy({ left: d * 600, behavior: "smooth" });
  return (
    <div className="section">
      <div className="section-head">
        <h2 className="section-title">{section.section}</h2>
        {section.count && <span className="section-count">{section.count}</span>}
      </div>
      <div className="row-wrap">
        <button className="row-btn left" onClick={() => scroll(-1)}>‹</button>
        <div className="row" ref={rowRef}>
          {(section.items || []).map((item, i) => <MediaCard key={`${item.slug}-${i}`} item={item} onClick={onCardClick} />)}
        </div>
        <button className="row-btn right" onClick={() => scroll(1)}>›</button>
      </div>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────────
function Hero({ items, onCardClick }) {
  const [idx, setIdx] = useState(0);
  const list = items.slice(0, 10);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % list.length), 5000);
    return () => clearInterval(t);
  }, [list.length]);
  const cur = list[idx] || {};
  return (
    <div className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${cur.poster_url})` }} />
      <div className="hero-grad" />
      <div className="hero-content">
        <div className="hero-title">{cur.name}</div>
        {cur.rating && <div style={{ fontSize: 13, color: "#ffc107", marginTop: 4 }}>★ {cur.rating}</div>}
        <button className="btn" onClick={() => onCardClick(cur.slug)}>▶ Watch Now</button>
        <div className="hero-dots">
          {list.map((_, i) => <div key={i} className={cls("hero-dot", i === idx && "active")} onClick={() => setIdx(i)} />)}
        </div>
      </div>
    </div>
  );
}

// ── Player ───────────────────────────────────────────────────────
function Player({ target, onClose }) {
  const [servers, setServers] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  useEffect(() => {
    if (!target) return;
    setLoading(true); setErr(false); setServers([]); setActive(0);
    fetch(`${API}/api/stream/${target.subject_id}?detail_path=${target.slug}`)
      .then(r => r.json())
      .then(d => {
        // Try multiple possible response shapes
        const srcs = d?.sources || d?.servers || d?.links || [];
        // Also check for a single url/embed
        const single = d?.url || d?.stream_url || d?.embed || d?.link || d?.iframe;
        if (srcs.length > 0) {
          setServers(srcs.map((s, i) => ({ label: s.name || s.server || `Server ${i + 1}`, url: s.url || s.link || s.embed || s.iframe || "" })));
        } else if (single) {
          setServers([{ label: "Server 1", url: single }]);
        } else {
          // Fallback: use vidsrc embed with subject_id
          setServers([
            { label: "VidSrc", url: `https://vidsrc.to/embed/movie/${target.subject_id}` },
            { label: "VidSrc2", url: `https://vidsrc.me/embed/movie?tmdb=${target.subject_id}` },
          ]);
        }
        setLoading(false);
      })
      .catch(() => {
        // Fallback servers even on error
        setServers([
          { label: "VidSrc", url: `https://vidsrc.to/embed/movie/${target.subject_id}` },
          { label: "VidSrc2", url: `https://vidsrc.me/embed/movie?tmdb=${target.subject_id}` },
        ]);
        setLoading(false);
      });
  }, [target]);

  if (!target) return null;
  const cur = servers[active];

  return (
    <div className="player-overlay">
      <div className="player-bar">
        <button className="player-back" onClick={onClose}>←</button>
        <span className="player-title">{target.name}</span>
      </div>
      <div className="player-body">
        {servers.length > 1 && (
          <div className="server-tabs">
            {servers.map((s, i) => (
              <button key={i} className={cls("server-tab", i === active && "active")} onClick={() => setActive(i)}>
                {s.label}
              </button>
            ))}
          </div>
        )}
        {loading && <div className="loading-wrap"><div className="spinner" /><span style={{ color: "var(--muted)", fontSize: 13 }}>Loading stream…</span></div>}
        {!loading && cur?.url && (
          <iframe className="player-frame" src={cur.url} allowFullScreen allow="autoplay; fullscreen; encrypted-media" title={target.name} referrerPolicy="no-referrer" />
        )}
        {!loading && !cur?.url && (
          <div className="loading-wrap">
            <span style={{ fontSize: 48 }}>⚠️</span>
            <span style={{ color: "var(--muted)", fontSize: 14 }}>No stream found for this title.</span>
            <button className="btn" onClick={onClose}>← Go Back</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Detail ───────────────────────────────────────────────────────
function DetailPanel({ slug, onClose, onPlay }) {
  const { data, loading } = useFetch(slug ? `${API}/detail/${slug}` : null);
  const [season, setSeason] = useState(0);
  useEffect(() => { setSeason(0); }, [slug]);
  if (!slug) return null;
  const d = data?.detail;
  const seasons = d?.seasons || [];
  const episodes = seasons[season]?.episodes || [];

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="detail-box">
        <button className="close-btn" onClick={onClose}>✕</button>
        {loading && <div className="loading-wrap"><div className="spinner" /></div>}
        {d && (
          <>
            <div className="detail-img-wrap">
              <img className="detail-img" src={d.backdrop_url || d.poster_url} alt={d.name} onError={e => e.target.style.display = "none"} />
              <div className="detail-title-over">{d.name}</div>
            </div>
            <div className="detail-body">
              <div className="chips">
                {d.rating && <span className="chip accent">★ {d.rating}</span>}
                {d.year && <span className="chip">{d.year}</span>}
                {(d.genre || []).map(g => <span key={g} className="chip">{g}</span>)}
                {d.language && <span className="chip">{d.language}</span>}
              </div>
              {d.description && <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, marginBottom: 16 }}>{d.description}</p>}
              {!seasons.length && (
                <button className="btn" onClick={() => onPlay({ subject_id: d.subject_id, slug, name: d.name, type: "movie" })}>
                  ▶ Play Movie
                </button>
              )}
              {seasons.length > 0 && (
                <>
                  <div className="season-tabs">
                    {seasons.map((s, i) => (
                      <button key={i} className={cls("season-tab", i === season && "active")} onClick={() => setSeason(i)}>
                        {s.name || `Season ${i + 1}`}
                      </button>
                    ))}
                  </div>
                  <div className="ep-grid">
                    {episodes.map((ep, i) => (
                      <div key={ep.subject_id || i} className="ep-card"
                        onClick={() => onPlay({ subject_id: ep.subject_id, slug, name: `${d.name} — ${ep.name || `EP ${i + 1}`}`, type: "tv" })}>
                        <div className="ep-num">EP {ep.episode_number || i + 1}</div>
                        <div className="ep-name">{ep.name || `Episode ${i + 1}`}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Home ─────────────────────────────────────────────────────────
function HomePage({ onCardClick }) {
  const { data, loading, error } = useFetch(`${API}/home`);
  if (loading) return <div className="loading-wrap"><div className="spinner" /></div>;
  if (error) return <div className="err">Error: {error}</div>;
  if (!data?.sections) return null;
  const banner = data.sections.find(s => s.section === "Banner") || data.sections[0];
  return (
    <>
      {banner?.items?.length > 0 && <Hero items={banner.items} onCardClick={onCardClick} />}
      {data.sections.map(sec => sec.items?.length > 0 && <Section key={sec.section} section={sec} onCardClick={onCardClick} />)}
    </>
  );
}

// ── Catalog ──────────────────────────────────────────────────────
function CatalogPage({ endpoint, onCardClick }) {
  const [page, setPage] = useState(1);
  const { data, loading } = useFetch(`${API}/${endpoint}?page=${page}`);
  const items = data?.results || data?.items || [];
  return (
    <>
      {loading && <div className="loading-wrap"><div className="spinner" /></div>}
      {!loading && (
        <>
          <div className="catalog-grid">{items.map((it, i) => <MediaCard key={`${it.slug}-${i}`} item={it} onClick={onCardClick} />)}</div>
          <div className="pagination">
            <button className="btn btn-outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>← Prev</button>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>Page {page}</span>
            <button className="btn" onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>
        </>
      )}
    </>
  );
}

// ── Root ─────────────────────────────────────────────────────────
const TABS = [
  { label: "Home", key: "home" },
  { label: "TV Series", key: "tv-series" },
  { label: "Movies", key: "movies" },
  { label: "Animation", key: "animation" },
];

export default function App() {
  const [tab, setTab] = useState("home");
  const [detail, setDetail] = useState(null);
  const [player, setPlayer] = useState(null);
  const handleCard = useCallback(slug => setDetail(slug), []);
  const handlePlay = useCallback(target => { setPlayer(target); setDetail(null); }, []);

  return (
    <>
      <style>{styles}</style>
      <nav className="nav">
        <div className="nav-logo" onClick={() => setTab("home")}>MOVIEBOX</div>
        <SearchBar onSelect={handleCard} />
      </nav>
      <div className="tabs">
        {TABS.map(t => <div key={t.key} className={cls("tab", tab === t.key && "active")} onClick={() => setTab(t.key)}>{t.label}</div>)}
      </div>
      <main className="main">
        {tab === "home" && <HomePage onCardClick={handleCard} />}
        {tab !== "home" && <CatalogPage endpoint={tab} onCardClick={handleCard} />}
      </main>
      {detail && <DetailPanel slug={detail} onClose={() => setDetail(null)} onPlay={handlePlay} />}
      {player && <Player target={player} onClose={() => setPlayer(null)} />}
    </>
  );
}
