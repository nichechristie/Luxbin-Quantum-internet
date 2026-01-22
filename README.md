# LUXBIN Quantum Internet

[![DOI](https://zenodo.org/badge/18198505.svg)](https://zenodo.org/doi/10.5281/zenodo.18198505)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Python library for exploring quantum internet concepts through cloud quantum computing and local simulation.

> **Press:** [Review by Brian Siegelwax](https://bsiegelwax.substack.com/p/luxbin-quantum-internet) - "It's not what it says it is, but it's not nothing."

## What This Project Actually Is

LUXBIN Quantum Internet is an **educational and experimental toolkit** that:

- Provides a high-level Python interface to **IBM Quantum cloud computers**
- Implements **quantum entanglement protocols** (Bell pairs, GHZ states, teleportation)
- Includes **local simulations** of NV-center and photonic quantum systems
- Demonstrates concepts that would be used in future quantum networks

### What This Project Is NOT

To be transparent:

- **Not a quantum internet** - Uses classical internet (HTTPS) to access cloud quantum APIs
- **Not quantum networking hardware** - No physical quantum channels or repeaters
- **Not persistent entanglement** - Entanglement is created per-circuit-execution, not maintained
- **NV-center/photonic modules are simulations** - Software models, not hardware interfaces

## Features

### Cloud Quantum Access
Connect to IBM Quantum's cloud-accessible quantum computers via their public API.

```python
from luxbin.quantum.operations import QuantumRNG
from luxbin.quantum.entanglement import BellPairGenerator

# Generate random bits on quantum hardware (or simulator fallback)
rng = QuantumRNG()
random_bits = await rng.generate_random_bits(8)

# Create entangled Bell pairs
bell_gen = BellPairGenerator()
result = await bell_gen.create_bell_pair()
print(f"Fidelity: {result.fidelity}")
```

### Entanglement Protocol Implementations (EIPs)

Educational implementations of quantum protocols:

| Protocol | Description | Hardware/Simulation |
|----------|-------------|---------------------|
| **EIP-001** | NV-Center Entanglement | Simulation only |
| **EIP-002** | Bell Pair Generation | Runs on IBM Quantum |
| **EIP-003** | GHZ State Generation | Runs on IBM Quantum |
| **EIP-004** | Quantum Teleportation | Runs on IBM Quantum |

### NV-Center Simulation

Software simulation of nitrogen-vacancy center physics for educational purposes:

```python
from luxbin.quantum.photonics.nv_center import NVCenterControl

# This is a SIMULATION - not connected to real hardware
control = NVCenterControl("diamond_001")
control.register_nv_center("nv1", (100, 200, 50), (0, 0, 45))
fluorescence = control.optical_excitation("nv1", laser_power=50.0)
```

### Photonic Circuit Simulation

Model linear optical quantum circuits locally:

```python
from luxbin.quantum.photonics.circuits import PhotonicCircuit, BeamSplitter

# Local simulation of photonic components
circuit = PhotonicCircuit("interferometer")
bs = BeamSplitter("BS1", reflectivity=0.5)
circuit.add_component(bs)
```

## Installation

### Prerequisites
- Python 3.10+
- IBM Quantum account (free) for hardware access

### Install

```bash
git clone https://github.com/nichechristie/Luxbin-Quantum-internet.git
cd Luxbin-Quantum-internet
pip install -e ".[all]"
```

### Optional Dependencies

```bash
pip install -e ".[quantum]"    # IBM Quantum access
pip install -e ".[photonics]"  # Photonic simulations
pip install -e ".[dev]"        # Development tools
```

## Configuration

Create a `.env` file with your IBM Quantum token:

```env
QISKIT_IBM_TOKEN=your_ibm_token_here
```

Get a free token at [quantum.ibm.com](https://quantum.ibm.com)

## Running on Quantum Hardware

```bash
# Run Bell pair protocol on IBM Quantum
python run_eip_on_quantum.py EIP-002

# Run on local simulator (no token needed)
python run_eip_on_quantum.py EIP-002 --simulator
```

## Testing

```bash
pip install -e ".[dev]"
pytest
```

## How It Works

```
┌─────────────────┐     Classical Internet     ┌──────────────────┐
│  LUXBIN Client  │ ──────── HTTPS ──────────► │  IBM Quantum API │
│  (Your Computer)│                            │  (Cloud Service) │
└─────────────────┘                            └──────────────────┘
        │                                               │
        ▼                                               ▼
┌─────────────────┐                            ┌──────────────────┐
│ Local Simulation│                            │ Quantum Hardware │
│ - NV-centers    │                            │ - Real qubits    │
│ - Photonics     │                            │ - Real gates     │
└─────────────────┘                            └──────────────────┘
```

**This is NOT a quantum network.** It's a classical client that submits quantum circuits to cloud services.

## API Reference

### Quantum Operations
- `QuantumRNG` - Quantum random number generation
- `BellPairGenerator` - Create Bell entangled pairs
- `GHZStateGenerator` - Generate GHZ states with entropy measurement
- `QuantumTeleportation` - Quantum state teleportation protocol

### Simulated Components
- `NVCenterControl` - Simulated NV-center manipulation
- `PhotonicCircuit` - Simulated linear optical circuits
- `BeamSplitter` - Simulated optical beam splitting
- `PhaseShifter` - Simulated optical phase manipulation

## Why "Quantum Internet"?

The name reflects the project's **aspirational goal**: exploring and implementing the protocols that would be used in a future quantum internet. The actual quantum internet will require:

- Physical quantum channels (fiber optics or free-space)
- Quantum repeaters
- Persistent entanglement distribution
- Specialized hardware (NV-centers, trapped ions, etc.)

This project simulates and studies these concepts using today's available tools: cloud quantum computers and local simulation.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add your feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file.

## Acknowledgments

- IBM Quantum for cloud quantum computer access
- The quantum computing research community
- Brian Siegelwax for the honest review

## Related Projects

- [Quantum AI](https://github.com/nichechristie/quantum-ai)
- [Quantum Wallet Security](https://github.com/nichechristie/quantum-wallet-security)
- [QuantumGameDevAI](https://github.com/Nichechristie/QuantumGameDevAI)

## Contact

- **GitHub Issues**: [Report bugs](https://github.com/nichechristie/Luxbin-Quantum-internet/issues)
- **Email**: nichole@nicheai.com

---

*Exploring quantum internet concepts through cloud computing and simulation*
