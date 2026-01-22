"""
LUXBIN Photonic Quantum Circuits

Implementation of photonic quantum circuits including beam splitters,
phase shifters, and measurement devices for quantum information processing.
"""

from dataclasses import dataclass
from typing import Dict, List, Any, Optional, Tuple
from abc import ABC, abstractmethod
import numpy as np
import math


@dataclass
class PhotonicMode:
    """Represents a photonic mode in a circuit"""
    mode_id: str
    frequency: float  # Frequency in Hz
    polarization: str  # "H", "V", or "D" (diagonal)
    amplitude: complex
    phase: float  # Phase in radians


class PhotonicComponent(ABC):
    """Base class for photonic circuit components"""

    def __init__(self, name: str):
        self.name = name
        self.input_ports: List[str] = []
        self.output_ports: List[str] = []
        self.transformation_matrix: Optional[np.ndarray] = None

    @abstractmethod
    def apply_transformation(self, input_modes: Dict[str, PhotonicMode]) -> Dict[str, PhotonicMode]:
        """Apply the component's transformation to input photonic modes"""
        pass

    def get_transfer_matrix(self) -> np.ndarray:
        """Get the transfer matrix for this component"""
        return self.transformation_matrix


class BeamSplitter(PhotonicComponent):
    """
    Beam splitter component

    Splits input light between two output ports with specified reflectivity.
    """

    def __init__(self, name: str, reflectivity: float = 0.5, phase_difference: float = 0.0):
        """
        Args:
            name: Component name
            reflectivity: Fraction of light reflected (0-1)
            phase_difference: Phase difference between reflected/transmitted beams
        """
        super().__init__(name)
        self.reflectivity = reflectivity
        self.transmissivity = 1.0 - reflectivity
        self.phase_difference = phase_difference

        # Beam splitter matrix (for two modes)
        r = math.sqrt(reflectivity)
        t = math.sqrt(self.transmissivity)
        phi = phase_difference

        self.transformation_matrix = np.array([
            [r, t * np.exp(1j * phi)],
            [t * np.exp(1j * phi), -r]
        ])

        self.input_ports = ["input1", "input2"]
        self.output_ports = ["output1", "output2"]

    def apply_transformation(self, input_modes: Dict[str, PhotonicMode]) -> Dict[str, PhotonicMode]:
        """Apply beam splitter transformation"""
        # Get input amplitudes
        amp1 = input_modes.get("input1", PhotonicMode("input1", 0, "H", 0+0j, 0)).amplitude
        amp2 = input_modes.get("input2", PhotonicMode("input2", 0, "H", 0+0j, 0)).amplitude

        input_vector = np.array([amp1, amp2])

        # Apply transformation
        output_vector = self.transformation_matrix @ input_vector

        # Create output modes
        output_modes = {}
        for i, port in enumerate(self.output_ports):
            output_modes[port] = PhotonicMode(
                mode_id=port,
                frequency=input_modes.get("input1", PhotonicMode("", 0, "", 0, 0)).frequency,
                polarization=input_modes.get("input1", PhotonicMode("", "", "H", 0, 0)).polarization,
                amplitude=output_vector[i],
                phase=np.angle(output_vector[i])
            )

        return output_modes


class PhaseShifter(PhotonicComponent):
    """
    Phase shifter component

    Introduces a controllable phase shift to a photonic mode.
    """

    def __init__(self, name: str, phase_shift: float = 0.0):
        """
        Args:
            name: Component name
            phase_shift: Phase shift in radians
        """
        super().__init__(name)
        self.phase_shift = phase_shift

        # Phase shifter matrix (single mode)
        self.transformation_matrix = np.array([[np.exp(1j * phase_shift)]])

        self.input_ports = ["input"]
        self.output_ports = ["output"]

    def apply_transformation(self, input_modes: Dict[str, PhotonicMode]) -> Dict[str, PhotonicMode]:
        """Apply phase shift transformation"""
        input_mode = input_modes.get("input", PhotonicMode("input", 0, "H", 0+0j, 0))

        # Apply phase shift
        new_amplitude = input_mode.amplitude * np.exp(1j * self.phase_shift)

        output_mode = PhotonicMode(
            mode_id="output",
            frequency=input_mode.frequency,
            polarization=input_mode.polarization,
            amplitude=new_amplitude,
            phase=input_mode.phase + self.phase_shift
        )

        return {"output": output_mode}

    def set_phase(self, phase: float) -> None:
        """Set the phase shift"""
        self.phase_shift = phase
        self.transformation_matrix = np.array([[np.exp(1j * phase)]])


class PhotonicCircuit:
    """
    Photonic quantum circuit composed of multiple components.

    Allows building complex optical circuits for quantum information processing.
    """

    def __init__(self, name: str):
        self.name = name
        self.components: Dict[str, PhotonicComponent] = {}
        self.connections: Dict[str, str] = {}  # output_port -> input_port
        self.input_modes: List[str] = []
        self.output_modes: List[str] = []

    def add_component(self, component: PhotonicComponent) -> None:
        """Add a component to the circuit"""
        self.components[component.name] = component

    def connect(self, from_component: str, from_port: str,
               to_component: str, to_port: str) -> None:
        """Connect output port of one component to input port of another"""
        from_key = f"{from_component}:{from_port}"
        to_key = f"{to_component}:{to_port}"
        self.connections[from_key] = to_key

    def set_inputs(self, input_mode_names: List[str]) -> None:
        """Set the input modes for the circuit"""
        self.input_modes = input_mode_names

    def set_outputs(self, output_mode_names: List[str]) -> None:
        """Set the output modes for the circuit"""
        self.output_modes = output_mode_names

    def simulate(self, input_modes: Dict[str, PhotonicMode]) -> Dict[str, PhotonicMode]:
        """
        Simulate the photonic circuit

        Args:
            input_modes: Dictionary of input photonic modes

        Returns:
            Dictionary of output photonic modes
        """
        # Initialize mode states
        mode_states: Dict[str, PhotonicMode] = dict(input_modes)

        # Process components in topological order
        # (Simplified - assumes no cycles)
        processed_components = set()

        while len(processed_components) < len(self.components):
            for comp_name, component in self.components.items():
                if comp_name in processed_components:
                    continue

                # Check if all inputs are ready
                inputs_ready = True
                comp_inputs = {}

                for input_port in component.input_ports:
                    input_key = f"{comp_name}:{input_port}"
                    source_key = None

                    # Find which output connects to this input
                    for from_key, to_key in self.connections.items():
                        if to_key == input_key:
                            source_key = from_key
                            break

                    if source_key and source_key in mode_states:
                        comp_inputs[input_port] = mode_states[source_key]
                    elif input_port in self.input_modes and input_port in input_modes:
                        comp_inputs[input_port] = input_modes[input_port]
                    else:
                        inputs_ready = False
                        break

                if inputs_ready:
                    # Apply component transformation
                    outputs = component.apply_transformation(comp_inputs)

                    # Store output modes
                    for output_port, mode in outputs.items():
                        output_key = f"{comp_name}:{output_port}"
                        mode_states[output_key] = mode

                    processed_components.add(comp_name)

        # Collect final outputs
        final_outputs = {}
        for output_name in self.output_modes:
            # Find the component and port that provides this output
            for comp_name, component in self.components.items():
                for output_port in component.output_ports:
                    if output_port == output_name:
                        output_key = f"{comp_name}:{output_port}"
                        if output_key in mode_states:
                            final_outputs[output_name] = mode_states[output_key]

        return final_outputs

    def get_circuit_matrix(self) -> np.ndarray:
        """
        Get the overall transfer matrix for the entire circuit

        Returns:
            Transfer matrix relating inputs to outputs
        """
        # Simplified implementation - assumes linear optics
        # Real implementation would need to compose all component matrices
        n_inputs = len(self.input_modes)
        n_outputs = len(self.output_modes)

        # Placeholder identity matrix
        return np.eye(max(n_inputs, n_outputs), dtype=complex)


class QuantumPhotonicInterferometer(PhotonicCircuit):
    """
    Mach-Zehnder interferometer for quantum photonic experiments.

    Used for quantum interference experiments and quantum sensing.
    """

    def __init__(self, name: str, phase_shift: float = 0.0):
        super().__init__(name)

        # Create components
        bs1 = BeamSplitter("BS1", reflectivity=0.5)
        bs2 = BeamSplitter("BS2", reflectivity=0.5)
        ps = PhaseShifter("PS", phase_shift=phase_shift)

        # Add components
        self.add_component(bs1)
        self.add_component(bs2)
        self.add_component(ps)

        # Connect components
        self.connect("BS1", "output1", "PS", "input")
        self.connect("PS", "output", "BS2", "input1")
        self.connect("BS1", "output2", "BS2", "input2")

        # Set I/O
        self.set_inputs(["input"])
        self.set_outputs(["output1", "output2"])

    def set_phase_shift(self, phase: float) -> None:
        """Set the phase shift in the interferometer"""
        ps = self.components.get("PS")
        if isinstance(ps, PhaseShifter):
            ps.set_phase(phase)


# Utility functions

def create_bell_state_preparation_circuit() -> PhotonicCircuit:
    """
    Create a photonic circuit for preparing Bell states using linear optics.

    This implements the basic setup for photonic entanglement generation.
    """
    circuit = PhotonicCircuit("Bell_Preparation")

    # Single photon source would be added here in real implementation
    # For now, this is a placeholder showing the circuit structure

    bs = BeamSplitter("PBS", reflectivity=0.5)  # Polarizing beam splitter
    circuit.add_component(bs)

    circuit.set_inputs(["photon_input"])
    circuit.set_outputs(["output_H", "output_V"])

    return circuit


def simulate_homodyne_measurement(mode: PhotonicMode, local_oscillator_phase: float = 0.0) -> Tuple[float, float]:
    """
    Simulate homodyne measurement of a photonic mode.

    Args:
        mode: Photonic mode to measure
        local_oscillator_phase: Phase of local oscillator

    Returns:
        Tuple of (amplitude, phase) measurements
    """
    # Homodyne detection mixes signal with strong local oscillator
    lo_amplitude = 100.0  # Strong LO field
    lo_field = lo_amplitude * np.exp(1j * local_oscillator_phase)

    # Interference
    total_field = mode.amplitude + lo_field

    # Detection (simplified - real homodyne involves balanced detection)
    measured_amplitude = abs(total_field)
    measured_phase = np.angle(total_field)

    return measured_amplitude, measured_phase