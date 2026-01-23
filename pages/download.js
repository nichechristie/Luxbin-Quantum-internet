import Head from 'next/head'
import { useState } from 'react'

export default function Download() {
  const [paymentMethod, setPaymentMethod] = useState('')

  const handlePayment = () => {
    if (paymentMethod === 'crypto') {
      // Integrate with luxbin-chain1 for crypto payment
      alert('Redirecting to Luxbin-Chain payment gateway...')
      window.location.href = 'https://github.com/mermaidnicheboutique-code/luxbin-chain1'
    } else if (paymentMethod === 'fiat') {
      alert('Fiat payment coming soon!')
    }
  }

  return (
    <>
      <Head>
        <title>Download Luxbin Quantum Software</title>
        <meta name="description" content="Purchase and download the Luxbin Quantum Internet software suite with quantum computer support" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <main className="container" style={{position: 'relative', zIndex: 1, backgroundColor: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '10px', margin: '20px', color: '#000'}}>
        <h1 style={{fontFamily: 'Inter, sans-serif', fontSize: '3rem', fontWeight: 700}}>Download Luxbin Quantum Software</h1>
        <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1.2rem'}}>Get the full suite with Luxbin Translator for photonic and diamond quantum computers.</p>

        <section style={{margin: '20px 0'}}>
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem'}}>Features</h2>
          <ul style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>
            <li>20+ Python scripts for quantum networking</li>
            <li>Luxbin Translator for direct quantum execution</li>
            <li>AI agents and photonic broadcasting</li>
            <li>Secure validators and blockchain integration</li>
          </ul>
        </section>

        <section style={{margin: '20px 0'}}>
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem'}}>Pricing</h2>
          <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>$99 for full access (one-time payment)</p>

          <div style={{margin: '20px 0'}}>
            <label style={{fontFamily: 'Inter, sans-serif'}}>
              <input type="radio" value="crypto" checked={paymentMethod === 'crypto'} onChange={(e) => setPaymentMethod(e.target.value)} />
              Pay with Crypto (Luxbin-Chain)
            </label>
            <br />
            <label style={{fontFamily: 'Inter, sans-serif'}}>
              <input type="radio" value="fiat" checked={paymentMethod === 'fiat'} onChange={(e) => setPaymentMethod(e.target.value)} />
              Pay with Fiat (Coming Soon)
            </label>
          </div>

          <button onClick={handlePayment} style={{fontFamily: 'Inter, sans-serif', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
            Proceed to Payment
          </button>
        </section>

        <section style={{margin: '20px 0'}}>
          <h2 style={{fontFamily: 'Inter, sans-serif', fontSize: '2rem'}}>Free Trial</h2>
          <p style={{fontFamily: 'Inter, sans-serif', fontSize: '1rem'}}>Access basic scripts for free on GitHub.</p>
          <a href="https://github.com/nichechristie/Luxbin-Quantum-internet" style={{fontFamily: 'Inter, sans-serif', color: '#007bff', textDecoration: 'none'}}>View on GitHub</a>
        </section>
      </main>
    </>
  )
}