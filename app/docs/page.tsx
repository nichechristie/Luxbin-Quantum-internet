'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronRight } from 'lucide-react';

const API_URL = 'https://luxbin-saas-api.vercel.app';

interface EndpointProps {
  method: string;
  path: string;
  description: string;
  requestBody?: object;
  responseBody?: object;
  headers?: { name: string; value: string; required: boolean }[];
}

function CodeBlock({ code, language = 'bash' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-black/50 border border-white/10 rounded-xl p-4 overflow-x-auto text-sm text-gray-300">
        <code>{code}</code>
      </pre>
      <button
        onClick={copy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-white/10 p-2 rounded-lg hover:bg-white/20"
      >
        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-gray-400" />}
      </button>
    </div>
  );
}

function Endpoint({ method, path, description, requestBody, responseBody, headers }: EndpointProps) {
  const [open, setOpen] = useState(false);

  const methodColors: Record<string, string> = {
    GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    POST: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition text-left"
      >
        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-white font-mono">{path}</code>
        <span className="text-gray-500 text-sm flex-1">{description}</span>
        {open ? <ChevronDown className="w-5 h-5 text-gray-500" /> : <ChevronRight className="w-5 h-5 text-gray-500" />}
      </button>

      {open && (
        <div className="border-t border-white/10 p-4 space-y-4 bg-white/5">
          {headers && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Headers</h4>
              <div className="space-y-1">
                {headers.map((h) => (
                  <div key={h.name} className="flex items-center gap-2 text-sm">
                    <code className="text-cyan-400">{h.name}</code>
                    <span className="text-gray-500">:</span>
                    <code className="text-gray-400">{h.value}</code>
                    {h.required && <span className="text-red-400 text-xs">(required)</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {requestBody && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Request Body</h4>
              <CodeBlock code={JSON.stringify(requestBody, null, 2)} language="json" />
            </div>
          )}

          {responseBody && (
            <div>
              <h4 className="text-sm font-semibold text-white mb-2">Response</h4>
              <CodeBlock code={JSON.stringify(responseBody, null, 2)} language="json" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Docs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-2 rounded bg-gradient-to-r from-violet-500 via-cyan-500 to-red-500" />
            <span className="text-xl font-bold text-white">LUXBIN</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-gray-400 hover:text-white transition">
              Dashboard
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
            >
              Get API Key
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">API Documentation</h1>
        <p className="text-gray-400 text-lg mb-8">
          Integrate quantum-enhanced features into your applications with our REST API.
        </p>

        {/* Base URL */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-2">Base URL</h2>
          <code className="text-cyan-400 text-lg">{API_URL}</code>
        </div>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication</h2>
          <p className="text-gray-400 mb-4">
            All API requests require an API key passed in the <code className="text-cyan-400">X-API-Key</code> header.
          </p>
          <CodeBlock
            code={`curl -X POST ${API_URL}/api/v1/encode \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "Hello World"}'`}
          />
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Rate Limits</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tier: 'Free', limit: '100 requests/day', color: 'border-gray-500/30' },
              { tier: 'Pro', limit: '10,000 requests/day', color: 'border-violet-500/30' },
              { tier: 'Enterprise', limit: 'Unlimited', color: 'border-cyan-500/30' },
            ].map((plan) => (
              <div key={plan.tier} className={`border ${plan.color} rounded-xl p-4 bg-white/5`}>
                <div className="text-white font-semibold">{plan.tier}</div>
                <div className="text-gray-400 text-sm">{plan.limit}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Endpoints</h2>
          <div className="space-y-4">
            <Endpoint
              method="POST"
              path="/api/v1/encode"
              description="Encode text to Light Language"
              headers={[
                { name: 'X-API-Key', value: 'your_api_key', required: true },
                { name: 'Content-Type', value: 'application/json', required: true },
              ]}
              requestBody={{
                text: 'HELLO WORLD',
                include_timing: true,
                format: 'json',
              }}
              responseBody={{
                original_text: 'HELLO WORLD',
                light_sequence: [
                  { character: 'H', wavelength_nm: 432.47, color: 'violet', hex: '#5500ff' },
                  { character: 'E', wavelength_nm: 419.48, color: 'violet', hex: '#7700ff' },
                ],
                total_duration_ms: 1200,
                wavelength_range: { min_nm: 400, max_nm: 550 },
              }}
            />

            <Endpoint
              method="POST"
              path="/api/v1/decode"
              description="Decode Light Language back to text"
              headers={[
                { name: 'X-API-Key', value: 'your_api_key', required: true },
                { name: 'Content-Type', value: 'application/json', required: true },
              ]}
              requestBody={{
                wavelengths: [432.47, 419.48, 449.35, 449.35, 453.25],
              }}
              responseBody={{
                decoded_text: 'HELLO',
                confidence: 0.98,
              }}
            />

            <Endpoint
              method="POST"
              path="/api/v1/quantum/random"
              description="Generate quantum random numbers"
              headers={[
                { name: 'X-API-Key', value: 'your_api_key', required: true },
                { name: 'Content-Type', value: 'application/json', required: true },
              ]}
              requestBody={{
                count: 10,
                min_value: 0,
                max_value: 255,
                format: 'integers',
              }}
              responseBody={{
                values: [42, 187, 63, 201, 15, 89, 244, 112, 33, 178],
                source: 'ibm_quantum',
                backend: 'ibm_fez',
                timestamp: '2024-01-15T12:00:00Z',
              }}
            />

            <Endpoint
              method="POST"
              path="/api/v1/translate"
              description="Translate code between languages"
              headers={[
                { name: 'X-API-Key', value: 'your_api_key', required: true },
                { name: 'Content-Type', value: 'application/json', required: true },
              ]}
              requestBody={{
                code: 'def hello():\n    print("Hello World")',
                source_language: 'python',
                target_language: 'rust',
                preserve_comments: true,
              }}
              responseBody={{
                translated_code: 'fn hello() {\n    println!("Hello World");\n}',
                source_language: 'python',
                target_language: 'rust',
                tokens_used: 150,
              }}
            />

            <Endpoint
              method="POST"
              path="/api/v1/keys/generate"
              description="Generate a new API key"
              headers={[
                { name: 'Content-Type', value: 'application/json', required: true },
              ]}
              requestBody={{
                tier: 'free',
              }}
              responseBody={{
                api_key: 'lux_free_a1b2c3d4e5f6...',
                tier: 'free',
                rate_limit: { requests_per_day: 100 },
              }}
            />

            <Endpoint
              method="GET"
              path="/api/v1/keys/info"
              description="Get API key usage info"
              headers={[
                { name: 'X-API-Key', value: 'your_api_key', required: true },
              ]}
              responseBody={{
                api_key: 'lux_free_...1234',
                tier: 'free',
                requests_today: 42,
                requests_remaining: 58,
              }}
            />
          </div>
        </section>

        {/* SDKs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Code Examples</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">JavaScript / TypeScript</h3>
              <CodeBlock
                code={`const response = await fetch('${API_URL}/api/v1/encode', {
  method: 'POST',
  headers: {
    'X-API-Key': 'YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ text: 'Hello World' }),
});

const data = await response.json();
console.log(data.light_sequence);`}
                language="javascript"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Python</h3>
              <CodeBlock
                code={`import requests

response = requests.post(
    '${API_URL}/api/v1/quantum/random',
    headers={'X-API-Key': 'YOUR_API_KEY'},
    json={'count': 10, 'max_value': 100}
)

print(response.json()['values'])`}
                language="python"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">cURL</h3>
              <CodeBlock
                code={`curl -X POST ${API_URL}/api/v1/encode \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"text": "LUXBIN"}'`}
              />
            </div>
          </div>
        </section>

        {/* Errors */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Error Codes</h2>
          <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Code</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[
                  { code: 400, desc: 'Bad Request - Invalid parameters' },
                  { code: 401, desc: 'Unauthorized - Invalid or missing API key' },
                  { code: 429, desc: 'Too Many Requests - Rate limit exceeded' },
                  { code: 500, desc: 'Internal Server Error' },
                  { code: 503, desc: 'Service Unavailable - External service down' },
                ].map((e) => (
                  <tr key={e.code}>
                    <td className="p-4 text-red-400 font-mono">{e.code}</td>
                    <td className="p-4 text-gray-300">{e.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-gray-500 text-sm">
          LUXBIN API v1.0 - Built with quantum technology
        </div>
      </footer>
    </div>
  );
}
