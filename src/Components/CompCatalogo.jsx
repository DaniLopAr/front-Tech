import { useState, useMemo } from "react";

const ALL_PRODUCTS = [
    { id: 1, name: "MacBook Pro M3", category: "Laptops", price: 1899, emoji: "💻", badge: "Nuevo", rating: 4.9, reviews: 128 },
    { id: 2, name: "Samsung Galaxy S25", category: "Smartphones", price: 999, emoji: "📱", badge: "Top ventas", rating: 4.8, reviews: 243 },
    { id: 3, name: "Sony WH-1000XM6", category: "Audio", price: 349, emoji: "🎧", badge: null, rating: 4.9, reviews: 89 },
    { id: 4, name: "Apple Watch Ultra 2", category: "Wearables", price: 799, emoji: "⌚", badge: "Popular", rating: 4.7, reviews: 156 },
    { id: 5, name: "Dell XPS 15", category: "Laptops", price: 1599, emoji: "💻", badge: null, rating: 4.6, reviews: 74 },
    { id: 6, name: "iPhone 16 Pro", category: "Smartphones", price: 1099, emoji: "📱", badge: "Nuevo", rating: 4.8, reviews: 312 },
    { id: 7, name: 'LG UltraGear 27"', category: "Monitores", price: 449, emoji: "🖥️", badge: null, rating: 4.5, reviews: 61 },
    { id: 8, name: "PS5 DualSense Edge", category: "Gaming", price: 199, emoji: "🎮", badge: "Popular", rating: 4.9, reviews: 204 },
    { id: 9, name: "AirPods Pro 3", category: "Audio", price: 249, emoji: "🎧", badge: "Nuevo", rating: 4.7, reviews: 98 },
    { id: 10, name: 'Samsung 4K OLED 32"', category: "Monitores", price: 899, emoji: "🖥️", badge: null, rating: 4.6, reviews: 45 },
    { id: 11, name: "Lenovo Legion Pro 5", category: "Gaming", price: 1349, emoji: "💻", badge: null, rating: 4.7, reviews: 83 },
    { id: 12, name: "Garmin Fenix 7", category: "Wearables", price: 599, emoji: "⌚", badge: null, rating: 4.8, reviews: 67 },
];

const CATEGORIES = ["Todos", "Laptops", "Smartphones", "Audio", "Wearables", "Monitores", "Gaming"];

const SORT_OPTIONS = [
    { value: "default", label: "Relevancia" },
    { value: "price-asc", label: "Precio: menor a mayor" },
    { value: "price-desc", label: "Precio: mayor a menor" },
    { value: "rating", label: "Mejor valorados" },
];

export function Catalog() {
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");
    const [viewMode, setViewMode] = useState("grid");

    const filtered = useMemo(() => {
        let result = [...ALL_PRODUCTS];
        if (activeCategory !== "Todos")
            result = result.filter(p => p.category === activeCategory);
        if (search.trim())
            result = result.filter(p =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
            );
        if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
        if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
        if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
        return result;
    }, [activeCategory, search, sort]);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Syne:wght@400;500;600&display=swap');

                .ctlg {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: 'Syne', sans-serif;
                    color: var(--text-primary);
                    padding: 100px 5% 5rem;
                    box-sizing: border-box;
                }

                /* HEADER */
                .ctlg-label {
                    font-size: 0.65rem;
                    letter-spacing: 0.2em;
                    text-transform: uppercase;
                    color: var(--accent-violet);
                    font-weight: 600;
                    margin-bottom: 0.4rem;
                }

                .ctlg-title {
                    font-family: 'Orbitron', monospace;
                    font-size: clamp(1.6rem, 3vw, 2.2rem);
                    font-weight: 700;
                    margin-bottom: 0.4rem;
                }

                .ctlg-count {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                }

                .ctlg-count span { color: var(--accent-violet); font-weight: 600; }

                /* TOOLBAR */
                .ctlg-toolbar {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    flex-wrap: wrap;
                    margin-bottom: 1.25rem;
                }

                .ctlg-search-wrap {
                    position: relative;
                    flex: 1;
                    min-width: 200px;
                }

                .ctlg-search-icon {
                    position: absolute;
                    left: 14px; top: 50%;
                    transform: translateY(-50%);
                    font-size: 0.85rem;
                    opacity: 0.4;
                    pointer-events: none;
                }

                .ctlg-search {
                    width: 100%;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    padding: 0.65rem 1rem 0.65rem 2.4rem;
                    color: var(--text-primary);
                    font-family: 'Syne', sans-serif;
                    font-size: 0.85rem;
                    outline: none;
                    transition: border-color 0.25s, box-shadow 0.25s;
                    box-sizing: border-box;
                }

                .ctlg-search::placeholder { color: var(--text-muted); }
                .ctlg-search:focus {
                    border-color: var(--accent-violet);
                    box-shadow: var(--glow-soft);
                }

                .ctlg-sort {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    padding: 0.65rem 1rem;
                    color: var(--text-secondary);
                    font-family: 'Syne', sans-serif;
                    font-size: 0.82rem;
                    outline: none;
                    cursor: pointer;
                    min-width: 190px;
                    transition: border-color 0.25s;
                }

                .ctlg-sort:focus { border-color: var(--accent-violet); }

                .ctlg-view-toggle {
                    display: flex;
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 12px;
                    overflow: hidden;
                }

                .ctlg-view-btn {
                    padding: 0.65rem 0.9rem;
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 1.1rem;
                    line-height: 1;
                    transition: all 0.2s;
                }

                .ctlg-view-btn.active {
                    background: rgba(124,58,237,0.2);
                    color: var(--accent-violet);
                }

                /* CATEGORÍAS */
                .ctlg-cats {
                    display: flex;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    margin-bottom: 2rem;
                }

                .ctlg-cat-btn {
                    padding: 0.4rem 1rem;
                    border-radius: 100px;
                    border: 1px solid var(--border-subtle);
                    background: transparent;
                    color: var(--text-muted);
                    font-family: 'Syne', sans-serif;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    letter-spacing: 0.04em;
                }

                .ctlg-cat-btn:hover {
                    border-color: var(--border-accent);
                    color: var(--text-primary);
                }

                .ctlg-cat-btn.active {
                    background: var(--gradient-button);
                    border-color: transparent;
                    color: white;
                    box-shadow: var(--glow-purple);
                }

                /* GRID */
                .ctlg-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1.25rem;
                }

                /* LISTA */
                .ctlg-list {
                    display: flex;
                    flex-direction: column;
                    gap: 0.9rem;
                }

                /* TARJETA GRID */
                .cp-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 18px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }

                .cp-card:hover {
                    border-color: var(--border-accent);
                    transform: translateY(-5px);
                    box-shadow: 0 16px 40px rgba(0,0,0,0.4), var(--glow-soft);
                }

                .cp-img {
                    background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(247,37,133,0.05));
                    padding: 1.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 140px;
                    position: relative;
                }

                .cp-emoji {
                    font-size: 3.5rem;
                    filter: drop-shadow(0 0 14px rgba(168,85,247,0.3));
                    transition: transform 0.3s;
                }

                .cp-card:hover .cp-emoji { transform: scale(1.1) translateY(-4px); }

                .cp-badge {
                    position: absolute;
                    top: 10px; left: 10px;
                    background: var(--gradient-hero);
                    color: white;
                    font-size: 0.58rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    padding: 0.2rem 0.55rem;
                    border-radius: 100px;
                }

                .cp-info { padding: 1.1rem; }

                .cp-cat {
                    font-size: 0.62rem;
                    color: var(--accent-violet);
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    margin-bottom: 0.3rem;
                }

                .cp-name {
                    font-family: 'Orbitron', monospace;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.4rem;
                    line-height: 1.3;
                }

                .cp-rating {
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    margin-bottom: 0.75rem;
                }

                .cp-stars { color: #f59e0b; }

                .cp-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .cp-price {
                    font-family: 'Orbitron', monospace;
                    font-size: 1.05rem;
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .cp-add {
                    background: rgba(124,58,237,0.15);
                    border: 1px solid var(--border-accent);
                    border-radius: 8px;
                    padding: 0.38rem 0.75rem;
                    color: var(--accent-violet);
                    font-family: 'Syne', sans-serif;
                    font-size: 0.72rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.25s;
                }

                .cp-add:hover {
                    background: var(--gradient-button);
                    color: white;
                    border-color: transparent;
                    box-shadow: var(--glow-purple);
                }

                /* TARJETA LISTA */
                .cp-list-card {
                    background: var(--bg-surface);
                    border: 1px solid var(--border-subtle);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    padding: 1.1rem 1.25rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .cp-list-card:hover {
                    border-color: var(--border-accent);
                    box-shadow: var(--glow-soft);
                    transform: translateX(4px);
                }

                .cp-list-img {
                    background: linear-gradient(135deg, rgba(124,58,237,0.1), rgba(247,37,133,0.06));
                    border-radius: 12px;
                    width: 76px; height: 76px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    font-size: 2.2rem;
                }

                .cp-list-info { flex: 1; min-width: 0; }

                .cp-list-name {
                    font-family: 'Orbitron', monospace;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.35rem;
                }

                .cp-list-meta {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    font-size: 0.72rem;
                    color: var(--text-muted);
                    flex-wrap: wrap;
                }

                .cp-list-actions {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.5rem;
                    flex-shrink: 0;
                }

                /* VACÍO */
                .ctlg-empty {
                    text-align: center;
                    padding: 5rem 2rem;
                    color: var(--text-muted);
                }

                .ctlg-empty-icon { font-size: 3rem; margin-bottom: 1rem; }

                .ctlg-empty-title {
                    font-family: 'Orbitron', monospace;
                    font-size: 1rem;
                    color: var(--text-secondary);
                    margin-bottom: 0.5rem;
                }

                @media (max-width: 640px) {
                    .ctlg-toolbar { flex-direction: column; align-items: stretch; }
                    .ctlg-sort { min-width: unset; }
                    .cp-list-card { flex-wrap: wrap; }
                    .cp-list-actions { flex-direction: row; width: 100%; justify-content: space-between; }
                }
            `}</style>

            <div className="ctlg">

                {/* Header */}
                <div className="ctlg-label">Tienda</div>
                <h1 className="ctlg-title">Catálogo</h1>
                <p className="ctlg-count">
                    Mostrando <span>{filtered.length}</span> de <span>{ALL_PRODUCTS.length}</span> productos
                </p>

                {/* Toolbar */}
                <div className="ctlg-toolbar">
                    <div className="ctlg-search-wrap">
                        <span className="ctlg-search-icon">🔍</span>
                        <input
                            className="ctlg-search"
                            type="text"
                            placeholder="Buscar productos..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="ctlg-sort"
                        value={sort}
                        onChange={e => setSort(e.target.value)}
                    >
                        {SORT_OPTIONS.map(o => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                    </select>

                    <div className="ctlg-view-toggle">
                        <button
                            className={`ctlg-view-btn ${viewMode === "grid" ? "active" : ""}`}
                            onClick={() => setViewMode("grid")}
                            title="Vista grid"
                        >⊞</button>
                        <button
                            className={`ctlg-view-btn ${viewMode === "list" ? "active" : ""}`}
                            onClick={() => setViewMode("list")}
                            title="Vista lista"
                        >☰</button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="ctlg-cats">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            className={`ctlg-cat-btn ${activeCategory === cat ? "active" : ""}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Productos */}
                {filtered.length === 0 ? (
                    <div className="ctlg-empty">
                        <div className="ctlg-empty-icon">🔭</div>
                        <div className="ctlg-empty-title">No se encontraron productos</div>
                        <p>Intenta con otra búsqueda o categoría</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="ctlg-grid">
                        {filtered.map(p => (
                            <div key={p.id} className="cp-card">
                                <div className="cp-img">
                                    <span className="cp-emoji">{p.emoji}</span>
                                    {p.badge && <span className="cp-badge">{p.badge}</span>}
                                </div>
                                <div className="cp-info">
                                    <div className="cp-cat">{p.category}</div>
                                    <div className="cp-name">{p.name}</div>
                                    <div className="cp-rating">
                                        <span className="cp-stars">★★★★★</span>
                                        {p.rating} ({p.reviews})
                                    </div>
                                    <div className="cp-footer">
                                        <div className="cp-price">${p.price.toLocaleString()}</div>
                                        <button className="cp-add">+ Carrito</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="ctlg-list">
                        {filtered.map(p => (
                            <div key={p.id} className="cp-list-card">
                                <div className="cp-list-img">{p.emoji}</div>
                                <div className="cp-list-info">
                                    <div className="cp-list-name">{p.name}</div>
                                    <div className="cp-list-meta">
                                        <span style={{ color: "var(--accent-violet)" }}>{p.category}</span>
                                        <span>★ {p.rating} ({p.reviews} reseñas)</span>
                                        {p.badge && <span style={{ color: "var(--accent-pink)" }}>{p.badge}</span>}
                                    </div>
                                </div>
                                <div className="cp-list-actions">
                                    <div className="cp-price">${p.price.toLocaleString()}</div>
                                    <button className="cp-add">+ Carrito</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}