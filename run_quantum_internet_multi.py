#!/usr/bin/env python3
"""
Quantum Internet Multi-Computer Runner
Connect and run the quantum internet across multiple quantum computing providers

This script:
1. Initializes quantum internet service
2. Connects to IBM, IonQ, and Rigetti quantum computers
3. Creates entangled quantum network across providers
4. Runs distributed quantum blockchain

Author: Quantum Internet Team
"""

import asyncio
import json
import os
import sys
from typing import Dict, Any
import time

from quantum_internet_service import QuantumInternetService

class MultiProviderQuantumInternet:
    """Run quantum internet across multiple providers"""

    def __init__(self, config_path: str = "quantum_backends_config.json"):
        self.config_path = config_path
        self.service = None

    async def initialize_and_run(self):
        """Initialize quantum internet service and run across multiple providers"""
        print("🌐 QUANTUM INTERNET MULTI-PROVIDER SERVICE")
        print("=" * 55)
        print()

        # Step 1: Initialize service
        print("🔧 Step 1: Initializing Quantum Internet Service...")
        self.service = QuantumInternetService()
        print("   Service created with support for:")
        for name, node in self.service.nodes.items():
            print(f"   - {name}: {node.num_qubits} qubits ({node.provider})")
        print()

        # Step 2: Connect to quantum providers
        print("🔌 Step 2: Connecting to quantum computing providers...")
        start_time = time.time()
        success = await self.service.initialize_quantum_service()
        connection_time = time.time() - start_time

        if success:
            print(".2f")
            active_nodes = [name for name, node in self.service.nodes.items() if node.status == 'active']
            print(f"   Connected to {len(active_nodes)} quantum computers")
            for name in active_nodes:
                node = self.service.nodes[name]
                print(f"   ✅ {name}: {node.num_qubits} qubits")
        else:
            print("   ⚠️  Some connections failed, continuing with available backends")
        print()

        # Step 3: Create quantum entanglement network
        if success:
            print("🔗 Step 3: Creating quantum entanglement network...")
            await self.service.create_quantum_entanglement_network()
            print()

        # Step 4: Start mining blocks
        print("⛏️  Step 4: Starting distributed quantum mining...")
        print("   (Press Ctrl+C to stop)")
        print()

        try:
            block_count = 0
            while True:
                # Mine a block
                block = await self.service.mine_block()
                block_count += 1

                print(f"✅ Block #{block_count} mined!")
                print(f"   Hash: {block['hash'][:16]}...")
                transactions = block.get('transactions', [])
                if isinstance(transactions, list):
                    print(f"   Transactions: {len(transactions)}")
                else:
                    print(f"   Transactions: {transactions}")
                print(f"   Timestamp: {block['timestamp']}")
                print()

                # Wait before mining next block
                await asyncio.sleep(5)

        except KeyboardInterrupt:
            print("\n⏹️  Quantum mining stopped by user")
            print(f"   Total blocks mined: {block_count}")

        return {
            "success": success,
            "active_nodes": len([n for n in self.service.nodes.values() if n.status == 'active']),
            "blocks_mined": block_count,
            "connection_time": connection_time
        }

async def main():
    """Main function"""
    # Set environment variables for API keys (you'll need to set these)
    # os.environ['QISKIT_IBM_TOKEN'] = 'your_ibm_token'
    # os.environ['IONQ_API_KEY'] = 'your_ionq_key'
    # os.environ['RIGETTI_API_KEY'] = 'your_rigetti_key'

    print("⚠️  Make sure to set your API keys:")
    print("   export QISKIT_IBM_TOKEN='your_ibm_token'")
    print("   export IONQ_API_KEY='your_ionq_key'  (optional)")
    print("   export RIGETTI_API_KEY='your_rigetti_key'  (optional)")
    print()

    runner = MultiProviderQuantumInternet()

    try:
        results = await runner.initialize_and_run()
        print("\n📊 SESSION SUMMARY")
        print("=" * 20)
        print(f"Active quantum computers: {results['active_nodes']}")
        print(f"Blocks mined: {results['blocks_mined']}")
        print(".2f")

        if results['success']:
            print("🎉 Quantum internet session completed successfully!")
        else:
            print("⚠️  Session completed with some connection issues")

    except Exception as e:
        print(f"❌ Error during quantum internet session: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())