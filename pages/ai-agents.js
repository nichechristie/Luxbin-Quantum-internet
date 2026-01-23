import Head from 'next/head'
import { useEffect } from 'react'
import { MultiAgentChat } from '../components/MultiAgentChat'

export default function AIAgents() {
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
        <title>AI Agents | Quantum Internet</title>
        <meta name="description" content="Interact with AI agents securing the quantum network" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="container" style={{position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '10px', margin: '20px'}}>
        <div id="google_translate_element" style={{ textAlign: 'center', marginBottom: '20px' }}></div>
        <section className="ai-agents">
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2.5rem', fontWeight: 700, color: '#000'}}>AI Agents Securing the Network</h2>
          <p className="section-subtitle" style={{fontFamily: 'Inter, sans-serif', fontSize: '1.1rem', color: '#333'}}>4 AI agents deployed to 4 countries simultaneously</p>
          <div style={{margin: '20px 0'}}>
            <a href="https://nicheai-nx5p.vercel.app" style={{fontFamily: 'Inter, sans-serif', color: '#007bff', textDecoration: 'none', fontSize: '1.2rem'}} target="_blank" rel="noopener noreferrer">Explore NicheAI App</a>
          </div>
          <div className="chat-cta">
            <span className="chat-pulse"></span>
            Chat with our AI agents - Click the avatars in the bottom right corner!
          </div>
          <div className="agent-grid">
            <div className="agent-card">
              <div className="agent-flag">USA</div>
              <h3>Aurora AI</h3>
              <p className="agent-role">Creative Security</p>
              <p className="agent-qubits">593 qubits protected</p>
            </div>
            {/* Add other agents as needed */}
          </div>
        </section>
        <MultiAgentChat />
      </main>
    </>
  )
}