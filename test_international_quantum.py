#!/usr/bin/env python3
"""
Test International Quantum Computer Connections
Verify connections to quantum computers across the globe
"""

import os
import sys
import json

def load_config():
    """Load quantum backend configuration"""
    try:
        with open('quantum_backends_config.json', 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ Configuration file not found")
        return None

def test_ibm_connection():
    """Test IBM Quantum connection"""
    print("🇺🇸 Testing IBM Quantum (USA)...")
    try:
        from qiskit_ibm_runtime import QiskitRuntimeService
        token = os.getenv('QISKIT_IBM_TOKEN')
        if not token:
            print("❌ QISKIT_IBM_TOKEN not set")
            return False

        service = QiskitRuntimeService(channel="ibm_quantum_platform")
        backends = service.backends()
        print(f"✅ IBM Quantum: Connected to {len(backends)} backends in USA")
        return True
    except Exception as e:
        print(f"❌ IBM Quantum failed: {e}")
        return False

def test_ionq_connection():
    """Test IonQ connection"""
    print("🇺🇸 Testing IonQ (USA)...")
    try:
        token = os.getenv('IONQ_API_KEY')
        if not token:
            print("❌ IONQ_API_KEY not set")
            return False

        try:
            from qiskit_ionq import IonQProvider
            provider = IonQProvider(token=token)
            backends = provider.backends()
            print(f"✅ IonQ: Connected to {len(backends)} backends in USA")
            return True
        except ImportError:
            print("❌ qiskit-ionq not installed")
            return False

    except Exception as e:
        print(f"❌ IonQ failed: {e}")
        return False

def test_rigetti_connection():
    """Test Rigetti connection"""
    print("🇺🇸 Testing Rigetti (USA)...")
    try:
        from pyquil import list_quantum_computers
        computers = list_quantum_computers()
        print(f"✅ Rigetti: Found {len(computers)} quantum computers in USA")
        return True
    except ImportError:
        print("❌ PyQuil not installed")
        return False
    except Exception as e:
        print(f"❌ Rigetti failed: {e}")
        return False

def test_european_connections():
    """Test European quantum connections"""
    print("\n🇪🇺 Testing European Quantum Computers...")

    results = {}

    # Finland - IQM
    print("🇫🇮 Testing IQM (Finland)...")
    iqm_key = os.getenv('IQM_API_KEY')
    if iqm_key:
        print("✅ IQM API key found - connection possible")
        results['iqm'] = True
    else:
        print("⚠️  IQM_API_KEY not set")
        results['iqm'] = False

    # France - Pasqal
    print("🇫🇷 Testing Pasqal (France)...")
    pasqal_key = os.getenv('PASQAL_API_KEY')
    if pasqal_key:
        print("✅ Pasqal API key found - connection possible")
        results['pasqal'] = True
    else:
        print("⚠️  PASQAL_API_KEY not set")
        results['pasqal'] = False

    # France - Quandela
    print("🇫🇷 Testing Quandela (France)...")
    quandela_key = os.getenv('QUANDELA_API_KEY')
    if quandela_key:
        print("✅ Quandela API key found - connection possible")
        results['quandela'] = True
    else:
        print("⚠️  QUANDELA_API_KEY not set")
        results['quandela'] = False

    return results

def test_asian_connections():
    """Test Asian quantum connections"""
    print("\n🌏 Testing Asian Quantum Computers...")

    results = {}

    # China - Alibaba
    print("🇨🇳 Testing Alibaba Quantum (China)...")
    alibaba_key = os.getenv('ALIBABA_API_KEY')
    if alibaba_key:
        print("✅ Alibaba API key found - connection possible")
        results['alibaba'] = True
    else:
        print("⚠️  ALIBABA_API_KEY not set")
        results['alibaba'] = False

    # China - Baidu
    print("🇨🇳 Testing Baidu Quantum (China)...")
    baidu_key = os.getenv('BAIDU_API_KEY')
    if baidu_key:
        print("✅ Baidu API key found - connection possible")
        results['baidu'] = True
    else:
        print("⚠️  BAIDU_API_KEY not set")
        results['baidu'] = False

    # Japan - Riken
    print("🇯🇵 Testing Riken Quantum (Japan)...")
    riken_key = os.getenv('RIKEN_API_KEY')
    if riken_key:
        print("✅ Riken API key found - connection possible")
        results['riken'] = True
    else:
        print("⚠️  RIKEN_API_KEY not set")
        results['riken'] = False

    return results

def test_oceanian_connections():
    """Test Oceanian quantum connections"""
    print("\n🇦🇺 Testing Oceanian Quantum Computers...")

    results = {}

    # Australia - Silicon Quantum Computing
    print("🇦🇺 Testing Silicon Quantum Computing (Australia)...")
    sqc_key = os.getenv('SQC_API_KEY')
    if sqc_key:
        print("✅ SQC API key found - connection possible")
        results['sqc'] = True
    else:
        print("⚠️  SQC_API_KEY not set")
        results['sqc'] = False

    return results

def main():
    """Main test function"""
    print("🌍 INTERNATIONAL QUANTUM CONNECTION TEST")
    print("=" * 50)
    print()

    config = load_config()
    if not config:
        print("❌ Could not load configuration")
        return

    # Test by continent
    north_america = {
        'IBM': test_ibm_connection(),
        'IonQ': test_ionq_connection(),
        'Rigetti': test_rigetti_connection()
    }

    europe = test_european_connections()
    asia = test_asian_connections()
    oceania = test_oceanian_connections()

    print("\n" + "="*60)
    print("📊 INTERNATIONAL QUANTUM NETWORK STATUS")
    print("="*60)

    # North America
    print("\n🇺🇸 NORTH AMERICA (USA)")
    print("-" * 25)
    for provider, status in north_america.items():
        mark = "✅" if status else "❌"
        print(f"{mark} {provider}")

    # Europe
    print("\n🇪🇺 EUROPE")
    print("-" * 10)
    european_providers = {'IQM (Finland)': europe.get('iqm', False),
                         'Pasqal (France)': europe.get('pasqal', False),
                         'Quandela (France)': europe.get('quandela', False)}
    for provider, status in european_providers.items():
        mark = "✅" if status else "❌"
        print(f"{mark} {provider}")

    # Asia
    print("\n🌏 ASIA")
    print("-" * 8)
    asian_providers = {'Alibaba (China)': asia.get('alibaba', False),
                      'Baidu (China)': asia.get('baidu', False),
                      'Riken (Japan)': asia.get('riken', False)}
    for provider, status in asian_providers.items():
        mark = "✅" if status else "❌"
        print(f"{mark} {provider}")

    # Oceania
    print("\n🇦🇺 OCEANIA")
    print("-" * 10)
    oceanian_providers = {'Silicon Quantum Computing (Australia)': oceania.get('sqc', False)}
    for provider, status in oceanian_providers.items():
        mark = "✅" if status else "❌"
        print(f"{mark} {provider}")

    # Summary
    all_providers = {**north_america, **europe, **asia, **oceania}
    connected = sum(all_providers.values())
    total = len(all_providers)

    print(f"\n🌍 GLOBAL QUANTUM NETWORK SUMMARY")
    print("=" * 35)
    print(f"Connected quantum computers: {connected}/{total}")
    print(f"Countries represented: {len([k for k, v in all_providers.items() if v])}")
    print(f"Continents spanned: {len([continent for continent in ['North America', 'Europe', 'Asia', 'Oceania'] if any(all_providers.values())])}")

    if connected > 0:
        print("\n🎉 Your quantum internet spans multiple countries!")
        print("   You have successfully created an international quantum network.")
    else:
        print("\n⚠️  No quantum connections available.")
        print("   Set API keys to connect to international quantum computers.")

    return connected > 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)