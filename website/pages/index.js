import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Quantum Internet | Global Quantum Computing Network</title>
        <meta name="description" content="22 quantum backends across 7 countries powering LUXBIN Light Language blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container">
        <header className="hero">
          <div className="hero-badge">World's First Global Quantum Superposition</div>
          <h1>Quantum Internet</h1>
          <p className="tagline">22 quantum backends across 7 countries powering LUXBIN Light Language</p>
          <div className="hero-buttons">
            <a href="https://github.com/mermaidnicheboutique-code/quantum-internet" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
            <a href="#achievement" className="btn btn-secondary">
              See Achievement
            </a>
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <span className="stat-number">22</span>
            <span className="stat-label">Quantum Backends</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">7</span>
            <span className="stat-label">Countries</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">4</span>
            <span className="stat-label">Continents</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">12+</span>
            <span className="stat-label">Quantum Computers</span>
          </div>
        </section>

        <section id="achievement" className="achievement">
          <h2>Global Quantum Superposition Achievement</h2>
          <div className="quantum-state">
            <code>Ψ_global = Σ |Hello World!⟩_LUXBIN ⊗ |entangled⟩_international</code>
          </div>
          <p>"Hello World!" successfully broadcasted in LUXBIN Light Language across 6 countries simultaneously!</p>

          <div className="achievement-grid">
            <div className="achievement-item">
              <span className="flag">First Global Quantum Superposition</span>
              <p>across multiple countries</p>
            </div>
            <div className="achievement-item">
              <span className="flag">LUXBIN Light Language</span>
              <p>broadcasted internationally</p>
            </div>
            <div className="achievement-item">
              <span className="flag">Photonic Quantum Computing</span>
              <p>integrated globally</p>
            </div>
            <div className="achievement-item">
              <span className="flag">Multi-Continental Entanglement</span>
              <p>demonstrated</p>
            </div>
          </div>
        </section>

        <section className="providers">
          <h2>Quantum Providers Connected</h2>
          <div className="provider-grid">
            <div className="provider-card">
              <h3>USA</h3>
              <ul>
                <li>IBM Quantum (156 qubits)</li>
                <li>IonQ (32 qubits)</li>
                <li>Rigetti (80 qubits)</li>
                <li>Google Cirq</li>
              </ul>
            </div>
            <div className="provider-card">
              <h3>Finland</h3>
              <ul>
                <li>IQM Garnet (20 qubits)</li>
                <li>IQM Apollo (5 qubits)</li>
              </ul>
            </div>
            <div className="provider-card">
              <h3>France</h3>
              <ul>
                <li>Quandela Cloud (12 qubits)</li>
                <li>Pasqal Fresnel (20 qubits)</li>
              </ul>
            </div>
            <div className="provider-card">
              <h3>China</h3>
              <ul>
                <li>Alibaba Tianti (10 qubits)</li>
                <li>Baidu QPU (8 qubits)</li>
              </ul>
            </div>
            <div className="provider-card">
              <h3>Japan</h3>
              <ul>
                <li>RIKEN (64 qubits)</li>
              </ul>
            </div>
            <div className="provider-card">
              <h3>Australia</h3>
              <ul>
                <li>Silicon Quantum Computing (4 qubits)</li>
              </ul>
            </div>
            <div className="provider-card">
              <h3>UK</h3>
              <ul>
                <li>AWS Braket OQC (8 qubits)</li>
                <li>Azure Quantinuum (20 qubits)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="technology">
          <h2>Quantum Technologies</h2>
          <div className="tech-grid">
            <div className="tech-card">
              <h3>Photonic</h3>
              <p>Light-based quantum computing with Quandela</p>
            </div>
            <div className="tech-card">
              <h3>Superconducting</h3>
              <p>IBM, IQM, Rigetti quantum processors</p>
            </div>
            <div className="tech-card">
              <h3>Ion Trap</h3>
              <p>IonQ trapped-ion quantum computers</p>
            </div>
            <div className="tech-card">
              <h3>Neutral Atom</h3>
              <p>Pasqal neutral atom arrays</p>
            </div>
          </div>
        </section>

        <section className="luxbin">
          <h2>LUXBIN Light Language</h2>
          <p>Messages encoded in photonic wavelengths across quantum computers worldwide</p>
          <ul>
            <li>11 photonic encodings per message</li>
            <li>Simultaneous broadcast across all backends</li>
            <li>Quantum-secured communication</li>
            <li>Light-based blockchain validation</li>
          </ul>
        </section>

        <section className="docs">
          <h2>Documentation</h2>
          <div className="docs-grid">
            <a href="https://github.com/mermaidnicheboutique-code/quantum-internet#readme" className="doc-card" target="_blank" rel="noopener noreferrer">
              <h3>Getting Started</h3>
              <p>Setup guide and quick start</p>
            </a>
            <a href="https://github.com/mermaidnicheboutique-code/quantum-internet/blob/main/QUANTUM_INTERNET_MULTI_PROVIDER_README.md" className="doc-card" target="_blank" rel="noopener noreferrer">
              <h3>Multi-Provider Setup</h3>
              <p>Connect to quantum backends</p>
            </a>
            <a href="https://github.com/mermaidnicheboutique-code/quantum-internet/blob/main/GLOBAL_QUANTUM_SUPERPOSITION_ACHIEVEMENT.md" className="doc-card" target="_blank" rel="noopener noreferrer">
              <h3>Achievement Details</h3>
              <p>World-first documentation</p>
            </a>
            <a href="https://github.com/mermaidnicheboutique-code/quantum-internet/blob/main/QUANTUM_WIFI_GUIDE.md" className="doc-card" target="_blank" rel="noopener noreferrer">
              <h3>Quantum WiFi</h3>
              <p>Wireless quantum connections</p>
            </a>
          </div>
        </section>

        <footer>
          <p>Quantum Internet by <a href="https://github.com/mermaidnicheboutique-code" target="_blank" rel="noopener noreferrer">Nichole Christie</a></p>
          <p className="footer-sub">Powering the future of global quantum communication</p>
        </footer>
      </main>

      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2e 100%);
          color: #fff;
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .hero {
          text-align: center;
          padding: 80px 20px;
        }

        .hero-badge {
          display: inline-block;
          background: linear-gradient(90deg, #00f5a0, #00d9f5);
          color: #000;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .hero h1 {
          font-size: 4rem;
          background: linear-gradient(90deg, #00f5a0, #00d9f5, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
        }

        .tagline {
          font-size: 1.4rem;
          color: #a0a0c0;
          margin-bottom: 30px;
        }

        .hero-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 15px 30px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(90deg, #00f5a0, #00d9f5);
          color: #000;
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid #00d9f5;
          color: #00d9f5;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          padding: 40px 0;
        }

        .stat-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 3rem;
          font-weight: 700;
          background: linear-gradient(90deg, #00f5a0, #00d9f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .stat-label {
          color: #a0a0c0;
          font-size: 0.9rem;
        }

        section {
          padding: 60px 0;
        }

        h2 {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 40px;
          background: linear-gradient(90deg, #fff, #a0a0c0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .achievement {
          background: rgba(168, 85, 247, 0.1);
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
        }

        .quantum-state {
          background: rgba(0,0,0,0.3);
          border-radius: 10px;
          padding: 20px;
          margin: 30px 0;
          overflow-x: auto;
        }

        .quantum-state code {
          font-size: 1.2rem;
          color: #00f5a0;
        }

        .achievement-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .achievement-item {
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .achievement-item .flag {
          color: #00f5a0;
          font-weight: 600;
        }

        .provider-grid, .tech-grid, .docs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .provider-card, .tech-card, .doc-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 25px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .provider-card:hover, .tech-card:hover, .doc-card:hover {
          transform: translateY(-5px);
          border-color: #00d9f5;
        }

        .provider-card h3, .tech-card h3, .doc-card h3 {
          color: #00d9f5;
          margin-bottom: 15px;
        }

        .provider-card ul {
          list-style: none;
        }

        .provider-card li {
          padding: 5px 0;
          color: #c0c0e0;
        }

        .doc-card {
          text-decoration: none;
          color: inherit;
        }

        .doc-card p {
          color: #a0a0c0;
        }

        .luxbin {
          text-align: center;
        }

        .luxbin ul {
          list-style: none;
          display: inline-block;
          text-align: left;
          margin-top: 20px;
        }

        .luxbin li {
          padding: 10px 0;
          color: #c0c0e0;
        }

        .luxbin li::before {
          content: "✦ ";
          color: #00f5a0;
        }

        footer {
          text-align: center;
          padding: 60px 20px;
          border-top: 1px solid rgba(255,255,255,0.1);
          margin-top: 40px;
        }

        footer a {
          color: #00d9f5;
          text-decoration: none;
        }

        .footer-sub {
          color: #606080;
          margin-top: 10px;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.5rem;
          }
          .tagline {
            font-size: 1.1rem;
          }
          .stat-number {
            font-size: 2rem;
          }
        }
      `}</style>
    </>
  )
}
