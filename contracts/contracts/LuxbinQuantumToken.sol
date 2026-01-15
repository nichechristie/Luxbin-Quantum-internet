// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title LUXBIN Quantum Token
 * @notice First cryptocurrency backed by quantum entropy from 445 qubits
 * @dev Uses quantum randomness for burns, rewards, and value creation
 */
contract LuxbinQuantumToken is ERC20, Ownable, ReentrancyGuard {

    // ============ State Variables ============

    // Quantum Entropy Oracle
    address public quantumOracle;
    uint256 public lastQuantumEntropy;
    uint256 public lastEntropyUpdate;

    // Tokenomics Settings
    uint256 public constant BURN_FEE = 300;           // 3%
    uint256 public constant REFLECTION_FEE = 200;     // 2%
    uint256 public constant TREASURY_FEE = 200;       // 2%
    uint256 public constant LOTTERY_FEE = 100;        // 1%
    uint256 public constant FEE_DENOMINATOR = 10000;  // 100%

    // Treasury & Pools
    address public treasury;
    uint256 public lotteryPool;
    uint256 public treasuryPool;
    uint256 public totalReflections;

    // Staking
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaim;
        uint256 quantumMultiplier; // Set at stake time
    }
    mapping(address => Stake) public stakes;
    uint256 public totalStaked;
    uint256 public constant MIN_STAKE = 100 * 10**18; // 100 LUX minimum

    // Validators
    mapping(address => bool) public validators;
    address[] public validatorList;
    uint256 public constant VALIDATOR_STAKE = 10000 * 10**18; // 10,000 LUX to become validator
    uint256 public lastValidatorSelection;
    address[] public activeValidators;

    // Lottery
    address[] public holders;
    mapping(address => bool) public isHolder;
    uint256 public lastLotteryDraw;
    uint256 public constant LOTTERY_INTERVAL = 1000; // Every 1000 blocks

    // Quantum Metrics
    uint256 public totalQuantumBurns;
    uint256 public totalQuantumRewards;
    uint256 public quantumComputersOnline = 3;
    uint256 public totalQubitsAvailable = 445;

    // Exclusions
    mapping(address => bool) public isExcludedFromFees;

    // ============ Events ============

    event QuantumEntropyUpdated(uint256 entropy, uint256 timestamp);
    event QuantumBurn(uint256 amount, uint256 entropy);
    event QuantumReflection(uint256 amount);
    event QuantumLotteryWon(address winner, uint256 amount, uint256 entropy);
    event Staked(address indexed user, uint256 amount, uint256 multiplier);
    event Unstaked(address indexed user, uint256 amount, uint256 rewards);
    event ValidatorAdded(address indexed validator);
    event ValidatorSelected(address indexed validator, uint256 entropy);
    event TreasuryBuyback(uint256 amount);

    // ============ Constructor ============

    constructor() ERC20("LUXBIN Quantum Token", "LUX") {
        treasury = msg.sender;

        // Initial supply: 1 billion LUX
        _mint(msg.sender, 1_000_000_000 * 10**18);

        // Exclude owner and contract from fees
        isExcludedFromFees[msg.sender] = true;
        isExcludedFromFees[address(this)] = true;

        lastLotteryDraw = block.number;
        lastValidatorSelection = block.number;
    }

    // ============ Quantum Entropy Functions ============

    /**
     * @notice Update quantum entropy from oracle (IBM quantum computers)
     * @param entropy Quantum random number from 445 qubits
     */
    function updateQuantumEntropy(uint256 entropy) external {
        require(msg.sender == quantumOracle || msg.sender == owner(), "Only oracle or owner");

        lastQuantumEntropy = entropy;
        lastEntropyUpdate = block.timestamp;

        emit QuantumEntropyUpdated(entropy, block.timestamp);

        // Trigger quantum operations
        _executeQuantumOperations(entropy);
    }

    /**
     * @notice Set quantum oracle address (connects to quantum internet)
     */
    function setQuantumOracle(address _oracle) external onlyOwner {
        quantumOracle = _oracle;
    }

    /**
     * @notice Get current quantum entropy (simulated if oracle not updated)
     */
    function getQuantumEntropy() public view returns (uint256) {
        if (lastEntropyUpdate == 0 || block.timestamp - lastEntropyUpdate > 1 hours) {
            // Fallback to block-based pseudo-random if quantum oracle offline
            return uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, lastQuantumEntropy)));
        }
        return lastQuantumEntropy;
    }

    // ============ Transfer with Quantum Tokenomics ============

    function _transfer(address from, address to, uint256 amount) internal override {
        require(from != address(0), "Transfer from zero address");
        require(to != address(0), "Transfer to zero address");
        require(amount > 0, "Transfer amount must be greater than zero");

        // Handle holder tracking
        if (balanceOf(to) == 0 && !isHolder[to]) {
            holders.push(to);
            isHolder[to] = true;
        }

        // Check if fees should be applied
        bool takeFee = !isExcludedFromFees[from] && !isExcludedFromFees[to];

        if (takeFee) {
            // Calculate fees
            uint256 burnAmount = (amount * BURN_FEE) / FEE_DENOMINATOR;
            uint256 reflectionAmount = (amount * REFLECTION_FEE) / FEE_DENOMINATOR;
            uint256 treasuryAmount = (amount * TREASURY_FEE) / FEE_DENOMINATOR;
            uint256 lotteryAmount = (amount * LOTTERY_FEE) / FEE_DENOMINATOR;

            uint256 totalFee = burnAmount + reflectionAmount + treasuryAmount + lotteryAmount;
            uint256 transferAmount = amount - totalFee;

            // Get quantum entropy to determine fee distribution
            uint256 entropy = getQuantumEntropy();

            // Quantum Burn (always happens)
            _burn(from, burnAmount);
            totalQuantumBurns += burnAmount;
            emit QuantumBurn(burnAmount, entropy);

            // Quantum-enhanced distribution
            uint256 quantumChoice = entropy % 100;

            if (quantumChoice < 40) {
                // 40% chance: Extra burn (deflationary boost)
                _burn(from, reflectionAmount);
                totalQuantumBurns += reflectionAmount;
            } else if (quantumChoice < 80) {
                // 40% chance: Reflection to holders
                super._transfer(from, address(this), reflectionAmount);
                totalReflections += reflectionAmount;
                emit QuantumReflection(reflectionAmount);
            } else {
                // 20% chance: Direct to lottery pool (big wins)
                super._transfer(from, address(this), reflectionAmount);
                lotteryPool += reflectionAmount;
            }

            // Treasury and lottery
            super._transfer(from, address(this), treasuryAmount + lotteryAmount);
            treasuryPool += treasuryAmount;
            lotteryPool += lotteryAmount;

            // Execute transfer
            super._transfer(from, to, transferAmount);

        } else {
            // No fees for excluded addresses
            super._transfer(from, to, amount);
        }

        // Check for lottery draw
        if (block.number - lastLotteryDraw >= LOTTERY_INTERVAL && holders.length > 0) {
            _drawQuantumLottery();
        }
    }

    // ============ Quantum Lottery ============

    function _drawQuantumLottery() internal {
        if (lotteryPool == 0 || holders.length == 0) return;

        uint256 entropy = getQuantumEntropy();
        uint256 winnerIndex = entropy % holders.length;
        address winner = holders[winnerIndex];

        // Transfer lottery pool to winner
        uint256 prize = lotteryPool;
        lotteryPool = 0;

        _transfer(address(this), winner, prize);

        lastLotteryDraw = block.number;
        emit QuantumLotteryWon(winner, prize, entropy);
    }

    /**
     * @notice Manual lottery draw (can be called by anyone if interval passed)
     */
    function drawLottery() external nonReentrant {
        require(block.number - lastLotteryDraw >= LOTTERY_INTERVAL, "Too soon");
        _drawQuantumLottery();
    }

    // ============ Quantum Staking ============

    /**
     * @notice Stake LUX tokens for quantum-enhanced rewards
     * @param amount Amount to stake
     */
    function stake(uint256 amount) external nonReentrant {
        require(amount >= MIN_STAKE, "Minimum stake is 100 LUX");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Get quantum multiplier (2x to 10x based on quantum entropy)
        uint256 entropy = getQuantumEntropy();
        uint256 multiplier = (entropy % 9) + 2; // 2-10x

        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);

        // Update stake
        if (stakes[msg.sender].amount > 0) {
            // Claim existing rewards first
            _claimStakingRewards(msg.sender);
        }

        stakes[msg.sender] = Stake({
            amount: stakes[msg.sender].amount + amount,
            startTime: block.timestamp,
            lastClaim: block.timestamp,
            quantumMultiplier: multiplier
        });

        totalStaked += amount;

        emit Staked(msg.sender, amount, multiplier);
    }

    /**
     * @notice Unstake tokens and claim rewards
     */
    function unstake() external nonReentrant {
        require(stakes[msg.sender].amount > 0, "No stake");

        uint256 stakedAmount = stakes[msg.sender].amount;
        uint256 rewards = calculateStakingRewards(msg.sender);

        // Reset stake
        stakes[msg.sender].amount = 0;
        totalStaked -= stakedAmount;

        // Transfer staked amount back
        _transfer(address(this), msg.sender, stakedAmount);

        // Mint rewards
        if (rewards > 0) {
            _mint(msg.sender, rewards);
            totalQuantumRewards += rewards;
        }

        emit Unstaked(msg.sender, stakedAmount, rewards);
    }

    /**
     * @notice Claim staking rewards without unstaking
     */
    function claimRewards() external nonReentrant {
        _claimStakingRewards(msg.sender);
    }

    function _claimStakingRewards(address account) internal {
        uint256 rewards = calculateStakingRewards(account);

        if (rewards > 0) {
            stakes[account].lastClaim = block.timestamp;
            _mint(account, rewards);
            totalQuantumRewards += rewards;
        }
    }

    /**
     * @notice Calculate pending staking rewards
     * @dev Base APY: 10%, Quantum multiplier: 2-10x
     */
    function calculateStakingRewards(address account) public view returns (uint256) {
        Stake memory userStake = stakes[account];
        if (userStake.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - userStake.lastClaim;
        uint256 baseReward = (userStake.amount * 10 * timeStaked) / (100 * 365 days); // 10% APY
        uint256 quantumReward = baseReward * userStake.quantumMultiplier;

        return quantumReward;
    }

    // ============ Quantum Validator System ============

    /**
     * @notice Become a validator by staking 10,000 LUX
     */
    function becomeValidator() external nonReentrant {
        require(!validators[msg.sender], "Already a validator");
        require(balanceOf(msg.sender) >= VALIDATOR_STAKE, "Need 10,000 LUX");

        // Stake validator amount
        _transfer(msg.sender, address(this), VALIDATOR_STAKE);

        validators[msg.sender] = true;
        validatorList.push(msg.sender);

        emit ValidatorAdded(msg.sender);
    }

    /**
     * @notice Select active validators using quantum entropy
     * @dev Called periodically to rotate validators fairly
     */
    function selectValidators() external {
        require(block.number - lastValidatorSelection >= 7200, "Too soon"); // ~1 day
        require(validatorList.length > 0, "No validators");

        uint256 entropy = getQuantumEntropy();

        // Select up to 21 validators using quantum randomness
        delete activeValidators;
        uint256 count = validatorList.length < 21 ? validatorList.length : 21;

        for (uint256 i = 0; i < count; i++) {
            uint256 index = uint256(keccak256(abi.encodePacked(entropy, i))) % validatorList.length;
            activeValidators.push(validatorList[index]);
            emit ValidatorSelected(validatorList[index], entropy);
        }

        lastValidatorSelection = block.number;
    }

    /**
     * @notice Distribute block rewards to active validators
     */
    function distributeValidatorRewards() external {
        require(activeValidators.length > 0, "No active validators");

        uint256 rewardPerValidator = 100 * 10**18; // 100 LUX per validator

        for (uint256 i = 0; i < activeValidators.length; i++) {
            _mint(activeValidators[i], rewardPerValidator);
        }
    }

    // ============ Quantum Operations ============

    function _executeQuantumOperations(uint256 entropy) internal {
        // Operation 1: Treasury Buyback (if entropy signals)
        if (entropy % 100 >= 80 && treasuryPool > 0) {
            uint256 buybackAmount = treasuryPool / 10; // Use 10% of treasury
            treasuryPool -= buybackAmount;

            // In production, this would swap on DEX and burn
            // For now, just burn directly
            _burn(address(this), buybackAmount);
            emit TreasuryBuyback(buybackAmount);
        }

        // Operation 2: Reflection distribution (if pool large enough)
        if (totalReflections > 1000 * 10**18) {
            // Distribute to random holder
            if (holders.length > 0) {
                uint256 holderIndex = entropy % holders.length;
                address luckyHolder = holders[holderIndex];

                uint256 reflection = totalReflections / 10; // 10% of pool
                totalReflections -= reflection;

                _transfer(address(this), luckyHolder, reflection);
            }
        }
    }

    // ============ View Functions ============

    function getQuantumMetrics() external view returns (
        uint256 _totalBurns,
        uint256 _totalRewards,
        uint256 _totalStaked,
        uint256 _lotteryPool,
        uint256 _treasuryPool,
        uint256 _qubits,
        uint256 _quantumComputers
    ) {
        return (
            totalQuantumBurns,
            totalQuantumRewards,
            totalStaked,
            lotteryPool,
            treasuryPool,
            totalQubitsAvailable,
            quantumComputersOnline
        );
    }

    function getHolderCount() external view returns (uint256) {
        return holders.length;
    }

    function getValidatorCount() external view returns (uint256) {
        return validatorList.length;
    }

    function getActiveValidators() external view returns (address[] memory) {
        return activeValidators;
    }

    // ============ Admin Functions ============

    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    function excludeFromFees(address account, bool excluded) external onlyOwner {
        isExcludedFromFees[account] = excluded;
    }

    function updateQuantumMetrics(uint256 qubits, uint256 computers) external onlyOwner {
        totalQubitsAvailable = qubits;
        quantumComputersOnline = computers;
    }

    // Emergency functions
    function rescueTokens(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "Cannot rescue LUX");
        IERC20(token).transfer(owner(), amount);
    }
}
