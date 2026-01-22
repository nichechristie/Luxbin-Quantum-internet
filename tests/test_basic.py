"""
Basic tests for LUXBIN Quantum Internet

These tests verify that the core modules can be imported and basic functionality works.
"""

import pytest


def test_photonic_imports():
    """Test that photonic modules can be imported without errors"""
    try:
        from luxbin.quantum.photonics.nv_center import NVCenterControl, NVState, PulseSequence
        from luxbin.quantum.photonics.circuits import PhotonicCircuit, BeamSplitter, PhaseShifter, PhotonicMode
        # Just check they exist
        assert NVCenterControl is not None
        assert PhotonicCircuit is not None
        assert BeamSplitter is not None
        assert PhaseShifter is not None
        assert PhotonicMode is not None
    except ImportError as e:
        pytest.fail(f"Failed to import photonic modules: {e}")


def test_quantum_operations_import():
    """Test that main quantum operations can be imported"""
    try:
        from luxbin.quantum.operations import QuantumRNG, QuantumMetrics
        from luxbin.quantum.entanglement import BellPairGenerator, GHZStateGenerator
        assert QuantumRNG is not None
        assert BellPairGenerator is not None
        assert GHZStateGenerator is not None
    except ImportError as e:
        pytest.fail(f"Failed to import quantum operations: {e}")


def test_nv_center_basic():
    """Test basic NV center functionality"""
    from luxbin.quantum.photonics.nv_center import NVCenterControl, NVState

    # Create NV center control
    control = NVCenterControl("test_diamond")

    # Register an NV center
    control.register_nv_center("nv1", (0, 0, 0), (0, 0, 0))

    # Check it was registered
    assert len(control.list_nv_centers()) == 1
    assert "nv1" in control.list_nv_centers()

    # Get state
    state = control.get_nv_state("nv1")
    assert state is not None
    assert state.charge_state == "neutral"
    assert state.spin_state == "ms=0"


def test_photonic_circuit_basic():
    """Test basic photonic circuit functionality"""
    from luxbin.quantum.photonics.circuits import PhotonicCircuit, BeamSplitter, PhotonicMode

    # Create a simple circuit
    circuit = PhotonicCircuit("test_circuit")

    # Add a beam splitter
    bs = BeamSplitter("BS1", reflectivity=0.5)
    circuit.add_component(bs)

    # Set I/O
    circuit.set_inputs(["input1", "input2"])
    circuit.set_outputs(["output1", "output2"])

    # Create input modes
    input_modes = {
        "input1": PhotonicMode("input1", 3e8/532e-9, "H", 1.0+0j, 0),
        "input2": PhotonicMode("input2", 3e8/532e-9, "H", 0.0+0j, 0)
    }

    # Simulate (this should not crash)
    result = circuit.simulate(input_modes)
    assert isinstance(result, dict)


def test_package_import():
    """Test that the main package can be imported"""
    try:
        import luxbin
        assert luxbin is not None

        import luxbin.quantum
        assert luxbin.quantum is not None

    except ImportError as e:
        pytest.fail(f"Failed to import main package: {e}")


def test_eip_implementations():
    """Test that EIP implementations can be imported and basic functionality works"""
    try:
        from eip_implementations import LUXBINEIPImplementations

        # Create instance
        eip = LUXBINEIPImplementations()

        # Test EIP-002 (Bell pair)
        qc, desc = eip.eip_002_bell_pair()
        assert qc is not None
        assert "Bell Pair" in desc

        # Test EIP-003 (GHZ state)
        qc2, desc2 = eip.eip_003_ghz_state(n_qubits=3)
        assert qc2 is not None
        assert "GHZ" in desc2

    except ImportError as e:
        pytest.fail(f"Failed to import or use EIP implementations: {e}")