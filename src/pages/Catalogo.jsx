import { useState, useMemo, useEffect } from "react";
import { productService } from '../services/productService';
import { useNavigate } from 'react-router-dom'
import { Loader } from '../Components/Loader'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { useTranslation } from "react-i18next";

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
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    const { agregarAlCarrito, items } = useCart()
    const { usuario } = useAuth()
    const { t } = useTranslation()



    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const data = await productService.getAll()
                setProductos(data)
            } catch (error) {
                console.log('Error cargando productos:', error)
            } finally {
                setLoading(false)
            }
        }
        cargarProductos()
    }, [])

    const filtered = useMemo(() => {
        let result = [...productos];
        if (activeCategory !== "Todos")
            result = result.filter(p => p.categoria === activeCategory);
        if (search.trim())
            result = result.filter(p =>
                p.nombre.toLowerCase().includes(search.toLowerCase()) ||
                p.categoria.toLowerCase().includes(search.toLowerCase())
            );
        if (sort === "price-asc") result.sort((a, b) => a.precio - b.precio);
        if (sort === "price-desc") result.sort((a, b) => b.precio - a.precio);
        if (sort === "rating") result.sort((a, b) => b.rating - a.rating);
        return result;
    }, [activeCategory, search, sort, productos]);

    const handleAgregar = (producto) => {

        if (!usuario) {
            navigate('/login')
            return

        }
        agregarAlCarrito(producto)
        toast.success(`₡{producto.nombre} agregado al carrito`, { duration: 2000 })

    }





    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700&family=Syne:wght@400;500;600&display=swap');

                .ctlg {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
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
    display: flex;
    flex-direction: column;
}

                .cp-card:hover {
    border-color: var(--border-accent);
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.5), var(--glow-soft);
}

                .cp-img {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
    background: linear-gradient(135deg, rgba(124,58,237,0.08), rgba(247,37,133,0.05));
}

.cp-img img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.4s ease;
}

.cp-card:hover .cp-img img {
    transform: scale(1.08);
}

                .cp-emoji {
    font-size: 3.5rem;
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    filter: drop-shadow(0 0 14px rgba(168,85,247,0.3));
    transition: transform 0.3s;
}

.cp-card:hover .cp-emoji {
    transform: translate(-50%, -60%) scale(1.1);
}
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
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
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
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
                <div className="ctlg-label">{t('tienda')}</div>
                <h1 className="ctlg-title">{t('catalogo')}</h1>
                <p className="ctlg-count">
                    {t('mostrando')} <span>{filtered.length}</span> {t('de')} <span>{productos.length}</span> {t('productos')}
                </p>

                {/* Toolbar */}
                <div className="ctlg-toolbar">
                    <div className="ctlg-search-wrap">
                        <span className="ctlg-search-icon">🔍</span>
                        <input
                            className="ctlg-search"
                            type="text"
                            placeholder={t('buscarProductos')}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <select className="ctlg-sort" value={sort} onChange={e => setSort(e.target.value)}>
                        <option value="default">{t('relevancia')}</option>
                        <option value="price-asc">{t('precioMenor')}</option>
                        <option value="price-desc">{t('precioMayor')}</option>
                        <option value="rating">{t('mejorValorados')}</option>
                    </select>

                    <div className="ctlg-view-toggle">
                        <button
                            className={`ctlg-view-btn ${viewMode === "grid" ? "active" : ""}`}
                            onClick={() => setViewMode("grid")}
                        >⊞</button>
                        <button
                            className={`ctlg-view-btn ${viewMode === "list" ? "active" : ""}`}
                            onClick={() => setViewMode("list")}
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
                            {cat === "Todos" ? t('todos') : cat}
                        </button>
                    ))}
                </div>

                {/* Productos */}
                {loading ? (
                    <div className="ctlg-empty"><Loader /></div>
                ) : filtered.length === 0 ? (
                    <div className="ctlg-empty">
                        <div className="ctlg-empty-icon">🔭</div>
                        <div className="ctlg-empty-title">{t('noEncontrados')}</div>
                        <p>{t('intentaOtra')}</p>
                    </div>
                ) : viewMode === "grid" ? (
                    <div className="ctlg-grid">
                        {filtered.map(p => (
                            <div key={p.id} className="cp-card" onClick={() => navigate(`/producto/${p.id}`)}>
                                <div className="cp-img">
                                    {p.imagen_url
                                        ? <img src={p.imagen_url} alt={p.nombre} />
                                        : <span className="cp-emoji">{p.emoji}</span>
                                    }
                                    {p.badge && <span className="cp-badge">{p.badge}</span>}
                                </div>
                                <div className="cp-info">
                                    <div className="cp-cat">{p.categoria}</div>
                                    <div className="cp-name">{p.nombre}</div>
                                    <div className="cp-rating">
                                        <span className="cp-stars">★★★★★</span>
                                        {p.rating} ({p.reviews})
                                    </div>
                                    <div className="cp-footer">
                                        <div className="cp-price">₡{p.precio.toLocaleString()}</div>
                                        <button className="cp-add" onClick={(e) => { e.stopPropagation(); handleAgregar(p) }}>
                                            + {t('carrito')}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="ctlg-list">
                        {filtered.map(p => (
                            <div key={p.id} className="cp-list-card" onClick={() => navigate(`/producto/${p.id}`)}>
                                <div className="cp-list-img">
                                    {p.imagen_url
                                        ? <img src={p.imagen_url} alt={p.nombre} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                        : p.emoji
                                    }
                                </div>
                                <div className="cp-list-info">
                                    <div className="cp-list-name">{p.nombre}</div>
                                    <div className="cp-list-meta">
                                        <span style={{ color: "var(--accent-violet)" }}>{p.categoria}</span>
                                        <span>★ {p.rating} ({p.reviews} {t('resenas')})</span>
                                        {p.badge && <span style={{ color: "var(--accent-pink)" }}>{p.badge}</span>}
                                    </div>
                                </div>
                                <div className="cp-list-actions">
                                    <div className="cp-price">₡{p.precio.toLocaleString()}</div>
                                    <button className="cp-add" onClick={(e) => { e.stopPropagation(); handleAgregar(p) }}>
                                        + {t('carrito')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </>
    );
}