'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Sparkles, Zap, Code2, Lock, Download, ExternalLink,
  ChevronRight, Cpu, Radio, Shield, Globe, ArrowRight,
  Check
} from 'lucide-react';

const API_URL = 'https://luxbin-saas-api.vercel.app';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'encode' | 'quantum'>('encode');
  const [demoResult, setDemoResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDemo = async () => {
    setLoading(true);
    try {
      if (activeTab === 'encode') {
        const response = await fetch(`${API_URL}/api/v1/encode`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'lux_demo_free_12345'
          },
          body: JSON.stringify({ text: 'QUANTUM', include_timing: true }),
        });
        const data = await response.json();
        setDemoResult(data);
      } else {
        const response = await fetch(`${API_URL}/api/v1/quantum/random`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': 'lux_demo_free_12345'
          },
          body: JSON.stringify({ count: 8, min_value: 0, max_value: 255 }),
        });
        const data = await response.json();
        setDemoResult(data);
      }
    } catch (err) {
      setDemoResult({ error: 'Demo unavailable' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover opacity-30 -z-10"
      >
        <source src="/grok-video.mp4" type="video/mp4" />
      </video>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-2.5 rounded bg-gradient-to-r from-violet-500 via-cyan-500 to-red-500" />
            <span className="text-xl font-bold text-white">LUXBIN</span>
            <span className="text-xs text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded">Quantum Internet</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#software" className="text-gray-400 hover:text-white transition text-sm">Software</Link>
            <Link href="#api" className="text-gray-400 hover:text-white transition text-sm">API</Link>
            <Link href="/docs" className="text-gray-400 hover:text-white transition text-sm">Docs</Link>
            <Link href="https://luxbin-quantum-academy.vercel.app" target="_blank" className="text-gray-400 hover:text-white transition text-sm">Academy</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-400 hover:text-white transition text-sm">Log in</Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/20 border border-violet-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-violet-300 text-sm">Quantum-Enhanced Technology</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="bg-gradient-to-r from-violet-400 via-cyan-400 to-red-400 bg-clip-text text-transparent"> Quantum Internet</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Download our quantum networking software suite or integrate quantum-enhanced APIs
            into your applications. True quantum random numbers, photonic encoding, and more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/nichechristie/Luxbin-Quantum-internet/archive/refs/heads/main.zip"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              <Download className="w-5 h-5" />
              Download Software Suite
            </a>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-90 transition"
            >
              <Code2 className="w-5 h-5" />
              Get Free API Key
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: '20+', label: 'Python Scripts' },
            { value: '445', label: 'IBM Qubits Online' },
            { value: '100%', label: 'Open Source' },
            { value: 'Free', label: 'API Tier' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-gray-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Software Suite Section */}
      <section id="software" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Quantum Software Suite</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Complete toolkit for quantum networking, photonic broadcasting, and AI-powered agents
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Radio, title: 'Photonic Broadcasting', desc: 'Stream audio, video, and images via light wavelengths' },
              { icon: Cpu, title: 'IBM Quantum Integration', desc: 'Direct connection to 445+ qubit quantum computers' },
              { icon: Globe, title: 'Global Entanglement', desc: 'Multi-node quantum network coordination' },
              { icon: Shield, title: 'Quantum Encryption', desc: 'Unhackable communication protocols' },
              { icon: Zap, title: 'AI Agents', desc: '4 specialized agents for autonomous operations' },
              { icon: Lock, title: 'Validator Bridge', desc: 'Secure blockchain validator integration' },
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition group">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <item.icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://github.com/nichechristie/Luxbin-Quantum-internet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition"
            >
              View on GitHub <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-20 px-6 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Developer API</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Integrate quantum-enhanced features into your applications with simple REST endpoints
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Live Demo */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => { setActiveTab('encode'); setDemoResult(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === 'encode'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Light Encoding
                </button>
                <button
                  onClick={() => { setActiveTab('quantum'); setDemoResult(null); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === 'quantum'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Quantum Random
                </button>
              </div>

              <div className="bg-black/30 rounded-xl p-4 mb-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
{activeTab === 'encode'
  ? `POST /api/v1/encode
{
  "text": "QUANTUM"
}`
  : `POST /api/v1/quantum/random
{
  "count": 8,
  "max_value": 255
}`}
                </pre>
              </div>

              <button
                onClick={runDemo}
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 mb-4"
              >
                {loading ? 'Running...' : 'Try it Live'}
              </button>

              {demoResult && (
                <div className="bg-black/30 rounded-xl p-4 overflow-x-auto max-h-64">
                  <pre className="text-xs text-emerald-400">
                    {JSON.stringify(demoResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* API Features */}
            <div className="space-y-6">
              {[
                {
                  title: 'Light Language Encoding',
                  desc: 'Convert text to photonic wavelengths (400-700nm) for light-based data transmission',
                  endpoint: '/api/v1/encode'
                },
                {
                  title: 'Quantum Random Numbers',
                  desc: 'True quantum randomness from IBM Quantum computers - perfect for crypto & gaming',
                  endpoint: '/api/v1/quantum/random'
                },
                {
                  title: 'Code Translation',
                  desc: 'AI-powered translation between 14 programming languages including Solidity',
                  endpoint: '/api/v1/translate'
                },
              ].map((api, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ChevronRight className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{api.title}</h3>
                    <p className="text-gray-500 text-sm mb-1">{api.desc}</p>
                    <code className="text-xs text-cyan-400">{api.endpoint}</code>
                  </div>
                </div>
              ))}

              <Link
                href="/docs"
                className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition mt-4"
              >
                View Full Documentation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-gray-400">Start free, upgrade when you need more</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '$0',
                desc: 'For testing & development',
                features: ['100 requests/day', 'Light encoding/decoding', 'Simulated quantum RNG', 'Community support'],
                cta: 'Get Started',
                href: '/signup',
                highlight: false
              },
              {
                name: 'Pro',
                price: '$29',
                desc: '/month',
                features: ['10,000 requests/day', 'Real IBM Quantum RNG', 'AI code translation', 'Priority support'],
                cta: 'Start Pro Trial',
                href: '/signup?plan=pro',
                highlight: true
              },
              {
                name: 'Enterprise',
                price: '$299',
                desc: '/month',
                features: ['Unlimited requests', 'Dedicated quantum access', 'Custom integrations', '24/7 support & SLA'],
                cta: 'Contact Sales',
                href: '/signup?plan=enterprise',
                highlight: false
              }
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-6 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-violet-600/20 to-cyan-600/20 border-2 border-violet-500/50'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.highlight && (
                  <div className="text-xs text-violet-400 font-medium mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-500">{plan.desc}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-400 text-sm">
                      <Check className="w-4 h-4 text-emerald-400" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`block text-center py-3 rounded-xl font-medium transition ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white hover:opacity-90'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academy Promo */}
      <section className="py-20 px-6 bg-gradient-to-r from-violet-600/20 to-cyan-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-4xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold text-white mb-4">LUXBIN Quantum Academy</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Master quantum computing with interactive experiments. Virtual lab, courses from basics to advanced,
            and blockchain-verified certificates.
          </p>
          <a
            href="https://luxbin-quantum-academy.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition"
          >
            Launch Quantum Academy <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-2 rounded bg-gradient-to-r from-violet-500 via-cyan-500 to-red-500" />
                <span className="text-lg font-bold text-white">LUXBIN</span>
              </div>
              <p className="text-gray-500 text-sm">
                Quantum-enhanced technology for the next generation of internet infrastructure.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="https://github.com/nichechristie/Luxbin-Quantum-internet/archive/refs/heads/main.zip" className="hover:text-white transition">Software Suite</a></li>
                <li><Link href="/docs" className="hover:text-white transition">API</Link></li>
                <li><a href="https://luxbin-quantum-academy.vercel.app" className="hover:text-white transition">Academy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/docs" className="hover:text-white transition">Documentation</Link></li>
                <li><a href="https://github.com/nichechristie/Luxbin-Quantum-internet" className="hover:text-white transition">GitHub</a></li>
                <li><a href="/info" className="hover:text-white transition">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><a href="https://twitter.com/luxbinquantum" className="hover:text-white transition">Twitter</a></li>
                <li><a href="https://github.com/nichechristie" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-600 text-sm">
            © 2025 LUXBIN. Built with quantum technology.
          </div>
        </div>
      </footer>
    </div>
  );
}
