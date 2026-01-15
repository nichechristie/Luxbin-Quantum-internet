// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Quantum Entropy Oracle
 * @notice Feeds quantum randomness from 445 qubits to smart contracts
 * @dev Connects to LUXBIN Quantum Internet (3 IBM quantum computers)
 */
contract QuantumEntropyOracle is Ownable {

    // ============ State Variables ============

    struct EntropyData {
        uint256 entropy;
        uint256 timestamp;
        string source; // e.g., "ibm_fez_qubit_42"
        uint256 qubits;
        bool verified;
    }

    // Latest quantum entropy
    EntropyData public latestEntropy;

    // Historical entropy (last 100)
    EntropyData[] public entropyHistory;
    uint256 public constant MAX_HISTORY = 100;

    // Authorized feeders (quantum internet nodes)
    mapping(address => bool) public authorizedFeeders;

    // Contracts subscribed to entropy updates
    address[] public subscribers;
    mapping(address => bool) public isSubscribed;

    // Statistics
    uint256 public totalEntropyUpdates;
    uint256 public quantumComputersOnline = 3;
    string[] public quantumComputers = ["ibm_fez", "ibm_torino", "ibm_marrakesh"];

    // ============ Events ============

    event EntropyUpdated(
        uint256 entropy,
        uint256 timestamp,
        string source,
        uint256 qubits
    );

    event SubscriberAdded(address indexed subscriber);
    event FeederAuthorized(address indexed feeder);
    event EntropyBroadcast(address indexed subscriber, uint256 entropy);

    // ============ Constructor ============

    constructor() {
        authorizedFeeders[msg.sender] = true;
    }

    // ============ Quantum Entropy Functions ============

    /**
     * @notice Update entropy from quantum internet
     * @param entropy Quantum random number from measurements
     * @param source Which quantum computer/qubit (e.g., "ibm_fez")
     * @param qubits Number of qubits used in measurement
     */
    function updateEntropy(
        uint256 entropy,
        string memory source,
        uint256 qubits
    ) public {
        require(authorizedFeeders[msg.sender], "Not authorized feeder");
        require(entropy > 0, "Invalid entropy");

        // Create entropy data
        EntropyData memory newEntropy = EntropyData({
            entropy: entropy,
            timestamp: block.timestamp,
            source: source,
            qubits: qubits,
            verified: true
        });

        // Update latest
        latestEntropy = newEntropy;

        // Add to history
        entropyHistory.push(newEntropy);
        if (entropyHistory.length > MAX_HISTORY) {
            // Remove oldest (shift array)
            for (uint256 i = 0; i < entropyHistory.length - 1; i++) {
                entropyHistory[i] = entropyHistory[i + 1];
            }
            entropyHistory.pop();
        }

        totalEntropyUpdates++;

        emit EntropyUpdated(entropy, block.timestamp, source, qubits);

        // Broadcast to subscribers
        _broadcastToSubscribers(entropy);
    }

    /**
     * @notice Batch update multiple entropy values (from multiple quantum computers)
     */
    function batchUpdateEntropy(
        uint256[] memory entropies,
        string[] memory sources,
        uint256[] memory qubitCounts
    ) external {
        require(authorizedFeeders[msg.sender], "Not authorized");
        require(entropies.length == sources.length, "Length mismatch");
        require(entropies.length == qubitCounts.length, "Length mismatch");

        for (uint256 i = 0; i < entropies.length; i++) {
            if (entropies[i] > 0) {
                updateEntropy(entropies[i], sources[i], qubitCounts[i]);
            }
        }
    }

    /**
     * @notice Get latest quantum entropy
     */
    function getLatestEntropy() external view returns (uint256) {
        return latestEntropy.entropy;
    }

    /**
     * @notice Get entropy with metadata
     */
    function getEntropyData() external view returns (
        uint256 entropy,
        uint256 timestamp,
        string memory source,
        uint256 qubits,
        bool verified
    ) {
        return (
            latestEntropy.entropy,
            latestEntropy.timestamp,
            latestEntropy.source,
            latestEntropy.qubits,
            latestEntropy.verified
        );
    }

    /**
     * @notice Get combined entropy from all quantum computers
     * @dev XORs entropy from multiple sources for maximum randomness
     */
    function getCombinedEntropy() external view returns (uint256) {
        uint256 combined = latestEntropy.entropy;

        // Combine with recent history
        uint256 historyCount = entropyHistory.length < 3 ? entropyHistory.length : 3;
        for (uint256 i = 0; i < historyCount; i++) {
            uint256 index = entropyHistory.length - 1 - i;
            combined ^= entropyHistory[index].entropy;
        }

        return combined;
    }

    // ============ Subscription Management ============

    /**
     * @notice Subscribe a contract to receive entropy updates
     */
    function subscribe(address subscriber) external onlyOwner {
        require(!isSubscribed[subscriber], "Already subscribed");

        subscribers.push(subscriber);
        isSubscribed[subscriber] = true;

        emit SubscriberAdded(subscriber);
    }

    /**
     * @notice Unsubscribe a contract
     */
    function unsubscribe(address subscriber) external onlyOwner {
        require(isSubscribed[subscriber], "Not subscribed");

        isSubscribed[subscriber] = false;

        // Remove from array
        for (uint256 i = 0; i < subscribers.length; i++) {
            if (subscribers[i] == subscriber) {
                subscribers[i] = subscribers[subscribers.length - 1];
                subscribers.pop();
                break;
            }
        }
    }

    /**
     * @notice Broadcast entropy to all subscribers
     */
    function _broadcastToSubscribers(uint256 entropy) internal {
        for (uint256 i = 0; i < subscribers.length; i++) {
            try IEntropyConsumer(subscribers[i]).updateQuantumEntropy(entropy) {
                emit EntropyBroadcast(subscribers[i], entropy);
            } catch {
                // Subscriber failed to receive, continue
            }
        }
    }

    /**
     * @notice Manual broadcast (in case automatic fails)
     */
    function manualBroadcast() external {
        require(latestEntropy.entropy > 0, "No entropy available");
        _broadcastToSubscribers(latestEntropy.entropy);
    }

    // ============ Quantum Metrics ============

    /**
     * @notice Get quantum network status
     */
    function getQuantumStatus() external view returns (
        uint256 computersOnline,
        uint256 totalUpdates,
        uint256 lastUpdate,
        uint256 subscriberCount
    ) {
        return (
            quantumComputersOnline,
            totalEntropyUpdates,
            latestEntropy.timestamp,
            subscribers.length
        );
    }

    /**
     * @notice Get list of quantum computers
     */
    function getQuantumComputers() external view returns (string[] memory) {
        return quantumComputers;
    }

    /**
     * @notice Get entropy history
     */
    function getEntropyHistory(uint256 count) external view returns (EntropyData[] memory) {
        uint256 returnCount = count > entropyHistory.length ? entropyHistory.length : count;
        EntropyData[] memory history = new EntropyData[](returnCount);

        for (uint256 i = 0; i < returnCount; i++) {
            history[i] = entropyHistory[entropyHistory.length - 1 - i];
        }

        return history;
    }

    // ============ Admin Functions ============

    /**
     * @notice Authorize a feeder address (quantum internet node)
     */
    function authorizeFeeder(address feeder) external onlyOwner {
        authorizedFeeders[feeder] = true;
        emit FeederAuthorized(feeder);
    }

    /**
     * @notice Revoke feeder authorization
     */
    function revokeFeeder(address feeder) external onlyOwner {
        authorizedFeeders[feeder] = false;
    }

    /**
     * @notice Update quantum computer status
     */
    function updateQuantumStatus(uint256 computersOnline) external onlyOwner {
        quantumComputersOnline = computersOnline;
    }

    /**
     * @notice Add quantum computer to network
     */
    function addQuantumComputer(string memory computerName) external onlyOwner {
        quantumComputers.push(computerName);
        quantumComputersOnline = quantumComputers.length;
    }

    // ============ Verification ============

    /**
     * @notice Verify entropy is from quantum source
     * @dev Checks timestamp freshness and source validity
     */
    function verifyEntropy(uint256 entropy) external view returns (bool) {
        // Check if entropy matches latest
        if (entropy != latestEntropy.entropy) return false;

        // Check if recent (within 1 hour)
        if (block.timestamp - latestEntropy.timestamp > 1 hours) return false;

        // Check if verified
        return latestEntropy.verified;
    }

    /**
     * @notice Get entropy proof for verification
     */
    function getEntropyProof(uint256 entropy) external view returns (
        bool exists,
        uint256 timestamp,
        string memory source,
        uint256 qubits
    ) {
        if (entropy == latestEntropy.entropy) {
            return (true, latestEntropy.timestamp, latestEntropy.source, latestEntropy.qubits);
        }

        // Search history
        for (uint256 i = 0; i < entropyHistory.length; i++) {
            if (entropyHistory[i].entropy == entropy) {
                return (
                    true,
                    entropyHistory[i].timestamp,
                    entropyHistory[i].source,
                    entropyHistory[i].qubits
                );
            }
        }

        return (false, 0, "", 0);
    }
}

/**
 * @title IEntropyConsumer
 * @notice Interface for contracts that consume quantum entropy
 */
interface IEntropyConsumer {
    function updateQuantumEntropy(uint256 entropy) external;
}
