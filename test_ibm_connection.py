#!/usr/bin/env python3
"""
Test IBM Quantum connection and account status
"""

import os
import sys

def main():
    # Check for token
    token = os.environ.get('QISKIT_IBM_TOKEN') or os.environ.get('IBM_TOKEN')
    if not token:
        print("❌ No IBM token found.")
        print("Set with: export QISKIT_IBM_TOKEN=your_token_here")
        return

    print(f"🔑 Using token: {token[:10]}...")
    print("🚀 Testing IBM Quantum connection...")

    try:
        # Try QiskitRuntimeService (works with current versions)
        from qiskit_ibm_runtime import QiskitRuntimeService
        service = QiskitRuntimeService(channel='ibm_quantum_platform')
        backends = service.backends()
        real_backends = [b for b in backends if not b.simulator]
        print("✅ QiskitRuntimeService connection successful!")
        print(f"📊 Total backends: {len(backends)}")
        print(f"⚛️ Real quantum computers: {len(real_backends)}")
        for b in real_backends[:3]:
            print(f"  - {b.name}: {b.num_qubits} qubits")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        print("💡 This could be due to:")
        print("   - Invalid token")
        print("   - Network issues")
        print("   - Account restrictions")
        print("   - API version incompatibility")

    print("\n💡 If connection works, your token is valid!")
    print("🎯 Next: run submit_ibm_job.py to submit a real job")

if __name__ == "__main__":
    main()