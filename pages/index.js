import Head from 'next/head'
import { useEffect, useState, useRef } from 'react'

function BackgroundVideos() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const videoRef = useRef(null);

  const videos = [
    "/bg-video-1.mp4",
    "/bg-video-2.mp4",
    "/bg-video-3.mp4",
    "/bg-video-4.mp4",
    "/bg-video-5.mp4",
    "/bg-video-6.mp4"
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const playVideo = () => {
      video.play().catch(err => {
        const retry = () => {
          video.play().catch(() => {});
          document.removeEventListener('click', retry);
        };
        document.addEventListener('click', retry, { once: true });
      });
    };

    playVideo();

    const handleVisibilityChange = () => {
      if (!document.hidden) playVideo();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [currentVideo]);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  return (
    <div className="video-background">
      <video
        ref={videoRef}
        key={currentVideo}
        muted
        playsInline
        autoPlay
        loop={false}
        onEnded={handleVideoEnd}
      >
        <source src={videos[currentVideo]} type="video/mp4" />
      </video>
    </div>
  );
}

function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        size: Math.random() * 80 + 40,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: Math.random() * 20,
        duration: Math.random() * 10 + 15
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: particle.left,
            top: particle.top,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`
          }}
        />
      ))}
    </div>
  );
}

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
        <title>LUXBIN Quantum Internet | Educational Quantum Computing Toolkit</title>
        <meta name="description" content="A Python toolkit for exploring quantum internet concepts through IBM Quantum cloud computing and local simulation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundVideos />
      <div className="gradient-overlay" />
      <FloatingParticles />

      <main className="main-content">
        {/* Google Translate at Top */}
        <div id="google_translate_element" className="translate-bar"></div>

        {/* Header */}
        <header className="header">
          <div className="logo">
            <span className="logo-icon">⚛️</span>
            <span className="logo-text">LUXBIN Quantum Internet</span>
          </div>
          <a href="https://github.com/nichechristie/Luxbin-Quantum-internet" target="_blank" rel="noopener noreferrer" className="github-btn">
            View on GitHub
          </a>
        </header>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-badge">Educational Quantum Computing Toolkit</div>
          <h1 className="hero-title">LUXBIN Quantum Internet</h1>
          <p className="hero-subtitle">
            Exploring quantum internet concepts through IBM Quantum cloud computing and local simulation
          </p>

          {/* Transparency Notice */}
          <div className="transparency-notice">
            <span className="notice-icon">ℹ️</span>
            <span>This is an <strong>educational toolkit</strong>, not actual quantum networking infrastructure</span>
          </div>

          <div className="hero-buttons">
            <a href="https://github.com/nichechristie/Luxbin-Quantum-internet" className="btn btn-primary" target="_blank" rel="noopener noreferrer">
              ⭐ Star on GitHub
            </a>
            <a href="https://bsiegelwax.substack.com/p/luxbin-quantum-internet" className="btn btn-secondary" target="_blank" rel="noopener noreferrer">
              📰 Read Review
            </a>
          </div>
        </section>

        {/* What This Actually Is */}
        <section className="info-section">
          <h2>🔬 What This Project Actually Is</h2>
          <blockquote className="review-quote">
            "It's not what it says it is, but it's not nothing."
            <cite>— Brian Siegelwax, The Quantum Dragon</cite>
          </blockquote>

          <div className="features-grid">
            <div className="feature-card positive">
              <span className="feature-icon">⚛️</span>
              <h3>IBM Quantum Access</h3>
              <p>Submit real quantum circuits to IBM Quantum cloud computers via their public API</p>
            </div>
            <div className="feature-card positive">
              <span className="feature-icon">🔗</span>
              <h3>Entanglement Protocols</h3>
              <p>Educational implementations of Bell pairs, GHZ states, and teleportation</p>
            </div>
            <div className="feature-card positive">
              <span className="feature-icon">💎</span>
              <h3>NV-Center Simulation</h3>
              <p>Software simulation of diamond nitrogen-vacancy center physics</p>
            </div>
            <div className="feature-card positive">
              <span className="feature-icon">📚</span>
              <h3>Learning Resource</h3>
              <p>Study quantum internet concepts using today's available tools</p>
            </div>
          </div>
        </section>

        {/* What This Is NOT */}
        <section className="warning-section">
          <h2>⚠️ Transparency: What This Is NOT</h2>
          <div className="warning-grid">
            <div className="warning-card">
              <span className="warning-icon">❌</span>
              <h3>Not a Quantum Internet</h3>
              <p>Uses classical internet (HTTPS) to access cloud quantum APIs</p>
            </div>
            <div className="warning-card">
              <span className="warning-icon">❌</span>
              <h3>Not Quantum Hardware</h3>
              <p>No physical quantum channels or repeaters</p>
            </div>
            <div className="warning-card">
              <span className="warning-icon">❌</span>
              <h3>Not Persistent Entanglement</h3>
              <p>Entanglement is created per-circuit-execution</p>
            </div>
            <div className="warning-card">
              <span className="warning-icon">❌</span>
              <h3>NV-Centers are Simulated</h3>
              <p>Software models, not real hardware interfaces</p>
            </div>
          </div>
        </section>

        {/* How It Works Diagram */}
        <section className="diagram-section">
          <h2>🔧 How It Actually Works</h2>
          <div className="architecture-diagram">
            <div className="diagram-box client">
              <span className="box-icon">💻</span>
              <span className="box-title">LUXBIN Client</span>
              <span className="box-subtitle">Your Computer</span>
            </div>
            <div className="diagram-arrow">
              <span>Classical Internet</span>
              <span className="arrow">→ HTTPS →</span>
            </div>
            <div className="diagram-box cloud">
              <span className="box-icon">☁️</span>
              <span className="box-title">IBM Quantum API</span>
              <span className="box-subtitle">Cloud Service</span>
            </div>
          </div>
          <p className="diagram-note">
            <strong>This is a classical client</strong> that submits quantum circuits to cloud services over the regular internet.
          </p>
        </section>

        {/* EIP Protocols */}
        <section className="protocols-section">
          <h2>🔬 Entanglement Protocol Implementations (EIPs)</h2>
          <div className="protocols-grid">
            <div className="protocol-card">
              <div className="protocol-header">
                <span className="protocol-name">EIP-001</span>
                <span className="protocol-badge simulation">Simulation</span>
              </div>
              <h3>NV-Center Entanglement</h3>
              <p>Simulated diamond defect physics</p>
            </div>
            <div className="protocol-card">
              <div className="protocol-header">
                <span className="protocol-name">EIP-002</span>
                <span className="protocol-badge hardware">IBM Quantum</span>
              </div>
              <h3>Bell Pair Generation</h3>
              <p>Create entangled qubit pairs</p>
            </div>
            <div className="protocol-card">
              <div className="protocol-header">
                <span className="protocol-name">EIP-003</span>
                <span className="protocol-badge hardware">IBM Quantum</span>
              </div>
              <h3>GHZ State Generation</h3>
              <p>Multi-qubit entanglement</p>
            </div>
            <div className="protocol-card">
              <div className="protocol-header">
                <span className="protocol-name">EIP-004</span>
                <span className="protocol-badge hardware">IBM Quantum</span>
              </div>
              <h3>Quantum Teleportation</h3>
              <p>State transfer protocol</p>
            </div>
          </div>
        </section>

        {/* AI Agents */}
        <section className="agents-section">
          <h2>🤖 AI Agents</h2>
          <p className="section-subtitle">Four AI agents integrated for quantum operations</p>
          <div className="agents-grid">
            <div className="agent-card aurora">
              <span className="agent-flag">USA</span>
              <span className="agent-emoji">🌅</span>
              <h3>Aurora AI</h3>
              <p className="agent-role">Creative Security</p>
            </div>
            <div className="agent-card atlas">
              <span className="agent-flag">France</span>
              <span className="agent-emoji">🗺️</span>
              <h3>Atlas AI</h3>
              <p className="agent-role">Optimization</p>
            </div>
            <div className="agent-card ian">
              <span className="agent-flag">Finland</span>
              <span className="agent-emoji">📡</span>
              <h3>Ian AI</h3>
              <p className="agent-role">Communication</p>
            </div>
            <div className="agent-card morgan">
              <span className="agent-flag">Australia</span>
              <span className="agent-emoji">📊</span>
              <h3>Morgan AI</h3>
              <p className="agent-role">Analytics</p>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="quickstart-section">
          <h2>🏃 Quick Start</h2>
          <div className="code-block">
            <pre>{`# Clone the repository
git clone https://github.com/nichechristie/Luxbin-Quantum-internet.git
cd Luxbin-Quantum-internet

# Install dependencies
pip install -e ".[all]"

# Run on simulator (no IBM token needed)
python run_eip_on_quantum.py EIP-002 --simulator

# Run on real IBM Quantum hardware
python run_eip_on_quantum.py EIP-002`}</pre>
          </div>
        </section>

        {/* Why Quantum Internet Name */}
        <section className="why-section">
          <h2>❓ Why "Quantum Internet"?</h2>
          <p>
            The name reflects the project's <strong>aspirational goal</strong>: exploring and implementing
            the protocols that would be used in a future quantum internet.
          </p>
          <p>The actual quantum internet will require:</p>
          <ul className="requirements-list">
            <li>🔌 Physical quantum channels (fiber optics or free-space)</li>
            <li>📡 Quantum repeaters</li>
            <li>🔗 Persistent entanglement distribution</li>
            <li>💎 Specialized hardware (NV-centers, trapped ions, etc.)</li>
          </ul>
          <p>This project simulates and studies these concepts using today's available tools.</p>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>
              <a href="https://github.com/nichechristie/Luxbin-Quantum-internet" target="_blank" rel="noopener noreferrer">
                LUXBIN Quantum Internet
              </a>
              {' '}by{' '}
              <a href="https://github.com/nichechristie" target="_blank" rel="noopener noreferrer">
                Nichole Christie
              </a>
            </p>
            <p className="footer-tagline">Exploring quantum internet concepts through cloud computing and simulation</p>
          </div>
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
          background: #0a0a0f;
          color: #fff;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .video-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          z-index: 0;
        }

        .video-background video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.25;
        }

        .gradient-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 50%, rgba(10, 10, 15, 0.6) 100%);
          pointer-events: none;
          z-index: 1;
        }

        .particles-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(4px);
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .main-content {
          position: relative;
          z-index: 10;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .translate-bar {
          text-align: center;
          padding: 15px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          margin-bottom: 40px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: bold;
          background: linear-gradient(90deg, #a855f7, #00d9f5);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .github-btn {
          padding: 12px 24px;
          background: linear-gradient(90deg, #a855f7, #00d9f5);
          color: #000;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .github-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
        }

        .hero {
          text-align: center;
          padding: 60px 20px 80px;
        }

        .hero-badge {
          display: inline-block;
          background: linear-gradient(90deg, rgba(168, 85, 247, 0.3), rgba(0, 217, 245, 0.3));
          border: 1px solid rgba(168, 85, 247, 0.5);
          color: #fff;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: bold;
          background: linear-gradient(90deg, #a855f7, #00d9f5, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 20px;
          line-height: 1.1;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          color: #a0a0c0;
          max-width: 700px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }

        .transparency-notice {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.4);
          padding: 12px 24px;
          border-radius: 12px;
          margin-bottom: 30px;
          color: #fbbf24;
        }

        .notice-icon {
          font-size: 1.2rem;
        }

        .hero-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn {
          padding: 16px 32px;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .btn:hover {
          transform: translateY(-2px);
        }

        .btn-primary {
          background: linear-gradient(90deg, #a855f7, #00d9f5);
          color: #000;
        }

        .btn-primary:hover {
          box-shadow: 0 4px 20px rgba(168, 85, 247, 0.4);
        }

        .btn-secondary {
          background: transparent;
          border: 2px solid #00d9f5;
          color: #00d9f5;
        }

        .btn-secondary:hover {
          background: rgba(0, 217, 245, 0.1);
        }

        section {
          padding: 60px 0;
        }

        h2 {
          font-size: 2.2rem;
          text-align: center;
          margin-bottom: 40px;
          background: linear-gradient(90deg, #fff, #a0a0c0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .review-quote {
          background: rgba(168, 85, 247, 0.1);
          border-left: 4px solid #a855f7;
          padding: 20px 30px;
          margin: 0 auto 40px;
          max-width: 600px;
          border-radius: 0 12px 12px 0;
          font-style: italic;
          color: #c0c0e0;
        }

        .review-quote cite {
          display: block;
          margin-top: 10px;
          font-style: normal;
          color: #a855f7;
          font-size: 0.9rem;
        }

        .features-grid, .warning-grid, .protocols-grid, .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .feature-card, .warning-card, .protocol-card, .agent-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 28px;
          transition: transform 0.2s, border-color 0.2s;
        }

        .feature-card:hover, .protocol-card:hover, .agent-card:hover {
          transform: translateY(-5px);
          border-color: rgba(168, 85, 247, 0.5);
        }

        .feature-card.positive {
          border-color: rgba(0, 245, 160, 0.3);
        }

        .feature-card.positive:hover {
          border-color: rgba(0, 245, 160, 0.6);
        }

        .feature-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 16px;
        }

        .feature-card h3, .warning-card h3, .protocol-card h3, .agent-card h3 {
          color: #00d9f5;
          margin-bottom: 12px;
          font-size: 1.2rem;
        }

        .feature-card p, .warning-card p {
          color: #a0a0c0;
          line-height: 1.6;
        }

        .warning-section {
          background: rgba(239, 68, 68, 0.05);
          border-radius: 20px;
          padding: 60px 40px;
          margin: 40px 0;
        }

        .warning-card {
          border-color: rgba(239, 68, 68, 0.3);
          text-align: center;
        }

        .warning-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 12px;
        }

        .warning-card h3 {
          color: #ef4444;
        }

        .diagram-section {
          text-align: center;
        }

        .architecture-diagram {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
          margin: 40px 0;
        }

        .diagram-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(168, 85, 247, 0.4);
          border-radius: 16px;
          padding: 30px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .diagram-box.cloud {
          border-color: rgba(0, 217, 245, 0.4);
        }

        .box-icon {
          font-size: 2.5rem;
        }

        .box-title {
          font-weight: bold;
          color: #fff;
        }

        .box-subtitle {
          color: #a0a0c0;
          font-size: 0.9rem;
        }

        .diagram-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #00f5a0;
          font-size: 0.9rem;
        }

        .arrow {
          font-size: 1.5rem;
          letter-spacing: 4px;
        }

        .diagram-note {
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.1);
          padding: 16px 24px;
          border-radius: 12px;
          display: inline-block;
        }

        .protocol-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .protocol-name {
          font-weight: bold;
          color: #a855f7;
        }

        .protocol-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .protocol-badge.simulation {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }

        .protocol-badge.hardware {
          background: rgba(0, 245, 160, 0.2);
          color: #00f5a0;
        }

        .protocol-card p {
          color: #a0a0c0;
        }

        .agents-section {
          background: rgba(0, 245, 160, 0.05);
          border-radius: 20px;
          padding: 60px 40px;
        }

        .section-subtitle {
          text-align: center;
          color: #a0a0c0;
          margin-top: -20px;
          margin-bottom: 40px;
        }

        .agent-card {
          text-align: center;
          position: relative;
        }

        .agent-flag {
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 0.75rem;
          color: #00d9f5;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .agent-emoji {
          font-size: 3rem;
          display: block;
          margin-bottom: 16px;
        }

        .agent-role {
          color: #a0a0c0;
        }

        .quickstart-section {
          text-align: center;
        }

        .code-block {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 30px;
          overflow-x: auto;
          text-align: left;
        }

        .code-block pre {
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 0.9rem;
          color: #00f5a0;
          line-height: 1.8;
          white-space: pre-wrap;
        }

        .why-section {
          background: rgba(168, 85, 247, 0.05);
          border-radius: 20px;
          padding: 60px 40px;
          text-align: center;
        }

        .why-section p {
          color: #c0c0e0;
          max-width: 700px;
          margin: 0 auto 20px;
          line-height: 1.8;
        }

        .requirements-list {
          list-style: none;
          display: inline-block;
          text-align: left;
          margin: 20px 0;
        }

        .requirements-list li {
          padding: 10px 0;
          color: #c0c0e0;
        }

        .footer {
          text-align: center;
          padding: 60px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 60px;
        }

        .footer a {
          color: #00d9f5;
          text-decoration: none;
        }

        .footer a:hover {
          text-decoration: underline;
        }

        .footer-tagline {
          color: #606080;
          margin-top: 10px;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .header {
            flex-direction: column;
            gap: 20px;
          }

          .architecture-diagram {
            flex-direction: column;
          }

          .diagram-arrow {
            transform: rotate(90deg);
          }
        }
      `}</style>
    </>
  )
}
