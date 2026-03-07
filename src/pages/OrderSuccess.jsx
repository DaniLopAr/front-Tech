import { useNavigate } from "react-router-dom";

export function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <>
            <style>{`
                .success {
                    min-height: 100vh;
                    background: var(--bg-deep);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    gap: 1.5rem;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    text-align: center;
                    padding: 2rem;
                }

                .success-icon {
                    font-size: 5rem;
                    animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes pop {
                    from { transform: scale(0); }
                    to   { transform: scale(1); }
                }

                .success-title {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: clamp(1.5rem, 3vw, 2rem);
                    font-weight: 700;
                    background: var(--gradient-hero);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .success-desc {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    max-width: 400px;
                    line-height: 1.6;
                }

                .success-btn {
                    padding: 0.85rem 2rem;
                    background: var(--gradient-button);
                    border: none;
                    border-radius: 12px;
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;
                    font-size: 0.9rem;
                    font-weight: 700;
                    cursor: pointer;
                    box-shadow: var(--glow-purple);
                    transition: all 0.3s;
                }

                .success-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 0 24px #a855f7cc;
                }
            `}</style>

            <div className="success">
                <div className="success-icon">✅</div>
                <h1 className="success-title">¡Pago exitoso!</h1>
                <p className="success-desc">
                    Tu pedido ha sido confirmado. 
                </p>
                <button className="success-btn" onClick={() => navigate('/catalog')}>
                    Seguir comprando →
                </button>
            </div>
        </>
    )

}