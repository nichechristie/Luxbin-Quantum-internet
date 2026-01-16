<p align="center">
  <a href="https://mermaidnicheboutique-code.github.io/quantum-internet/">View in 133 Languages</a>
</p>

<p align="center">
  <b>Translate:</b><br>
  <a href="https://translate.google.com/translate?sl=en&tl=es&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Espanol</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=fr&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Francais</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=de&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Deutsch</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=it&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Italiano</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=pt&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Portugues</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=ru&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Russkiy</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=zh-CN&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Chinese</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=ja&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Japanese</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=ko&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Korean</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=ar&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Arabic</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=hi&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Hindi</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=bn&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Bengali</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=vi&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Vietnamese</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=th&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Thai</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=id&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Indonesian</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=ms&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Malay</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=tl&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Filipino</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=tr&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Turkish</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=pl&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Polski</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=nl&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Nederlands</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=uk&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Ukrainian</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=el&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Greek</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=he&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Hebrew</a> |
  <a href="https://translate.google.com/translate?sl=en&tl=sw&u=https://github.com/mermaidnicheboutique-code/quantum-internet">Swahili</a>
</p>

---

# LUXBIN Quantum Internet

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.18198505.svg)](https://doi.org/10.5281/zenodo.18198505)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The world's first international quantum internet with AI agents running over consumer WiFi. This project presents a functional quantum internet infrastructure connecting 12+ quantum computers across 4 countries (USA, France, Finland, Australia) using consumer WiFi networks.

## Key Technical Specifications

| Metric | Value |
|--------|-------|
| **Total Qubits** | 803 distributed across providers |
| **Entanglement Pairs** | 91 in fully-connected mesh |
| **Countries Connected** | 4 (USA, France, Finland, Australia) |
| **Quantum Computers** | 12+ integrated systems |
| **Operation Latency** | Sub-2-second quantum operations |

### Quantum Provider Integration

- **IBM Quantum**: 445 qubits across 3 systems
- **IonQ**: 68 qubits (trapped-ion technology)
- **Rigetti**: 80 qubits
- **Quandela, Pasqal, IQM, Silicon Quantum Computing**: Additional systems

## Operational Features

- Quantum measurement and state preparation
- Bell pair creation between heterogeneous quantum systems
- Quantum teleportation over classical WiFi channels
- Multi-provider orchestration through unified interfaces
- REST API accessible via `localhost:8765`
- Simulation fallback mode without quantum hardware access

## AI Agents

Four AI agents deployed across international locations:

| Agent | Specialization | Region |
|-------|---------------|--------|
| **Aurora** | Creative tasks | Global |
| **Atlas** | Optimization | Global |
| **Ian** | Communication | Global |
| **Morgan** | Analytics | Global |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/mermaidnicheboutique-code/quantum-internet.git
cd quantum-internet

# Install dependencies
pip install -r requirements.txt

# Start the quantum server
python quantum_server.py

# Access at localhost:8765
```

**Setup time:** ~2 minutes | **Runs on:** Any computer with Python 3.8+

## Architecture

```
                    +------------------+
                    |   WiFi Network   |
                    |  (Classical)     |
                    +--------+---------+
                             |
         +-------------------+-------------------+
         |                   |                   |
+--------v-------+  +--------v-------+  +--------v-------+
|  IBM Quantum   |  |     IonQ       |  |    Rigetti     |
|  445 qubits    |  |   68 qubits    |  |   80 qubits    |
+----------------+  +----------------+  +----------------+
         |                   |                   |
         +-------------------+-------------------+
                             |
                    +--------v---------+
                    | Entanglement     |
                    | Mesh (91 pairs)  |
                    +------------------+
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Citation

```bibtex
@software{luxbin_quantum_internet,
  author = {LUXBIN},
  title = {Quantum Internet Infrastructure},
  year = {2025},
  doi = {10.5281/zenodo.18198505}
}
```

---

<p align="center">
  <b>Not a simulation.</b> Real quantum infrastructure over consumer WiFi.
</p>
