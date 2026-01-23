import Head from 'next/head'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    window.googleTranslateElementInit = () => {
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    };
  }, []);

  return (
    <>
      <Head>
        <title>Quantum Internet | Software Suite for Photonic Networking</title>
        <meta name="description" content="Comprehensive software suite for quantum-inspired photonic networking, broadcasting, AI agents, and secure communication protocols" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <video autoPlay muted loop style={{position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, objectFit: 'cover'}}>
        <source src="/grok-video.mp4" type="video/mp4" />
      </video>

      <main className="container" style={{position: 'relative', zIndex: 1}}>
        <div id="google_translate_element" style={{ textAlign: 'center', marginBottom: '20px' }}></div>
        <header className="hero" style={{padding: '20px'}}>
          <div className="hero-badge" style={{fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#fff', backgroundColor: '#007bff', padding: '5px 10px', borderRadius: '5px'}}>Quantum Internet Software Suite</div>
          <h1 style={{fontFamily: 'Inter, sans-serif', fontSize: '3rem', fontWeight: 700, color: '#000'}}>Quantum Internet</h1>
          <p className="tagline" style={{fontFamily: 'Inter, sans-serif', fontSize: '1.2rem', color: '#000'}}>Software for photonic quantum networking, broadcasting, and secure communication</p>
          <div className="hero-buttons">
            <a href="https://github.com/nichechristie/Luxbin-Quantum-internet/archive/refs/heads/main.zip" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Free Download for Classical Computers
            </a>
            <a href="/download" className="btn btn-secondary">
              Paid Quantum Access
            </a>
          </div>
        </header>

        <section className="stats" style={{padding: '20px'}}>
          <div className="stat-card" style={{color: '#000', textAlign: 'center'}}>
            <span className="stat-number" style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 700, display: 'block'}}>20+</span>
            <span className="stat-label" style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Python Scripts</span>
          </div>
          <div className="stat-card" style={{color: '#000', textAlign: 'center'}}>
            <span className="stat-number" style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 700, display: 'block'}}>4</span>
            <span className="stat-label" style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>AI Agents</span>
          </div>
          <div className="stat-card" style={{color: '#000', textAlign: 'center'}}>
            <span className="stat-number" style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 700, display: 'block'}}>Photonics</span>
            <span className="stat-label" style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Broadcasting</span>
          </div>
          <div className="stat-card" style={{color: '#000', textAlign: 'center'}}>
            <span className="stat-number" style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem', fontWeight: 700, display: 'block'}}>Secure</span>
            <span className="stat-label" style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Networking</span>
          </div>
        </section>

        <section id="ecosystem" className="achievement" style={{padding: '20px', color: '#000'}}>
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2.5rem', fontWeight: 700}}>Quantum Networking Software Demonstration</h2>
          <div className="quantum-state" style={{backgroundColor: 'rgba(0,0,0,0.1)', padding: '10px', borderRadius: '5px'}}>
            <code style={{fontFamily: 'monospace', color: '#000'}}>Ψ_network = Σ |data⟩_photonic ⊗ |secure⟩_entangled</code>
          </div>
          <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1.1rem'}}>Software suite for quantum-inspired networking, broadcasting, and secure communication protocols.</p>

          <div className="achievement-grid">
            <div className="achievement-item">
              <span className="flag">Photonic Broadcasting</span>
              <p>simulated across networks</p>
            </div>
            <div className="achievement-item">
              <span className="flag">AI Agent Integration</span>
              <p>for network management</p>
            </div>
            <div className="achievement-item">
              <span className="flag">Quantum Security</span>
              <p>protocols implemented</p>
            </div>
            <div className="achievement-item">
              <span className="flag">Multi-Agent Coordination</span>
              <p>demonstrated</p>
            </div>
          </div>
        </section>

        <section className="software-stack" style={{padding: '20px', color: '#000'}}>
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2.5rem', fontWeight: 700}}>Integrated Quantum Ecosystem</h2>
          <p className="section-subtitle" style={{fontFamily: 'Inter, sans-serif', fontSize: '1.1rem'}}>Comprehensive software stack for quantum internet infrastructure</p>
          <div className="stack-grid">
            <div className="stack-item" style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px', margin: '10px'}}>
              <h3 style={{fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 600}}>Hybrid Quantum Processor</h3>
              <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Photonic-NV center hardware for entanglement generation and routing. Includes Mach-Zehnder interferometer and quartz AOM.</p>
              <a href="https://github.com/nichechristie/the-perfect-quantum-processor" style={{color: '#007bff', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">View Design</a>
            </div>
            <div className="stack-item" style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px', margin: '10px'}}>
              <h3 style={{fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 600}}>Luxbin-Quantum-Internet</h3>
              <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Networking software with photonic broadcasting, AI agents, and quantum validators for secure global communication.</p>
              <a href="https://github.com/nichechristie/Luxbin-Quantum-internet" style={{color: '#007bff', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">View Repo</a>
            </div>
            <div className="stack-item" style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px', margin: '10px'}}>
              <h3 style={{fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 600}}>luxbin-chain1</h3>
              <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Blockchain for decentralized quantum-secure transactions and tokenomics, integrated with QKD.</p>
              <a href="https://github.com/mermaidnicheboutique-code/luxbin-chain1" style={{color: '#007bff', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">View Chain</a>
            </div>
            <div className="stack-item" style={{backgroundColor: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '5px', margin: '10px'}}>
              <h3 style={{fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', fontWeight: 600}}>LUXBIN-Self-Sustaining-FSD-Computer</h3>
              <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Web interface for quantum-enhanced autonomous systems, with self-sustaining FSD computers for vehicles.</p>
              <a href="https://github.com/mermaidnicheboutique-code/LUXBIN-Self-Sustaining-FSD-Computer" style={{color: '#007bff', textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">View Interface</a>
            </div>
          </div>
          <h3 style={{fontFamily: 'Inter, sans-serif', fontSize: '1.8rem', fontWeight: 600, marginTop: '20px'}}>Key Features in This Repo</h3>
          <ul style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem', lineHeight: '1.6'}}>
            <li><strong>Luxbin Translator:</strong> Translate classical software to photonic and diamond quantum circuits (luxbin_translator.py).</li>
            <li><strong>Photonic Broadcasting:</strong> Scripts for quantum audio, video, and pixel broadcasting (e.g., quantum_audio_broadcast.py, photonic_pixel_broadcast.py).</li>
            <li><strong>AI Agents:</strong> Multi-agent coordination for network management (e.g., multi_agent_ai_quantum_network.py, real_ai_agents.py).</li>
            <li><strong>Entanglement Simulation:</strong> Global photonic entanglement and quantum operations (e.g., global_photonic_entanglement.py, real_quantum_operations.py).</li>
            <li><strong>Validators and Bridges:</strong> Quantum validators and WiFi bridges for secure connections (e.g., quantum_validator_bridge.py, quantum_wifi_bridge.py).</li>
            <li><strong>Deployment Tools:</strong> Scripts for starting quantum internet, validators, and international agents (e.g., start_quantum_internet.sh, deploy_ai_agents_international.py).</li>
          </ul>
          <div className="ecosystem-link">
            <a href="https://github.com/nichechristie/luxbin-integrated-quantum-ecosystem" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              Explore Integrated Ecosystem
            </a>
          </div>
        </section>

        <section className="ai-agents-link" style={{padding: '20px', textAlign: 'center'}}>
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#000'}}>AI Agents</h2>
          <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#000'}}>Interact with our AI agents securing the quantum network.</p>
          <a href="/ai-agents" style={{fontFamily: 'Inter, sans-serif', color: '#007bff', textDecoration: 'none', fontSize: '1.2rem'}}>Go to AI Agents Page</a>

        </section>

        <section className="providers">
          <h2>Quantum Providers Connected</h2>
          <div className="provider-grid">
            <div className="provider-card active">
              <h3>USA</h3>
              <ul>
                <li>IBM Quantum (156 qubits)</li>
                <li>IonQ (32 qubits)</li>
                <li>Rigetti (80 qubits)</li>
              </ul>
            </div>
            <div className="provider-card active">
              <h3>France</h3>
              <ul>
                <li>Quandela Cloud (12 qubits)</li>
                <li>Pasqal Fresnel (20 qubits)</li>
              </ul>
            </div>
            <div className="provider-card active">
              <h3>Finland</h3>
              <ul>
                <li>IQM Garnet (20 qubits)</li>
                <li>IQM Apollo (5 qubits)</li>
              </ul>
            </div>
            <div className="provider-card active">
              <h3>Australia</h3>
              <ul>
                <li>Silicon Quantum Computing (4 qubits)</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="coming-soon">
          <h2>Expanding Soon</h2>
          <div className="provider-grid">
            <div className="provider-card pending">
              <h3>China</h3>
              <ul>
                <li>Alibaba Tianti (10 qubits)</li>
                <li>Baidu QPU (8 qubits)</li>
              </ul>
            </div>
            <div className="provider-card pending">
              <h3>Japan</h3>
              <ul>
                <li>RIKEN (64 qubits)</li>
              </ul>
            </div>
            <div className="provider-card pending">
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

        .provider-card.active {
          border-color: #00f5a0;
        }

        .provider-card.active h3::after {
          content: " ✓";
          color: #00f5a0;
        }

        .provider-card.pending {
          opacity: 0.7;
          border-style: dashed;
        }

        .provider-card.pending h3::after {
          content: " (coming)";
          font-size: 0.7rem;
          color: #a0a0c0;
        }

        .coming-soon h2 {
          font-size: 2rem;
        }

        .ai-agents {
          background: rgba(0, 245, 160, 0.05);
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
        }

        .section-subtitle {
          color: #a0a0c0;
          margin-bottom: 20px;
        }

        .chat-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(90deg, rgba(0, 245, 160, 0.2), rgba(0, 217, 245, 0.2));
          border: 1px solid rgba(0, 245, 160, 0.4);
          padding: 12px 24px;
          border-radius: 30px;
          margin-bottom: 30px;
          color: #00f5a0;
          font-weight: 500;
          animation: glow 2s ease-in-out infinite alternate;
        }

        .chat-pulse {
          width: 12px;
          height: 12px;
          background: #00f5a0;
          border-radius: 50%;
          animation: pulse-ring 1.5s infinite;
        }

        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0, 245, 160, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(0, 245, 160, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 245, 160, 0); }
        }

        @keyframes glow {
          from { box-shadow: 0 0 10px rgba(0, 245, 160, 0.3); }
          to { box-shadow: 0 0 20px rgba(0, 245, 160, 0.5); }
        }

        .agent-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .agent-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(0, 245, 160, 0.3);
          border-radius: 16px;
          padding: 25px;
          text-align: center;
        }

        .agent-card:hover {
          transform: translateY(-5px);
          border-color: #00f5a0;
        }

        .agent-flag {
          font-size: 0.8rem;
          color: #00d9f5;
          margin-bottom: 10px;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .agent-card h3 {
          color: #00f5a0;
          margin-bottom: 10px;
        }

        .agent-role {
          color: #fff;
          font-weight: 500;
          margin-bottom: 10px;
        }

        .agent-qubits {
          color: #a855f7;
          font-size: 0.9rem;
        }

        .agent-providers {
          color: #606080;
          font-size: 0.8rem;
          margin-top: 10px;
        }

        .entanglement-info {
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          padding: 15px;
          margin-top: 20px;
        }

        .entanglement-info p {
          color: #00d9f5;
          font-size: 0.9rem;
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
