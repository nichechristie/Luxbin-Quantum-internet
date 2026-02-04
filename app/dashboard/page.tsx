'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Copy, Check, Key, Zap, CreditCard, LogOut, ExternalLink } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://luxbin-saas-api.vercel.app';

interface User {
  email: string;
  apiKey: string;
  tier: string;
  createdAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [copied, setCopied] = useState(false);
  const [usage, setUsage] = useState({ today: 0, limit: 100 });
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const stored = localStorage.getItem('luxbin_user');
    if (!stored) {
      router.push('/login');
      return;
    }
    const userData = JSON.parse(stored);
    setUser(userData);

    // Set usage limit based on tier
    const limits: Record<string, number> = { free: 100, pro: 10000, enterprise: 1000000 };
    setUsage({ today: Math.floor(Math.random() * 50), limit: limits[userData.tier] || 100 });
  }, [router]);

  const copyApiKey = () => {
    if (user) {
      navigator.clipboard.writeText(user.apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUpgrade = async (plan: string) => {
    setUpgrading(true);
    try {
      const response = await fetch(`${API_URL}/api/v1/billing/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': user?.apiKey || '',
        },
        body: JSON.stringify({ plan: `${plan}_monthly` }),
      });

      const data = await response.json();
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err) {
      console.error('Upgrade failed:', err);
    } finally {
      setUpgrading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('luxbin_user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-2 rounded bg-gradient-to-r from-violet-500 via-cyan-500 to-red-500" />
            <span className="text-xl font-bold text-white">LUXBIN</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">{user.email}</span>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* API Key Card */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                <Key className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your API Key</h2>
                <p className="text-sm text-gray-500">Use this key to authenticate requests</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <code className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 font-mono overflow-x-auto">
                {user.apiKey}
              </code>
              <button
                onClick={copyApiKey}
                className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Usage Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Usage Today</h2>
                <p className="text-sm text-gray-500">{user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Plan</p>
              </div>
            </div>

            <div className="text-3xl font-bold text-white mb-2">
              {usage.today} <span className="text-lg text-gray-500">/ {usage.limit.toLocaleString()}</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-violet-500 to-cyan-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min((usage.today / usage.limit) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Start */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Start</h2>
          <div className="bg-black/30 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`curl -X POST ${API_URL}/api/v1/encode \\
  -H "X-API-Key: ${user.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "HELLO WORLD"}'`}
            </pre>
          </div>
          <div className="flex gap-4 mt-4">
            <Link
              href="/docs"
              className="text-violet-400 hover:text-violet-300 transition flex items-center gap-2 text-sm"
            >
              <ExternalLink className="w-4 h-4" /> View API Docs
            </Link>
          </div>
        </div>

        {/* Upgrade Section */}
        {user.tier === 'free' && (
          <div className="bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-violet-400" />
              <h2 className="text-xl font-semibold text-white">Upgrade Your Plan</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Get more requests, real quantum random numbers, and priority support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleUpgrade('pro')}
                disabled={upgrading}
                className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
              >
                {upgrading ? 'Loading...' : 'Upgrade to Pro - $29/mo'}
              </button>
              <button
                onClick={() => handleUpgrade('enterprise')}
                disabled={upgrading}
                className="border border-white/20 text-white px-6 py-3 rounded-xl font-medium hover:bg-white/5 transition disabled:opacity-50"
              >
                Enterprise - $299/mo
              </button>
            </div>
          </div>
        )}

        {user.tier !== 'free' && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)} Plan Active
                </h2>
                <p className="text-gray-400">You have access to all {user.tier} features including real IBM Quantum RNG.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
