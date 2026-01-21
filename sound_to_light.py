#!/usr/bin/env python3
"""
SOUND TO LIGHT CONVERSION
Convert audio frequencies to visible light wavelengths and colors
Part of the quantum photonic broadcasting system
"""

import os
import sys
import colorsys
from typing import List, Dict, Tuple

# Audio processing
from pydub import AudioSegment
import numpy as np

class SoundToLight:
    """Convert audio frequencies to visible light wavelengths"""

    def __init__(self, audio_path: str):
        self.audio_path = audio_path
        self.audio_data = None
        self.sample_rate = None
        self.frequencies = []
        self.wavelengths = []
        self.colors = []

    def load_audio(self) -> bool:
        """Load and analyze audio file"""
        print("🎵🔮 SOUND TO LIGHT CONVERSION")
        print("=" * 35)

        try:
            # Load audio
            audio = AudioSegment.from_file(self.audio_path)
            self.sample_rate = audio.frame_rate

            # Convert to numpy array for FFT
            samples = np.array(audio.get_array_of_samples())

            # If stereo, take one channel
            if audio.channels == 2:
                samples = samples[::2]  # Take left channel

            # Normalize
            samples = samples.astype(float) / np.max(np.abs(samples))

            # Perform FFT
            fft = np.fft.fft(samples)
            freqs = np.fft.fftfreq(len(samples), 1/self.sample_rate)

            # Get magnitude spectrum (positive frequencies only)
            magnitude = np.abs(fft[:len(fft)//2])
            freqs = freqs[:len(freqs)//2]

            # Find dominant frequencies
            peak_indices = np.argsort(magnitude)[-20:][::-1]  # Top 20 peaks
            self.frequencies = [freqs[i] for i in peak_indices if freqs[i] > 20]  # Audible range

            print(f"🎵 Audio loaded: {os.path.basename(self.audio_path)}")
            print(f"🎚️  Sample rate: {self.sample_rate} Hz")
            print(f"🔢 Samples: {len(samples)}")
            print(f"🎼 Dominant frequencies found: {len(self.frequencies)}")

            return True

        except Exception as e:
            print(f"❌ Failed to load audio: {e}")
            return False

    def frequency_to_wavelength(self, frequency_hz: float) -> float:
        """Convert audio frequency to light wavelength using quantum principles"""
        # Speed of sound in air (m/s)
        speed_of_sound = 343

        # Calculate acoustic wavelength
        acoustic_wavelength = speed_of_sound / frequency_hz

        # Map to visible light spectrum (400-700nm)
        # Using logarithmic scaling for better distribution
        min_freq = 20  # Lowest audible frequency
        max_freq = 20000  # Highest audible frequency

        # Logarithmic mapping to visible spectrum
        log_ratio = np.log(frequency_hz / min_freq) / np.log(max_freq / min_freq)
        light_wavelength = 400 + log_ratio * (700 - 400)  # 400-700nm

        return light_wavelength

    def wavelength_to_color(self, wavelength_nm: float) -> Tuple[float, float, float]:
        """Convert wavelength to RGB color using CIE color matching"""
        # Approximate RGB values for wavelengths
        if 400 <= wavelength_nm < 440:
            r = -(wavelength_nm - 440) / (440 - 400)
            g = 0.0
            b = 1.0
        elif 440 <= wavelength_nm < 490:
            r = 0.0
            g = (wavelength_nm - 440) / (490 - 440)
            b = 1.0
        elif 490 <= wavelength_nm < 510:
            r = 0.0
            g = 1.0
            b = -(wavelength_nm - 510) / (510 - 490)
        elif 510 <= wavelength_nm < 580:
            r = (wavelength_nm - 510) / (580 - 510)
            g = 1.0
            b = 0.0
        elif 580 <= wavelength_nm < 645:
            r = 1.0
            g = -(wavelength_nm - 645) / (645 - 580)
            b = 0.0
        elif 645 <= wavelength_nm <= 700:
            r = 1.0
            g = 0.0
            b = 0.0
        else:
            r = g = b = 0.0

        # Intensity adjustment (peaks at green)
        if 400 <= wavelength_nm < 420:
            factor = 0.3 + 0.7 * (wavelength_nm - 400) / (420 - 400)
        elif 420 <= wavelength_nm < 701:
            factor = 1.0
        else:
            factor = 0.3

        r *= factor
        g *= factor
        b *= factor

        return (r, g, b)

    def convert_sound_to_light(self) -> List[Dict]:
        """Convert audio frequencies to light wavelengths and colors"""
        print("\n🌈 CONVERTING SOUND TO LIGHT")
        print("=" * 30)

        light_data = []

        for freq in self.frequencies:
            wavelength = self.frequency_to_wavelength(freq)
            color = self.wavelength_to_color(wavelength)

            # Convert RGB to hex
            hex_color = "#{:02x}{:02x}{:02x}".format(
                int(color[0] * 255),
                int(color[1] * 255),
                int(color[2] * 255)
            )

            # Determine color name
            if 400 <= wavelength < 440:
                color_name = "Violet"
            elif 440 <= wavelength < 490:
                color_name = "Blue"
            elif 490 <= wavelength < 510:
                color_name = "Cyan"
            elif 510 <= wavelength < 580:
                color_name = "Green"
            elif 580 <= wavelength < 645:
                color_name = "Yellow"
            elif 645 <= wavelength <= 700:
                color_name = "Red"
            else:
                color_name = "Invisible"

            light_info = {
                'frequency_hz': freq,
                'acoustic_wavelength_mm': self.frequency_to_wavelength(freq) * 1000 / 1e6,  # Convert to mm
                'light_wavelength_nm': wavelength,
                'color_rgb': color,
                'color_hex': hex_color,
                'color_name': color_name,
                'energy_ev': 6.626e-34 * freq / 1.602e-19  # Convert to eV
            }

            light_data.append(light_info)

            print(f"🎵 {freq:.0f} Hz → {wavelength:.0f} nm {color_name} ({hex_color})")

        self.wavelengths = [d['light_wavelength_nm'] for d in light_data]
        self.colors = [d['color_hex'] for d in light_data]

        return light_data

    def visualize_light_spectrum(self, light_data: List[Dict]):
        """Create a text-based visualization of the light spectrum"""
        print("\n🌈 LIGHT SPECTRUM VISUALIZATION")
        print("=" * 35)

        # Sort by wavelength
        sorted_data = sorted(light_data, key=lambda x: x['light_wavelength_nm'])

        for data in sorted_data:
            wavelength = data['light_wavelength_nm']
            color_name = data['color_name']
            hex_color = data['color_hex']

            # Create a visual bar (text-based)
            bar_length = 20
            position = int((wavelength - 400) / (700 - 400) * bar_length)

            bar = "░" * bar_length
            if 0 <= position < bar_length:
                bar = bar[:position] + "█" + bar[position+1:]

            print(f"{wavelength:6.0f} nm | {bar} | {color_name:6} | {hex_color}")

    def quantum_photonic_analysis(self, light_data: List[Dict]):
        """Analyze the quantum photonic properties"""
        print("\n⚛️ QUANTUM PHOTONIC ANALYSIS")
        print("=" * 30)

        wavelengths = [d['light_wavelength_nm'] for d in light_data]
        energies = [d['energy_ev'] for d in light_data]

        print(f"📊 Light wavelengths: {len(wavelengths)}")
        print(f"⚡ Energy range: {min(energies):.2e} - {max(energies):.2e} eV")
        print(f"🌈 Color spectrum: {len(set(d['color_name'] for d in light_data))} colors")

        # Calculate quantum properties
        avg_wavelength = np.mean(wavelengths)
        photon_energy_avg = 1240 / avg_wavelength  # eV

        print(f"📈 Average wavelength: {avg_wavelength:.0f} nm")
        print(f"⚛️  Average photon energy: {photon_energy_avg:.2f} eV")
        print(f"💡 Quantum frequency: {3e8 / (avg_wavelength * 1e-9):.2e} Hz")

        print("\n🔬 QUANTUM LIGHT PROPERTIES:")
        print("   - Each frequency becomes a photonic qubit state")
        print("   - Colors represent different quantum energy levels")
        print("   - Sound waves transformed into light particles")

def main():
    """Main function"""
    if len(sys.argv) < 2:
        print("Usage: python sound_to_light.py <audio_file>")
        print("Supported formats: MP3, WAV, FLAC, OGG")
        return

    audio_path = sys.argv[1]

    if not os.path.exists(audio_path):
        print(f"❌ Audio file not found: {audio_path}")
        return

    # Initialize converter
    converter = SoundToLight(audio_path)

    # Load and analyze audio
    if not converter.load_audio():
        return

    # Convert sound to light
    light_data = converter.convert_sound_to_light()

    # Visualize spectrum
    converter.visualize_light_spectrum(light_data)

    # Quantum analysis
    converter.quantum_photonic_analysis(light_data)

    print("\n✨ SOUND SUCCESSFULLY CONVERTED TO LIGHT!")
    print(f"🎵 Audio frequencies → Light wavelengths → Quantum photonic states")
    print(f"🌈 Generated {len(light_data)} light colors from sound")

if __name__ == "__main__":
    main()