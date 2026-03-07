export function Loader() {
    return (
        <>
            <style>{`
                .warp-loader {
                    position: relative;
                    width: 160px;
                    height: 160px;
                }
                .ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(124,58,237,0.15) 30%, transparent 70%);
                    animation: pulse 2.2s ease-out infinite;
                    opacity: 0;
    box-shadow: 0 0 12px #7c3aed66, 0 0 24px #7c3aed33;
    border: 2px solid rgba(168,85,247,0.2);
                }
                .ring:nth-child(1) { animation-delay: 0s;   }
                .ring:nth-child(2) { animation-delay: 0.4s; }
                .ring:nth-child(3) { animation-delay: 0.8s; }
                .ring:nth-child(4) { animation-delay: 1.2s; }
                @keyframes pulse {

                    0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 1;    }
                    70%  { transform: translate(-50%, -50%) scale(1.1); opacity: 0.15; }
                    100% { transform: translate(-50%, -50%) scale(1.4); opacity: 0;    }
                }
                .core-glow {
                    position: absolute;
                    top: 50%; left: 50%;
                    width: 24px; height: 24px;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
    background: radial-gradient(circle at center, #a855f7, #7c3aed);
    box-shadow: 0 0 25px #a855f7, 0 0 60px #a855f788, 0 0 100px #a855f733;
                    animation: corePulse 1.6s ease-in-out infinite;
                }
                @keyframes corePulse {
                    0%, 100% { transform: translate(-50%, -50%) scale(1);   }
                    50%      { transform: translate(-50%, -50%) scale(1.2); }
                }
                .loader-wrap {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: var(--bg-deep);
                    gap: 2rem;
                }
                .loader-text {
                    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif;, monospace;
                    font-size: 0.8rem;
                    letter-spacing: 0.2em;
    color: #a855f7;
                    text-transform: uppercase;
                    opacity: 0.7;
                }
            `}</style>

            <div className="loader-wrap">
                <div className="warp-loader">
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="ring"></div>
                    <div className="core-glow"></div>
                </div>
                <div className="loader-text">Cargando...</div>
            </div>
        </>
    )
}