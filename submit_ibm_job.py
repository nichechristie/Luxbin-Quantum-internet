#!/usr/bin/env python3
"""
Submit a real quantum job to IBM Quantum for verification
"""

import os
import sys
from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister
from qiskit_ibm_runtime import QiskitRuntimeService, Sampler, Session

def main():
    # Set token
    token = os.environ.get('QISKIT_IBM_TOKEN') or os.environ.get('IBM_TOKEN')
    if not token:
        print("❌ No IBM token found. Set QISKIT_IBM_TOKEN or IBM_TOKEN environment variable")
        return

    print("🚀 Connecting to IBM Quantum...")

    try:
        service = QiskitRuntimeService(channel='ibm_quantum_platform')
        print("✅ Connected to IBM Quantum successfully!")

        # Get available backends
        backends = service.backends()
        real_backends = [b for b in backends if not b.simulator and b.status().operational]
        print(f"✅ Found {len(real_backends)} operational quantum computers")

        if not real_backends:
            print("❌ No operational quantum computers available")
            return

        # Use the first available backend
        backend = real_backends[0]
        print(f"🎯 Using backend: {backend.name} ({backend.num_qubits} qubits)")

        # Create a simple quantum circuit (1 qubit, 1 measurement)
        qc = QuantumCircuit(1, 1)
        qc.h(0)  # Hadamard gate for superposition
        qc.measure(0, 0)

        print("⚛️ Created quantum circuit: Hadamard + Measure")
        print("📊 Circuit will generate true quantum randomness")

        # Submit job using Session mode (requires paid plan)
        print(f"📡 Submitting job to {backend.name} using Session mode...")
        with Session(service=service, backend=backend) as session:
            sampler = Sampler(session=session)
            job = sampler.run([qc], shots=1024)

            job_id = job.job_id()
            print("🎉 REAL QUANTUM JOB SUBMITTED SUCCESSFULLY!")
            print(f"📋 Job ID: {job_id}")
            print(f"🔗 Track job status: https://quantum.ibm.com/jobs/{job_id}")
            print("⏳ Session mode - job may complete faster but requires paid plan")
            print("💡 Check your IBM Quantum dashboard to see the job!")

    except Exception as e:
        print(f"❌ Failed: {e}")

if __name__ == "__main__":
    main()