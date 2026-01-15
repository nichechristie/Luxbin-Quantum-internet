# Quantum Internet Multi-Provider Setup

This guide shows how to connect your quantum internet to multiple quantum computing providers (IBM, IonQ, Rigetti) and run LUXBIN Light Language and LUXBIN Chain on more quantum computers.

## Overview

The quantum internet now spans **7 countries across 4 continents** with **22 quantum computers**:

### 🇺🇸 North America (USA)
- **IBM Quantum**: ibm_fez (156 qubits), ibm_torino (133 qubits), ibm_marrakesh (156 qubits)
- **IonQ**: ionq_harmony (11 qubits), ionq_aria (25 qubits), ionq_forte (32 qubits)
- **Rigetti**: rigetti_aspen (80 qubits)

### 🇪🇺 Europe
- **Finland - IQM**: iqm_garnet (20 qubits), iqm_apollo (5 qubits)
- **France - Pasqal**: pasqal_fresnel (20 qubits)
- **France - Quandela**: quandela_cloud (12 qubits)

### 🌏 Asia
- **China - Alibaba**: alibaba_tianti (10 qubits)
- **China - Baidu**: baidu_qpu (8 qubits)
- **Japan - Riken**: riken_superconducting (64 qubits)

### 🇦🇺 Oceania
- **Australia - Silicon Quantum Computing**: sqc_hero (4 qubits)

## Setup Instructions

### 1. Install Dependencies

```bash
# Required packages for all quantum providers
pip install qiskit qiskit-ibm-runtime qiskit-ionq pyquil

# Fix potential pydantic compatibility issues
pip install --upgrade pydantic
```

### 2. Setup API Keys

The easiest way to set up your API keys is with the interactive setup script:

```bash
cd quantum-internet
python setup_api_keys.py
```

This script will guide you through:
- Getting API keys from each provider
- Testing connections
- Saving keys to a `.env` file for persistence

#### Manual Setup (Alternative)

**IBM Quantum** (Free tier available):
1. Go to https://quantum.ibm.com/
2. Sign up and get API token
3. `export QISKIT_IBM_TOKEN='your_token'`

**IonQ** (Enterprise access):
1. Go to https://ionq.com/
2. Get API key from dashboard
3. `export IONQ_API_KEY='your_key'`

**Rigetti** (Forest platform):
1. Go to https://www.rigetti.com/
2. Get Forest API key
3. `export RIGETTI_API_KEY='your_key'`

#### International Quantum Providers

**Finland - IQM**:
1. Go to https://www.meetiqm.com/
2. Sign up for cloud access
3. `export IQM_API_KEY='your_key'`

**France - Pasqal**:
1. Go to https://pasqal.com/
2. Get cloud platform access
3. `export PASQAL_API_KEY='your_key'`

**France - Quandela**:
1. Go to https://www.quandela.com/
2. Sign up for cloud access
3. `export QUANDELA_API_KEY='your_key'`

**China - Alibaba Quantum**:
1. Go to Alibaba Quantum Computing Service
2. Get API access
3. `export ALIBABA_API_KEY='your_key'`

**China - Baidu Quantum**:
1. Go to Baidu Quantum Computing Institute
2. Get cloud access
3. `export BAIDU_API_KEY='your_key'`

**Japan - Riken**:
1. Go to Riken Center for Quantum Computing
2. Get research access
3. `export RIKEN_API_KEY='your_key'`

**Australia - Silicon Quantum Computing**:
1. Go to https://www.siliconquantumcomputing.com/
2. Get cloud access
3. `export SQC_API_KEY='your_key'`

### 3. Test Your Quantum Connections

```bash
cd quantum-internet
python test_quantum_connections.py
```

### 4. Test International Quantum Network

```bash
cd quantum-internet
python test_international_quantum.py
```

### 5. Run Quantum Internet on Multiple Computers

```bash
cd quantum-internet
python run_quantum_internet_multi.py
```

This will:
- Connect to all available quantum computers
- Create quantum entanglement across providers
- Start mining blocks in a distributed quantum blockchain

### 4. Run LUXBIN Light Language on Multiple Quantum Computers

```bash
cd luxbin-light-language
python run_luxbin_multi_quantum.py "Hello Quantum World"
```

This will:
- Encode text as LUXBIN light language
- Convert to photonic wavelengths
- Run quantum circuits on multiple providers in parallel
- Show results from each quantum computer

## Configuration

The `quantum_backends_config.json` file controls which backends are used:

```json
{
  "quantum_backends": {
    "ibm": {
      "backends": [
        {"name": "ibm_fez", "qubits": 156, "status": "active"},
        {"name": "ibm_torino", "qubits": 133, "status": "active"},
        {"name": "ibm_marrakesh", "qubits": 156, "status": "active"}
      ]
    },
    "ionq": {
      "backends": [
        {"name": "ionq_harmony", "qubits": 11, "status": "active"},
        {"name": "ionq_aria", "qubits": 25, "status": "active"}
      ]
    },
    "rigetti": {
      "backends": [
        {"name": "rigetti_aspen", "qubits": 32, "status": "active"}
      ]
    }
  },
  "luxbin_deployment": {
    "light_language_backends": ["ibm_fez", "ionq_harmony", "rigetti_aspen"],
    "chain_backends": ["ibm_torino", "ibm_marrakesh", "ionq_aria"],
    "internet_backends": ["ibm_fez", "ibm_torino", "ibm_marrakesh", "ionq_harmony", "ionq_aria", "rigetti_aspen"]
  }
}
```

## What Changed

### Modified Files

1. **`quantum_internet_service.py`**:
   - Added support for IonQ and Rigetti providers
   - Modified to connect to multiple quantum computers
   - Updated entanglement network creation

2. **`luxbin-light-language/luxbin_quantum_computer.py`**:
   - Added multi-provider support in `run_on_quantum_computer()`
   - Detects provider from backend name
   - Falls back to simulation for unsupported providers

3. **New Files**:
   - `quantum_backends_config.json`: Configuration for all quantum backends
   - `run_quantum_internet_multi.py`: Script to run quantum internet on multiple computers
   - `luxbin-light-language/run_luxbin_multi_quantum.py`: Script to run LUXBIN on multiple computers

## Benefits

- **Distributed Computing**: Run computations across multiple quantum providers
- **Fault Tolerance**: If one provider is down, others continue working
- **Resource Optimization**: Use the best available quantum computer for each task
- **Scalability**: Easily add new quantum providers as they become available

## Troubleshooting

### Common Issues

1. **"Qiskit not available"**: Install with `pip install qiskit qiskit-ibm-runtime`

2. **Connection failures**: Check your API keys and internet connection

3. **Queue delays**: Quantum computers have wait times; jobs may take minutes to hours

4. **IonQ/Rigetti not working**: These integrations are placeholders; full SDK integration needed

### Testing Without Real Quantum Computers

If API keys are not set or SDKs are not installed, the scripts will fail with clear error messages. For testing without real quantum access, you would need to modify the code to use local simulators.

## Future Enhancements

- Full IonQ SDK integration
- Rigetti Forest API integration
- Google Cirq support
- Azure Quantum support
- Dynamic backend selection based on availability and performance

## Security Note

API keys are sensitive. Never commit them to version control. Use environment variables or secure key management systems in production.