#!/usr/bin/env python3
"""
Setup Quantum Computing API Keys
Interactive script to help you get and set API keys for quantum providers
"""

import os
import sys

def setup_ibm_quantum():
    """Guide user through IBM Quantum setup"""
    print("\n" + "="*60)
    print("🔬 IBM QUANTUM SETUP")
    print("="*60)
    print()
    print("IBM Quantum provides access to real quantum computers.")
    print("They offer a free tier with limited usage.")
    print()
    print("Steps:")
    print("1. Go to: https://quantum.ibm.com/")
    print("2. Sign up for a free account")
    print("3. Go to: https://quantum.ibm.com/account")
    print("4. Copy your API token")
    print()

    token = input("Enter your IBM Quantum API token (or press Enter to skip): ").strip()

    if token:
        # Save to environment
        os.environ['QISKIT_IBM_TOKEN'] = token
        print("✅ IBM Quantum token set!")

        # Test connection
        try:
            from qiskit_ibm_runtime import QiskitRuntimeService
            service = QiskitRuntimeService(channel="ibm_quantum_platform")
            backends = service.backends()
            print(f"✅ Connection successful! Found {len(backends)} quantum backends.")
        except Exception as e:
            print(f"❌ Connection test failed: {e}")
    else:
        print("⚠️  Skipping IBM Quantum setup")

    return bool(token)

def setup_ionq():
    """Guide user through IonQ setup"""
    print("\n" + "="*60)
    print("🔬 IONQ QUANTUM SETUP")
    print("="*60)
    print()
    print("IonQ provides access to their trapped-ion quantum computers.")
    print("They offer cloud access through their API.")
    print()
    print("Steps:")
    print("1. Go to: https://ionq.com/")
    print("2. Sign up for access")
    print("3. Get your API key from your dashboard")
    print()

    token = input("Enter your IonQ API key (or press Enter to skip): ").strip()

    if token:
        os.environ['IONQ_API_KEY'] = token
        print("✅ IonQ API key set!")

        # Test connection
        try:
            from qiskit_ionq import IonQProvider
            provider = IonQProvider(token=token)
            backends = provider.backends()
            print(f"✅ Connection successful! Found {len(backends)} IonQ backends.")
        except Exception as e:
            print(f"❌ Connection test failed: {e}")
            print("   This is normal if you don't have active IonQ access yet.")
    else:
        print("⚠️  Skipping IonQ setup")

    return bool(token)

def setup_rigetti():
    """Guide user through Rigetti setup"""
    print("\n" + "="*60)
    print("🔬 RIGETTI QUANTUM SETUP")
    print("="*60)
    print()
    print("Rigetti provides access to their superconducting quantum processors.")
    print("Access through their Forest platform.")
    print()
    print("Steps:")
    print("1. Go to: https://www.rigetti.com/")
    print("2. Sign up for Forest platform access")
    print("3. Get your API key")
    print()

    token = input("Enter your Rigetti API key (or press Enter to skip): ").strip()

    if token:
        os.environ['RIGETTI_API_KEY'] = token
        print("✅ Rigetti API key set!")

        # Test connection
        try:
            from pyquil import list_quantum_computers
            computers = list_quantum_computers()
            print(f"✅ Connection successful! Found {len(computers)} Rigetti quantum computers.")
        except Exception as e:
            print(f"❌ Connection test failed: {e}")
            print("   This is normal if you don't have active Rigetti access yet.")
    else:
        print("⚠️  Skipping Rigetti setup")

    return bool(token)

def save_to_env_file():
    """Save API keys to .env file for persistence"""
    env_vars = {}
    for key in ['QISKIT_IBM_TOKEN', 'IONQ_API_KEY', 'RIGETTI_API_KEY']:
        value = os.getenv(key)
        if value:
            env_vars[key] = value

    if env_vars:
        try:
            with open('.env', 'w') as f:
                for key, value in env_vars.items():
                    f.write(f"{key}={value}\n")
            print(f"\n✅ API keys saved to .env file")
            print("   They will persist for future sessions.")
            print("   Load them with: source .env")
        except Exception as e:
            print(f"❌ Could not save .env file: {e}")
    else:
        print("\n⚠️  No API keys to save")

def main():
    """Main setup function"""
    print("🌟 QUANTUM INTERNET API KEY SETUP")
    print("This script will help you configure access to real quantum computers.")
    print("You need API keys from each provider you want to use.")
    print()

    # Setup each provider
    ibm_success = setup_ibm_quantum()
    ionq_success = setup_ionq()
    rigetti_success = setup_rigetti()

    print("\n" + "="*60)
    print("📊 SETUP SUMMARY")
    print("="*60)

    providers = []
    if ibm_success: providers.append("IBM Quantum")
    if ionq_success: providers.append("IonQ")
    if rigetti_success: providers.append("Rigetti")

    if providers:
        print(f"✅ Successfully configured: {', '.join(providers)}")
        print(f"   Total quantum providers: {len(providers)}")

        # Save to .env file
        save_to_env_file()

        print("\n🚀 READY TO LAUNCH QUANTUM INTERNET!")
        print("Run these commands to start:")
        print("  export $(cat .env | xargs)")  # Load environment variables
        print("  python test_quantum_connections.py")
        print("  python run_quantum_internet_multi.py")

    else:
        print("❌ No quantum providers configured")
        print("   You can still run simulations, but not on real quantum hardware.")
        print("   Re-run this script when you have API keys.")

    print("\n💡 Tips:")
    print("  - IBM Quantum: Free tier available, great for testing")
    print("  - IonQ: Enterprise access may require approval")
    print("  - Rigetti: Forest platform access")
    print("  - API keys are sensitive - never commit them to version control")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user")
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        import traceback
        traceback.print_exc()