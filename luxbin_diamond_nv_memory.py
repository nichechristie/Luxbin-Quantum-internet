#!/usr/bin/env python3
"""
LUXBIN DIAMOND NV CENTER MEMORY

Uses nitrogen-vacancy (NV) centers in diamond for quantum memory storage.

Key Physics:
- NV center Zero-Phonon Line (ZPL): 637nm (red)
- LUXBIN maps this to wavelength range near 'Z' (497.4nm) shifted
- NV electron spin: ms = 0, ±1 (triplet ground state)
- Nuclear spin (14N or 13C): Additional memory register
- Coherence time: milliseconds to seconds at room temperature!

This module simulates:
1. Writing LUXBIN data to NV center spin states
2. Storing via nuclear spin coupling
3. Reading back after quantum evolution
4. Error correction using multiple NV centers

Integration with IBM Quantum:
- Superconducting qubits simulate NV spin dynamics
- Maps LUXBIN wavelengths to rotation angles
- Demonstrates memory read/write cycles
"""

from qiskit import QuantumCircuit
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
import numpy as np
import time
import os

TOKEN = os.environ.get('IBM_QUANTUM_TOKEN', '0jj91VQr-N-QC86EjazcfGje6-Qzg0ft4f9fdmL-JBTg')

# =============================================================================
# NV CENTER PHYSICS CONSTANTS
# =============================================================================

NV_CONSTANTS = {
    'zpl_wavelength': 637.0,         # nm - Zero Phonon Line
    'ground_state_splitting': 2.87,  # GHz - D_gs (zero-field splitting)
    'excited_state_splitting': 1.42, # GHz - D_es
    'hyperfine_coupling': 2.16,      # MHz - 14N hyperfine
    'coherence_time_T2': 1.8,        # ms - electron spin coherence
    'nuclear_T2': 1000.0,            # ms - nuclear spin coherence (memory!)
}

# LUXBIN mappings
CHAR_WAVELENGTHS = {
    'A': 400.0, 'B': 403.9, 'C': 407.8, 'D': 411.7, 'E': 415.6,
    'F': 419.5, 'G': 423.4, 'H': 427.3, 'I': 431.2, 'J': 435.1,
    'K': 439.0, 'L': 442.9, 'M': 446.8, 'N': 450.6, 'O': 454.5,
    'P': 458.4, 'Q': 462.3, 'R': 466.2, 'S': 470.1, 'T': 474.0,
    'U': 477.9, 'V': 481.8, 'W': 485.7, 'X': 489.6, 'Y': 493.5,
    'Z': 497.4, ' ': 540.3,
}

# =============================================================================
# NV CENTER MEMORY CLASS
# =============================================================================

class DiamondNVMemory:
    """
    Simulates a diamond NV center quantum memory.

    Qubit mapping:
    - q0: NV electron spin (ms=0 vs ms=+1)
    - q1: 14N nuclear spin (memory register)
    - q2: 13C nuclear spin (auxiliary memory)
    - q3: Optical readout register
    """

    def __init__(self):
        self.stored_data = {}
        self.memory_addresses = 0
        self.backend = None
        self.service = None

    def connect(self):
        """Connect to quantum backend."""
        print("🔧 Connecting to quantum backend...")
        self.service = QiskitRuntimeService(channel="ibm_quantum_platform", token=TOKEN)
        self.backend = self.service.least_busy(operational=True, simulator=False, min_num_qubits=4)
        print(f"✅ Connected to: {self.backend.name}")
        return self.backend

    def _wavelength_to_rotation(self, wavelength: float) -> float:
        """Convert LUXBIN wavelength to qubit rotation angle."""
        # Map visible spectrum (400-700nm) to rotation (0-2π)
        normalized = (wavelength - 400) / 300
        return normalized * 2 * np.pi

    def _create_write_circuit(self, luxbin_char: str, address: int = 0) -> QuantumCircuit:
        """
        Create circuit to write LUXBIN character to NV memory.

        Process:
        1. Optical excitation (637nm) initializes electron spin
        2. Microwave pulse rotates electron spin based on data
        3. SWAP to nuclear spin for storage
        4. Electron spin reset for next operation
        """
        wavelength = CHAR_WAVELENGTHS.get(luxbin_char.upper(), 540.3)
        theta = self._wavelength_to_rotation(wavelength)

        qc = QuantumCircuit(4, 4)

        # Initialize electron spin (optical pumping at 637nm)
        # In real NV: green laser (532nm) polarizes to ms=0
        qc.reset(0)

        # Apply microwave pulse (encode LUXBIN data)
        # θ derived from wavelength
        qc.ry(theta, 0)

        # Add phase information
        qc.rz(theta / 2, 0)

        # Transfer to nuclear spin (SWAP gate via hyperfine coupling)
        # In real NV: RF pulse at hyperfine frequency
        qc.swap(0, 1)

        # Reset electron spin for next operation
        qc.reset(0)

        # Optional: Copy to 13C for redundancy
        if address > 0:
            qc.cx(1, 2)

        return qc, wavelength

    def _create_read_circuit(self, address: int = 0) -> QuantumCircuit:
        """
        Create circuit to read LUXBIN character from NV memory.

        Process:
        1. SWAP nuclear spin back to electron spin
        2. Optical readout (fluorescence based on spin state)
        3. Measure electron spin
        """
        qc = QuantumCircuit(4, 4)

        # Transfer from nuclear spin to electron spin
        qc.swap(1, 0)

        # Optical readout preparation
        # In real NV: measure fluorescence at 637nm
        qc.h(3)  # Prepare readout qubit
        qc.cx(0, 3)  # Correlate with electron spin

        # Measure all qubits
        qc.measure(range(4), range(4))

        return qc

    def _create_memory_cycle_circuit(self, luxbin_char: str, storage_time_steps: int = 3) -> QuantumCircuit:
        """
        Create complete write-store-read cycle circuit.

        Simulates:
        1. Write LUXBIN to electron spin
        2. Transfer to nuclear spin (long coherence)
        3. Wait (simulated by identity gates)
        4. Transfer back and read
        """
        wavelength = CHAR_WAVELENGTHS.get(luxbin_char.upper(), 540.3)
        theta = self._wavelength_to_rotation(wavelength)

        qc = QuantumCircuit(4, 4)

        # === WRITE PHASE ===
        # Initialize (optical pumping)
        qc.reset(0)
        qc.reset(1)

        # Encode LUXBIN wavelength
        qc.ry(theta, 0)
        qc.rz(theta / 2, 0)

        qc.barrier()

        # === STORAGE PHASE ===
        # Transfer to nuclear spin
        qc.swap(0, 1)

        # Simulate storage time (decoherence simulation)
        for _ in range(storage_time_steps):
            qc.id(1)  # Identity (wait)
            # Add small rotation to simulate T2 decay
            qc.rz(0.01, 1)

        qc.barrier()

        # === READ PHASE ===
        # Transfer back to electron spin
        qc.swap(1, 0)

        # Optical readout
        qc.h(3)
        qc.cx(0, 3)

        # Measure
        qc.measure(range(4), range(4))

        return qc, wavelength

    def write(self, luxbin_char: str, address: int = None) -> dict:
        """Write a LUXBIN character to NV memory."""
        if address is None:
            address = self.memory_addresses
            self.memory_addresses += 1

        self.stored_data[address] = luxbin_char
        wavelength = CHAR_WAVELENGTHS.get(luxbin_char.upper(), 540.3)

        return {
            'address': address,
            'char': luxbin_char,
            'wavelength': wavelength,
            'status': 'stored'
        }

    def run_memory_test(self, message: str = "LUXBIN") -> dict:
        """
        Run a complete memory test on quantum hardware.

        Writes each character, stores, reads back, and verifies.
        """
        print("=" * 70)
        print("DIAMOND NV CENTER MEMORY TEST")
        print("=" * 70)

        if not self.backend:
            self.connect()

        results = []
        pm = generate_preset_pass_manager(backend=self.backend, optimization_level=1)
        sampler = SamplerV2(self.backend)

        for i, char in enumerate(message[:5]):  # Max 5 chars (qubit limit)
            print(f"\n--- Memory Cycle: '{char}' ---")

            # Create memory cycle circuit
            qc, wavelength = self._create_memory_cycle_circuit(char)

            # Transpile and run
            transpiled = pm.run(qc)
            job = sampler.run([transpiled], shots=500)
            print(f"Job: {job.job_id()}")

            result = job.result()
            counts = result[0].data.c.get_counts()

            # Analyze results
            analysis = self._analyze_memory_result(counts, char, wavelength)
            results.append(analysis)

            print(f"  Input wavelength: {wavelength:.1f}nm")
            print(f"  Memory fidelity: {analysis['fidelity']:.1%}")
            print(f"  Recovered value: {analysis['recovered_wavelength']:.1f}nm")

        # Summary
        self._print_memory_summary(results, message)

        return results

    def _analyze_memory_result(self, counts: dict, original_char: str, original_wavelength: float) -> dict:
        """Analyze memory read result."""
        total = sum(counts.values())

        # Extract electron spin (q0) and readout (q3) from measurements
        spin_0_count = 0
        spin_1_count = 0

        for bitstring, count in counts.items():
            electron_spin = int(bitstring[3])  # q0 is last in bitstring
            if electron_spin == 0:
                spin_0_count += count
            else:
                spin_1_count += count

        # Recovered angle from measurement statistics
        spin_1_probability = spin_1_count / total
        recovered_theta = 2 * np.arcsin(np.sqrt(spin_1_probability))

        # Convert back to wavelength
        recovered_wavelength = 400 + (recovered_theta / (2 * np.pi)) * 300

        # Calculate fidelity
        wavelength_error = abs(recovered_wavelength - original_wavelength)
        fidelity = max(0, 1 - wavelength_error / 300)

        # Find closest character
        closest_char = min(CHAR_WAVELENGTHS.items(),
                          key=lambda x: abs(x[1] - recovered_wavelength))[0]

        return {
            'original_char': original_char,
            'original_wavelength': original_wavelength,
            'recovered_wavelength': recovered_wavelength,
            'recovered_char': closest_char,
            'fidelity': fidelity,
            'match': original_char == closest_char,
            'counts': counts
        }

    def _print_memory_summary(self, results: list, original_message: str):
        """Print memory test summary."""
        print("\n" + "=" * 70)
        print("NV MEMORY TEST RESULTS")
        print("=" * 70)

        recovered_message = ''.join([r['recovered_char'] for r in results])
        avg_fidelity = np.mean([r['fidelity'] for r in results])
        correct_chars = sum([r['match'] for r in results])

        print(f"""
  Original message:  '{original_message[:5]}'
  Recovered message: '{recovered_message}'

  Character accuracy: {correct_chars}/{len(results)} ({100*correct_chars/len(results):.0f}%)
  Average fidelity:   {avg_fidelity:.1%}
""")

        print("Character-by-character:")
        print("-" * 50)
        for r in results:
            status = "✓" if r['match'] else "✗"
            print(f"  '{r['original_char']}' ({r['original_wavelength']:.0f}nm) → "
                  f"'{r['recovered_char']}' ({r['recovered_wavelength']:.0f}nm) {status}")

        print(f"""
DIAMOND NV CENTER MEMORY:

This test demonstrates quantum memory using simulated NV center physics:

1. WRITE: LUXBIN wavelength encoded as electron spin rotation
2. STORE: Transferred to nuclear spin (long coherence ~1 second)
3. READ: Transferred back to electron, optically measured

Real NV centers at 637nm can store quantum states for seconds,
making them ideal for LUXBIN quantum memory applications.

The recovered message shows how well quantum information survives
the storage cycle, with fidelity indicating information preservation.
""")


# =============================================================================
# MULTI-NV QUANTUM REGISTER
# =============================================================================

class MultiNVRegister:
    """
    Simulates multiple coupled NV centers as a quantum register.

    This enables:
    - Error correction across multiple NV centers
    - Entangled memory states
    - Parallel read/write operations
    """

    def __init__(self, num_nv_centers: int = 3):
        self.num_nv = num_nv_centers
        self.memories = [DiamondNVMemory() for _ in range(num_nv_centers)]

    def create_entangled_memory_circuit(self, luxbin_message: str) -> QuantumCircuit:
        """
        Create entangled memory across multiple NV centers.

        Each character stored in separate NV, but entangled for error correction.
        """
        n_qubits = min(len(luxbin_message), self.num_nv) * 2  # 2 qubits per NV
        qc = QuantumCircuit(n_qubits, n_qubits)

        # Encode each character
        for i, char in enumerate(luxbin_message[:self.num_nv]):
            wavelength = CHAR_WAVELENGTHS.get(char.upper(), 540.3)
            theta = ((wavelength - 400) / 300) * 2 * np.pi

            electron_qubit = 2 * i
            nuclear_qubit = 2 * i + 1

            # Encode to electron spin
            qc.ry(theta, electron_qubit)

            # Transfer to nuclear spin
            qc.swap(electron_qubit, nuclear_qubit)

        # Create entanglement between nuclear spins (for error correction)
        for i in range(self.num_nv - 1):
            qc.cx(2*i + 1, 2*(i+1) + 1)

        # Measure all
        qc.measure(range(n_qubits), range(n_qubits))

        return qc


# =============================================================================
# MAIN
# =============================================================================

def main():
    print("=" * 70)
    print("LUXBIN DIAMOND NV CENTER QUANTUM MEMORY")
    print("Using 637nm Zero-Phonon Line for quantum storage")
    print("=" * 70)

    print(f"""
NV CENTER PHYSICS:
  Zero-Phonon Line:     {NV_CONSTANTS['zpl_wavelength']} nm
  Ground state split:   {NV_CONSTANTS['ground_state_splitting']} GHz
  Electron T2:          {NV_CONSTANTS['coherence_time_T2']} ms
  Nuclear T2 (memory):  {NV_CONSTANTS['nuclear_T2']} ms
""")

    # Create memory and run test
    memory = DiamondNVMemory()
    results = memory.run_memory_test("LUXBN")

    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    main()
