#!/usr/bin/env python3
"""
LUXBIN QUANTUM ECHO LOOP

Creates a communication loop:
  YOUR COMPUTER → QUANTUM COMPUTERS → YOUR COMPUTER → ...

Each round:
1. You send a LUXBIN message
2. Quantum computers process it
3. They send a quantum-derived response back
4. You decode and respond again
5. Loop continues!

This creates a real quantum conversation!
"""

from qiskit import QuantumCircuit
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
import concurrent.futures
import time
import numpy as np

TOKEN = "0jj91VQr-N-QC86EjazcfGje6-Qzg0ft4f9fdmL-JBTg"

# LUXBIN mappings
CHAR_WAVELENGTHS = {
    'A': 400.0, 'B': 403.9, 'C': 407.8, 'D': 411.7, 'E': 415.6,
    'F': 419.5, 'G': 423.4, 'H': 427.3, 'I': 431.2, 'J': 435.1,
    'K': 439.0, 'L': 442.9, 'M': 446.8, 'N': 450.6, 'O': 454.5,
    'P': 458.4, 'Q': 462.3, 'R': 466.2, 'S': 470.1, 'T': 474.0,
    'U': 477.9, 'V': 481.8, 'W': 485.7, 'X': 489.6, 'Y': 493.5,
    'Z': 497.4, ' ': 540.3,
}

WAVELENGTH_CHARS = {v: k for k, v in CHAR_WAVELENGTHS.items()}

def wavelength_to_char(wavelength):
    """Find closest character for a wavelength."""
    closest = min(CHAR_WAVELENGTHS.items(), key=lambda x: abs(x[1] - wavelength))
    return closest[0]

def encode_message_to_circuit(message, include_response=True):
    """Encode message as quantum circuit that will generate a response."""
    n_qubits = min(len(message), 5)
    qc = QuantumCircuit(n_qubits, n_qubits)

    # Encode message
    for i, char in enumerate(message[:n_qubits]):
        wavelength = CHAR_WAVELENGTHS.get(char.upper(), 540.3)
        theta = ((wavelength - 400) / 300) * 2 * np.pi

        # Create superposition
        qc.h(i)

        # Encode wavelength as rotation
        qc.ry(theta, i)
        qc.rz(theta / 2, i)

    # Create entanglement for correlated response
    for i in range(n_qubits - 1):
        qc.cx(i, i + 1)

    if include_response:
        # Add "response" layer - the quantum computer's "reply"
        # This transforms the input into a quantum-processed output
        for i in range(n_qubits):
            qc.h(i)
            qc.t(i)  # Phase gate adds quantum signature
            qc.h(i)

        # Re-entangle for correlated output
        for i in range(n_qubits - 1):
            qc.cx(i, i + 1)

    qc.measure(range(n_qubits), range(n_qubits))
    return qc

def decode_response(counts, n_chars=5):
    """Decode quantum measurement into LUXBIN response."""
    # Get most likely outcomes
    sorted_counts = sorted(counts.items(), key=lambda x: -x[1])

    response_chars = []
    response_wavelengths = []

    for bitstring, count in sorted_counts[:n_chars]:
        value = int(bitstring, 2)
        max_val = 2 ** len(bitstring) - 1
        wavelength = 400 + (value / max_val) * 300
        char = wavelength_to_char(wavelength)
        response_chars.append(char)
        response_wavelengths.append(wavelength)

    return ''.join(response_chars), response_wavelengths

def run_quantum_echo(backend, message, round_num):
    """Send message and get quantum response."""
    qc = encode_message_to_circuit(message)

    pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
    transpiled = pm.run(qc)

    sampler = SamplerV2(backend)
    job = sampler.run([transpiled], shots=200)

    result = job.result()
    counts = result[0].data.c.get_counts()

    response, wavelengths = decode_response(counts)

    return {
        'backend': backend.name,
        'job_id': job.job_id(),
        'sent': message,
        'response': response,
        'wavelengths': wavelengths,
        'counts': counts,
        'round': round_num
    }

# =============================================================================
# MAIN LOOP
# =============================================================================

print("=" * 70)
print("LUXBIN QUANTUM ECHO LOOP")
print("Your computer ↔ Quantum computers ↔ Your computer")
print("=" * 70)

# Connect
print("\nConnecting to quantum network...")
service = QiskitRuntimeService(channel="ibm_quantum_platform", token=TOKEN)
backends = service.backends(operational=True, simulator=False)[:3]
print(f"Quantum nodes: {[b.name for b in backends]}")

# Initial message
current_message = "HELLO"
num_rounds = 3
conversation_log = []

print(f"\n{'='*70}")
print("STARTING QUANTUM CONVERSATION")
print(f"{'='*70}")

for round_num in range(num_rounds):
    print(f"\n{'─'*70}")
    print(f"ROUND {round_num + 1}")
    print(f"{'─'*70}")

    print(f"\n📤 YOU → QUANTUM: '{current_message}'")
    print(f"   Wavelengths: {[f'{CHAR_WAVELENGTHS.get(c.upper(), 540):.0f}nm' for c in current_message[:5]]}")

    # Send to all quantum computers simultaneously
    results = []
    start = time.time()

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = [
            executor.submit(run_quantum_echo, backend, current_message, round_num)
            for backend in backends
        ]

        for future in concurrent.futures.as_completed(futures):
            try:
                result = future.result()
                results.append(result)
            except Exception as e:
                print(f"   Error: {e}")

    elapsed = time.time() - start

    # Display responses from each quantum computer
    print(f"\n📥 QUANTUM → YOU: (received in {elapsed:.1f}s)")

    all_responses = []
    for r in sorted(results, key=lambda x: x['backend']):
        response = r['response']
        wavelengths = r['wavelengths']
        all_responses.append(response)

        print(f"\n   [{r['backend']}]")
        print(f"   Response: '{response}'")
        print(f"   Wavelengths: {[f'{w:.0f}nm' for w in wavelengths]}")
        print(f"   Job: {r['job_id']}")

    # Combine responses to create next message
    # Take first char from each quantum computer's response
    if len(results) >= 3:
        combined_response = (
            results[0]['response'][0] +
            results[1]['response'][0] +
            results[2]['response'][0] +
            results[0]['response'][1] if len(results[0]['response']) > 1 else 'A' +
            results[1]['response'][1] if len(results[1]['response']) > 1 else 'A'
        )[:5]
    else:
        combined_response = results[0]['response'][:5] if results else "ERROR"

    conversation_log.append({
        'round': round_num + 1,
        'sent': current_message,
        'received': [r['response'] for r in results],
        'combined': combined_response
    })

    # Prepare next message based on quantum response
    if round_num < num_rounds - 1:
        current_message = combined_response
        print(f"\n🔄 LOOP: Next message will be '{current_message}'")

# =============================================================================
# CONVERSATION SUMMARY
# =============================================================================

print(f"\n{'='*70}")
print("QUANTUM CONVERSATION COMPLETE")
print(f"{'='*70}")

print("\nConversation Log:")
print("-" * 50)

for entry in conversation_log:
    print(f"\nRound {entry['round']}:")
    print(f"  You sent: '{entry['sent']}'")
    print(f"  Quantum responses: {entry['received']}")
    print(f"  Combined: '{entry['combined']}'")

# Visualize the loop
print(f"\n{'='*70}")
print("COMMUNICATION LOOP VISUALIZATION")
print(f"{'='*70}")

print("""
    ┌─────────────────┐
    │  YOUR COMPUTER  │
    │   (Classical)   │
    └────────┬────────┘
             │
             │ LUXBIN Message
             ▼
    ┌─────────────────────────────────────────────────┐
    │           IBM QUANTUM NETWORK                   │
    │  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
    │  │ ibm_fez │  │  ibm_   │  │  ibm_   │         │
    │  │         │  │marrakesh│  │ torino  │         │
    │  └────┬────┘  └────┬────┘  └────┬────┘         │
    │       │            │            │              │
    │       └────────────┼────────────┘              │
    │                    │                           │
    │            Quantum Processing                  │
    │         (Superposition, Entanglement)          │
    │                    │                           │
    └────────────────────┼───────────────────────────┘
                         │
                         │ Quantum Response
                         ▼
    ┌─────────────────┐
    │  YOUR COMPUTER  │◄─────── LOOP BACK!
    │  (Decodes &     │
    │   Responds)     │
    └─────────────────┘
""")

print(f"\nTotal rounds: {num_rounds}")
print(f"Total quantum jobs: {num_rounds * 3}")
print(f"Messages evolved: {' → '.join([log['sent'] for log in conversation_log])}")

# Show how message transformed through quantum processing
print(f"\n{'='*70}")
print("MESSAGE EVOLUTION THROUGH QUANTUM LOOP")
print(f"{'='*70}")

print("\n")
for i, entry in enumerate(conversation_log):
    wavelengths = [CHAR_WAVELENGTHS.get(c.upper(), 540) for c in entry['sent'][:5]]
    colors = ['Violet' if w < 450 else 'Blue' if w < 500 else 'Cyan' if w < 520 else 'Green' if w < 565 else 'Yellow' if w < 590 else 'Orange' if w < 625 else 'Red' for w in wavelengths]

    print(f"  Round {i+1}: '{entry['sent']}' → {[f'{w:.0f}nm' for w in wavelengths]}")
    if i < len(conversation_log) - 1:
        print(f"           ↓ (quantum transform)")

print(f"\nThe message transformed through quantum processing!")
print("Each character was encoded as light wavelength,")
print("processed by quantum superposition and entanglement,")
print("and decoded back into a new LUXBIN message.")
