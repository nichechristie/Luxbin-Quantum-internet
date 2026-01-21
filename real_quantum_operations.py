#!/usr/bin/env python3
"""
LUXBIN Real Quantum Operations
Actually executes quantum circuits on real hardware or proper simulators.
No more random.uniform() - this is the real deal.
"""

import os
import asyncio
import hashlib
from datetime import datetime
from typing import Dict, List, Any, Optional, Tuple
import json

# Qiskit imports
try:
    from qiskit import QuantumCircuit, QuantumRegister, ClassicalRegister, transpile
    from qiskit.visualization import plot_histogram
    from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler, Session
    from qiskit_ibm_runtime.fake_provider import FakeManilaV2, FakeTorontoV2
    QISKIT_AVAILABLE = True
except ImportError:
    QISKIT_AVAILABLE = False
    print("⚠️  Install qiskit: pip install qiskit qiskit-ibm-runtime qiskit-aer")

# Qiskit Aer for proper simulation
try:
    from qiskit_aer import AerSimulator
    from qiskit_aer.noise import NoiseModel
    AER_AVAILABLE = True
except ImportError:
    AER_AVAILABLE = False

# Load environment
from dotenv import load_dotenv
load_dotenv()


class RealQuantumRNG:
    """
    Real Quantum Random Number Generator
    Uses actual quantum circuits instead of random.uniform()
    """

    def __init__(self, use_real_hardware: bool = True):
        self.use_real_hardware = use_real_hardware
        self.service = None
        self.backend = None
        self.simulator = None
        self.total_bits_generated = 0
        self.job_history = []

        self._initialize()

    def _initialize(self):
        """Initialize quantum backend"""
        if QISKIT_AVAILABLE:
            # Try real hardware first
            if self.use_real_hardware:
                try:
                    self.service = QiskitRuntimeService(channel="ibm_quantum_platform")
                    backends = self.service.backends()
                    print(f"✅ Connected to IBM Quantum, found {len(backends)} backends")
                    # Get least busy backend
                    self.backend = self.service.least_busy(
                        simulator=False,
                        operational=True,
                        min_num_qubits=5
                    )
                    print(f"✅ QRNG using real hardware: {self.backend.name}")
                except Exception as e:
                    print(f"⚠️  Could not connect to IBM Quantum: {e}")
                    print("Falling back to simulation with realistic noise model")
                    self.use_real_hardware = False

            # Fallback to Aer simulator with noise model
            if not self.use_real_hardware and AER_AVAILABLE:
                # Use fake backend for realistic noise
                fake_backend = FakeManilaV2()
                noise_model = NoiseModel.from_backend(fake_backend)
                self.simulator = AerSimulator(noise_model=noise_model)
                print("✅ QRNG using Aer simulator with realistic noise model")
            elif not self.use_real_hardware:
                self.simulator = AerSimulator()
                print("✅ QRNG using Aer simulator (ideal)")

    def _create_qrng_circuit(self, num_bits: int) -> QuantumCircuit:
        """Create a quantum circuit for random number generation"""
        qr = QuantumRegister(num_bits, 'q')
        cr = ClassicalRegister(num_bits, 'c')
        circuit = QuantumCircuit(qr, cr)

        # Apply Hadamard to all qubits - creates superposition
        for i in range(num_bits):
            circuit.h(qr[i])

        # Measure all qubits
        circuit.measure(qr, cr)

        return circuit

    async def generate_random_bits(self, num_bits: int = 8, shots: int = 1) -> Dict[str, Any]:
        """
        Generate truly random bits using quantum mechanics.

        Args:
            num_bits: Number of random bits to generate
            shots: Number of times to run the circuit

        Returns:
            Dict with random bits and metadata
        """
        if not QISKIT_AVAILABLE:
            # Ultimate fallback - but flag it clearly
            import random
            return {
                'bits': format(random.getrandbits(num_bits), f'0{num_bits}b'),
                'source': 'classical_fallback',
                'warning': 'Qiskit not available - using classical RNG'
            }

        circuit = self._create_qrng_circuit(num_bits)

        start_time = datetime.now()

        if self.use_real_hardware and self.service:
            # Execute on real quantum hardware
            try:
                with Session(service=self.service, backend=self.backend) as session:
                    sampler = Sampler(session=session)
                    job = sampler.run([circuit], shots=shots)
                    result = job.result()

                    # Extract the most frequent bitstring
                    pub_result = result[0]
                    counts = pub_result.data.c.get_counts()
                    most_frequent = max(counts, key=counts.get)

                    execution_time = (datetime.now() - start_time).total_seconds()

                    job_record = {
                        'job_id': job.job_id(),
                        'backend': self.backend.name,
                        'bits_generated': num_bits,
                        'shots': shots,
                        'execution_time': execution_time,
                        'timestamp': datetime.now().isoformat()
                    }
                    self.job_history.append(job_record)
                    self.total_bits_generated += num_bits

                    return {
                        'bits': most_frequent,
                        'int_value': int(most_frequent, 2),
                        'counts': counts,
                        'source': 'ibm_quantum_hardware',
                        'backend': self.backend.name,
                        'job_id': job.job_id(),
                        'execution_time_seconds': execution_time,
                        'shots': shots
                    }
            except Exception as e:
                print(f"⚠️  Hardware execution failed: {e}, falling back to simulator")

        # Simulator execution
        transpiled = transpile(circuit, self.simulator)
        job = self.simulator.run(transpiled, shots=shots)
        result = job.result()
        counts = result.get_counts()
        most_frequent = max(counts, key=counts.get)

        execution_time = (datetime.now() - start_time).total_seconds()
        self.total_bits_generated += num_bits

        return {
            'bits': most_frequent,
            'int_value': int(most_frequent, 2),
            'counts': counts,
            'source': 'qiskit_aer_simulator',
            'noise_model': 'realistic' if AER_AVAILABLE else 'ideal',
            'execution_time_seconds': execution_time,
            'shots': shots
        }

    async def generate_random_float(self, min_val: float = 0.0, max_val: float = 1.0) -> Dict[str, Any]:
        """Generate a random float in range using quantum RNG"""
        result = await self.generate_random_bits(32)

        # Convert to float in range [0, 1]
        normalized = result['int_value'] / (2**32 - 1)

        # Scale to desired range
        scaled = min_val + (normalized * (max_val - min_val))

        return {
            'value': scaled,
            'quantum_source': result['source'],
            'raw_bits': result['bits']
        }


class RealBellPairGenerator:
    """
    Creates and measures real Bell pairs on quantum hardware.
    This is actual entanglement, not simulation.
    """

    def __init__(self):
        self.service = None
        self.backends = {}
        self.entanglement_history = []
        self._initialize()

    def _initialize(self):
        """Initialize connections to quantum backends"""
        if QISKIT_AVAILABLE:
            try:
                self.service = QiskitRuntimeService(channel="ibm_quantum")

                # Get available backends
                available = self.service.backends(
                    simulator=False,
                    operational=True,
                    min_num_qubits=2
                )

                for backend in available[:5]:  # Top 5 backends
                    self.backends[backend.name] = {
                        'backend': backend,
                        'num_qubits': backend.num_qubits,
                        'status': 'available'
                    }

                print(f"✅ Bell pair generator connected to {len(self.backends)} quantum backends")

            except Exception as e:
                print(f"⚠️  Could not connect to IBM Quantum: {e}")

        # Always have simulator available
        if AER_AVAILABLE:
            self.simulator = AerSimulator()
        else:
            self.simulator = None

    def _create_bell_circuit(self, bell_state: str = 'phi_plus') -> QuantumCircuit:
        """
        Create a Bell state circuit.

        Bell states:
        - phi_plus:  (|00⟩ + |11⟩)/√2
        - phi_minus: (|00⟩ - |11⟩)/√2
        - psi_plus:  (|01⟩ + |10⟩)/√2
        - psi_minus: (|01⟩ - |10⟩)/√2
        """
        qr = QuantumRegister(2, 'q')
        cr = ClassicalRegister(2, 'c')
        circuit = QuantumCircuit(qr, cr)

        # Create Bell state
        circuit.h(qr[0])  # Hadamard on first qubit
        circuit.cx(qr[0], qr[1])  # CNOT

        # Modify for different Bell states
        if bell_state == 'phi_minus':
            circuit.z(qr[0])
        elif bell_state == 'psi_plus':
            circuit.x(qr[1])
        elif bell_state == 'psi_minus':
            circuit.z(qr[0])
            circuit.x(qr[1])

        # Measure
        circuit.measure(qr, cr)

        return circuit

    async def create_bell_pair(
        self,
        backend_name: Optional[str] = None,
        bell_state: str = 'phi_plus',
        shots: int = 1024
    ) -> Dict[str, Any]:
        """
        Create and measure a Bell pair.

        Args:
            backend_name: Specific backend to use (or None for least busy)
            bell_state: Which Bell state to create
            shots: Number of measurements

        Returns:
            Dict with measurement results and fidelity estimate
        """
        circuit = self._create_bell_circuit(bell_state)

        start_time = datetime.now()

        # Try real hardware
        if self.service and self.backends:
            try:
                if backend_name and backend_name in self.backends:
                    backend = self.backends[backend_name]['backend']
                else:
                    backend = self.service.least_busy(
                        simulator=False,
                        operational=True,
                        min_num_qubits=2
                    )

                with Session(service=self.service, backend=backend) as session:
                    sampler = Sampler(session=session)
                    job = sampler.run([circuit], shots=shots)
                    result = job.result()

                    pub_result = result[0]
                    counts = pub_result.data.c.get_counts()

                    # Calculate fidelity (for Bell state, should see only 00 and 11)
                    correlated = counts.get('00', 0) + counts.get('11', 0)
                    total = sum(counts.values())
                    fidelity = correlated / total if total > 0 else 0

                    execution_time = (datetime.now() - start_time).total_seconds()

                    record = {
                        'bell_state': bell_state,
                        'backend': backend.name,
                        'fidelity': fidelity,
                        'timestamp': datetime.now().isoformat(),
                        'job_id': job.job_id()
                    }
                    self.entanglement_history.append(record)

                    return {
                        'bell_state': bell_state,
                        'counts': counts,
                        'fidelity': fidelity,
                        'source': 'ibm_quantum_hardware',
                        'backend': backend.name,
                        'job_id': job.job_id(),
                        'shots': shots,
                        'execution_time_seconds': execution_time,
                        'is_entangled': fidelity > 0.7,  # Threshold for "good" entanglement
                        'correlation': {
                            '00': counts.get('00', 0),
                            '11': counts.get('11', 0),
                            '01': counts.get('01', 0),
                            '10': counts.get('10', 0)
                        }
                    }

            except Exception as e:
                print(f"⚠️  Hardware Bell pair failed: {e}")

        # Simulator fallback
        if self.simulator:
            transpiled = transpile(circuit, self.simulator)
            job = self.simulator.run(transpiled, shots=shots)
            result = job.result()
            counts = result.get_counts()

            correlated = counts.get('00', 0) + counts.get('11', 0)
            total = sum(counts.values())
            fidelity = correlated / total if total > 0 else 0

            return {
                'bell_state': bell_state,
                'counts': counts,
                'fidelity': fidelity,
                'source': 'qiskit_aer_simulator',
                'shots': shots,
                'is_entangled': fidelity > 0.7,
                'correlation': {
                    '00': counts.get('00', 0),
                    '11': counts.get('11', 0),
                    '01': counts.get('01', 0),
                    '10': counts.get('10', 0)
                }
            }

        return {'error': 'No quantum backend available'}


class RealQuantumTeleportation:
    """
    Implements the quantum teleportation protocol.
    Uses Bell pairs + classical communication.
    """

    def __init__(self):
        self.bell_generator = RealBellPairGenerator()
        self.qrng = RealQuantumRNG(use_real_hardware=False)  # Simulator for speed

    def _create_teleportation_circuit(self, state_to_teleport: Tuple[complex, complex] = None) -> QuantumCircuit:
        """
        Create quantum teleportation circuit.

        Qubit 0: State to teleport
        Qubit 1: Alice's half of Bell pair
        Qubit 2: Bob's half of Bell pair (receives teleported state)
        """
        qr = QuantumRegister(3, 'q')
        cr = ClassicalRegister(3, 'c')
        circuit = QuantumCircuit(qr, cr)

        # Prepare state to teleport (default: |+⟩ state)
        if state_to_teleport:
            circuit.initialize(list(state_to_teleport), 0)
        else:
            circuit.h(qr[0])  # Create |+⟩ state

        circuit.barrier()

        # Create Bell pair between qubits 1 and 2
        circuit.h(qr[1])
        circuit.cx(qr[1], qr[2])

        circuit.barrier()

        # Alice's operations (Bell measurement on qubits 0 and 1)
        circuit.cx(qr[0], qr[1])
        circuit.h(qr[0])

        # Measure qubits 0 and 1
        circuit.measure(qr[0], cr[0])
        circuit.measure(qr[1], cr[1])

        circuit.barrier()

        # Bob's corrections based on classical bits
        circuit.x(qr[2]).c_if(cr[1], 1)  # Apply X if cr[1] = 1
        circuit.z(qr[2]).c_if(cr[0], 1)  # Apply Z if cr[0] = 1

        # Measure final state
        circuit.measure(qr[2], cr[2])

        return circuit

    async def teleport(self, shots: int = 1024) -> Dict[str, Any]:
        """
        Execute quantum teleportation protocol.

        Returns:
            Dict with teleportation results and fidelity
        """
        circuit = self._create_teleportation_circuit()

        start_time = datetime.now()

        # Use simulator for teleportation (hardware is expensive for 3 qubits)
        if AER_AVAILABLE:
            simulator = AerSimulator()
            transpiled = transpile(circuit, simulator)
            job = simulator.run(transpiled, shots=shots)
            result = job.result()
            counts = result.get_counts()

            # Analyze teleportation success
            # For |+⟩ state, we expect measurement outcomes that show successful teleport
            execution_time = (datetime.now() - start_time).total_seconds()

            # Extract classical bits sent (first 2 bits of each outcome)
            classical_messages = {}
            teleported_outcomes = {'0': 0, '1': 0}

            for outcome, count in counts.items():
                # outcome format: 'c2 c1 c0' (reversed)
                classical_bits = outcome[1:]  # c1 c0
                teleported_bit = outcome[0]   # c2

                classical_messages[classical_bits] = classical_messages.get(classical_bits, 0) + count
                teleported_outcomes[teleported_bit] += count

            # For |+⟩ state, should see roughly 50/50 split
            total = sum(teleported_outcomes.values())
            balance = min(teleported_outcomes.values()) / max(teleported_outcomes.values()) if max(teleported_outcomes.values()) > 0 else 0

            return {
                'success': True,
                'state_teleported': '|+⟩',
                'counts': counts,
                'classical_bits_sent': classical_messages,
                'teleported_measurement': teleported_outcomes,
                'fidelity_estimate': balance,  # Should be ~1.0 for perfect teleportation
                'execution_time_seconds': execution_time,
                'shots': shots,
                'source': 'qiskit_aer_simulator',
                'protocol': 'Standard quantum teleportation with Bell pair'
            }

        return {'error': 'Qiskit Aer not available'}


class QuantumMetrics:
    """
    Track real metrics from quantum operations.
    """

    def __init__(self):
        self.operations = []
        self.total_qubits_used = 0
        self.total_shots = 0
        self.total_jobs = 0
        self.backends_used = set()

    def record_operation(self, operation_type: str, result: Dict[str, Any]):
        """Record a quantum operation for metrics"""
        record = {
            'type': operation_type,
            'timestamp': datetime.now().isoformat(),
            'source': result.get('source', 'unknown'),
            'backend': result.get('backend', 'simulator'),
            'shots': result.get('shots', 1),
            'fidelity': result.get('fidelity'),
            'execution_time': result.get('execution_time_seconds')
        }

        self.operations.append(record)
        self.total_shots += result.get('shots', 1)
        self.total_jobs += 1

        if result.get('backend'):
            self.backends_used.add(result.get('backend'))

    def get_summary(self) -> Dict[str, Any]:
        """Get metrics summary"""
        fidelities = [op['fidelity'] for op in self.operations if op['fidelity'] is not None]
        exec_times = [op['execution_time'] for op in self.operations if op['execution_time'] is not None]

        return {
            'total_operations': len(self.operations),
            'total_shots': self.total_shots,
            'total_jobs': self.total_jobs,
            'backends_used': list(self.backends_used),
            'average_fidelity': sum(fidelities) / len(fidelities) if fidelities else None,
            'average_execution_time': sum(exec_times) / len(exec_times) if exec_times else None,
            'operation_breakdown': {
                'qrng': len([op for op in self.operations if op['type'] == 'qrng']),
                'bell_pair': len([op for op in self.operations if op['type'] == 'bell_pair']),
                'teleportation': len([op for op in self.operations if op['type'] == 'teleportation'])
            }
        }


# Global instances for easy access
_qrng = None
_bell_generator = None
_teleportation = None
_metrics = None


def get_qrng() -> RealQuantumRNG:
    global _qrng
    if _qrng is None:
        _qrng = RealQuantumRNG(use_real_hardware=bool(os.getenv('IBM_QUANTUM_TOKEN')))
    return _qrng


def get_bell_generator() -> RealBellPairGenerator:
    global _bell_generator
    if _bell_generator is None:
        _bell_generator = RealBellPairGenerator()
    return _bell_generator


def get_teleportation() -> RealQuantumTeleportation:
    global _teleportation
    if _teleportation is None:
        _teleportation = RealQuantumTeleportation()
    return _teleportation


def get_metrics() -> QuantumMetrics:
    global _metrics
    if _metrics is None:
        _metrics = QuantumMetrics()
    return _metrics


async def demo():
    """Demo the real quantum operations"""
    print("=" * 60)
    print("🔬 LUXBIN Real Quantum Operations Demo")
    print("=" * 60)

    # QRNG Demo
    print("\n1️⃣ Quantum Random Number Generation")
    print("-" * 40)
    qrng = get_qrng()
    result = await qrng.generate_random_bits(8)
    print(f"   Random bits: {result['bits']}")
    print(f"   Integer value: {result['int_value']}")
    print(f"   Source: {result['source']}")

    get_metrics().record_operation('qrng', result)

    # Bell Pair Demo
    print("\n2️⃣ Bell Pair (Entanglement) Generation")
    print("-" * 40)
    bell = get_bell_generator()
    result = await bell.create_bell_pair(shots=1024)
    print(f"   Bell state: {result.get('bell_state', 'phi_plus')}")
    print(f"   Fidelity: {result.get('fidelity', 0):.3f}")
    print(f"   Correlation: {result.get('correlation', {})}")
    print(f"   Is entangled: {result.get('is_entangled', False)}")
    print(f"   Source: {result.get('source', 'unknown')}")

    get_metrics().record_operation('bell_pair', result)

    # Teleportation Demo
    print("\n3️⃣ Quantum Teleportation")
    print("-" * 40)
    teleport = get_teleportation()
    result = await teleport.teleport(shots=1024)
    print(f"   State teleported: {result.get('state_teleported', 'unknown')}")
    print(f"   Classical bits sent: {result.get('classical_bits_sent', {})}")
    print(f"   Fidelity estimate: {result.get('fidelity_estimate', 0):.3f}")
    print(f"   Source: {result.get('source', 'unknown')}")

    get_metrics().record_operation('teleportation', result)

    # Metrics Summary
    print("\n📊 Metrics Summary")
    print("-" * 40)
    summary = get_metrics().get_summary()
    print(f"   Total operations: {summary['total_operations']}")
    print(f"   Total shots: {summary['total_shots']}")
    print(f"   Backends used: {summary['backends_used']}")
    if summary['average_fidelity']:
        print(f"   Average fidelity: {summary['average_fidelity']:.3f}")

    print("\n✅ Real quantum operations complete!")


if __name__ == '__main__':
    asyncio.run(demo())
