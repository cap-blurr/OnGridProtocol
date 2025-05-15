# OnGrid Protocol: Frontend Integration Guide

## Overview

This guide provides step-by-step instructions for frontend developers to integrate the OnGrid Protocol smart contracts into a Node Frontend System UI. This UI is envisioned to serve node operators (for reward claims, monitoring) and system administrators (for managing contracts, parameters, and roles).

**Assumptions:**
*   You have access to the contract ABIs (JSON files) and deployed contract addresses for the target network (e.g., testnet, mainnet).
*   You are using a JavaScript/TypeScript environment with a library like `ethers.js` or `web3.js` for blockchain interaction.
*   Users will connect their wallets (e.g., MetaMask, WalletConnect) to interact with functions requiring transactions.
*   Numbers representing `uint256` or other large integer types from contracts should be handled as strings or using a BigNumber library (e.g., `BigNumber.js`, `ethers.BigNumber`) to avoid precision issues.
*   `bytes32` and `bytes` from contracts will typically be hex strings.
*   OGCC (`CarbonCreditToken`) has 3 decimals.
*   USDC (Reward Token / Exchange Token) is assumed to have 6 decimals.

## General Frontend Setup

1.  **Wallet Connection:**
    *   Implement wallet connection logic (e.g., using `rainbowkit`, `web3modal`, or directly with `ethers.js`/`web3.js` providers for MetaMask/WalletConnect).
    *   Manage connected account state, chain ID, and provider/signer instances.
2.  **Contract Instances:**
    *   For each contract, create an instance in your frontend code using its ABI and address. This allows calling view functions and, with a signer, sending transactions.
    ```javascript
    // Conceptual example with ethers.js
    // import { ethers } from 'ethers';

    // async function getContractInstance(contractAddress, contractAbiJson, providerOrSigner) {
    //   const contractAbi = JSON.parse(contractAbiJson); // Or import JSON directly
    //   return new ethers.Contract(contractAddress, contractAbi, providerOrSigner);
    // }

    // // For read-only operations (user not connected or just viewing data)
    // // const provider = new ethers.providers.JsonRpcProvider('YOUR_RPC_URL');
    // // const energyDataBridgeViewContract = await getContractInstance(energyDataBridgeAddress, energyDataBridgeAbi, provider);

    // // For write operations (user connected with a wallet)
    // // const browserProvider = new ethers.providers.Web3Provider(window.ethereum); // e.g., MetaMask
    // // const signer = browserProvider.getSigner();
    // // const energyDataBridgeTxContract = await getContractInstance(energyDataBridgeAddress, energyDataBridgeAbi, signer);
    ```
3.  **BigNumber/String Handling:**
    *   Always use a BigNumber library for arithmetic involving `uint256` values.
    *   Format BigNumbers to human-readable strings for display (e.g., considering token decimals).
    *   Convert user input strings back to BigNumbers when sending transactions.
4.  **State Management:** Use a state management solution (e.g., React Context, Redux, Zustand) to manage blockchain data, user wallet state, and UI state.
5.  **User Feedback:** Provide clear feedback for:
    *   Transaction submission, confirmation, and errors.
    *   Loading states when fetching data.
    *   Wallet connection status.
    *   Role-based access restrictions.

## Contract Integration Priority (Frontend Focus)

The frontend will primarily focus on:
1.  Displaying system status and data (`EnergyDataBridge`, `CarbonCreditExchange`, `RewardDistributor`, `CarbonCreditToken`).
2.  Allowing node operators to interact with the `RewardDistributor`.
3.  Allowing administrators to manage system parameters and roles across all contracts.
4.  Potentially allowing users to interact with the `CarbonCreditExchange` and challenge batches.

---

## Step-by-Step Frontend Integration

### Phase 1: Core Data Display and Monitoring

#### 1.1 `EnergyDataBridge` - System Health and Batch Monitoring

*   **Display Bridge Parameters (Admin/Public View):**
    *   Fetch and display:
        *   `emissionFactor()`: Format considering its 1e6 scaling.
        *   `requiredConsensusNodes()`
        *   `batchProcessingDelay()`: Convert to human-readable time (e.g., hours/days).
        *   `paused()`: Show if the bridge is paused.
*   **Display Registered P2P Nodes (Admin/Node Manager View):**
    *   Fetch `getPeerIdCount()`.
    *   Iterate (0 to count-1) calling `peerIds(index)` then `registeredNodes(peerId)` to display a list of nodes with their operator address, peer ID, and active status.
*   **Batch Monitoring (Public/Admin View):**
    *   **Interface Idea:** A table or list of submitted batches. Users might input a `batchHash` to view its status.
    *   For a given `batchHash`:
        *   `batchSubmissionTimes(batchHash)`: Display when it can be processed.
        *   `processedBatchHashes(batchHash)`: Show if processed.
        *   `batchChallenges(batchHash)`: Display challenge details (challenger, reason, status).
    *   **Event Listening:**
        *   Listen to `EnergyDataSubmitted`: Add new batches to the monitoring UI.
        *   Listen to `EnergyDataProcessed`: Update batch status.
        *   Listen to `BatchChallenged`: Update batch status, potentially highlight.
        *   Listen to `ChallengeResolved`: Update batch status.

#### 1.2 `RewardDistributor` - Rewards Overview

*   **Display Reward Parameters (Admin/Public View):**
    *   `currentRewardRate()`: Format considering `REWARD_PRECISION`.
    *   `totalContributionScore()`
    *   `rewardToken()`: Display address of USDC.
    *   `paused()`: Show if reward distribution is paused.
*   **Node Operator View:**
    *   Connect Wallet: Allow node operators to connect their wallets.
    *   `claimableRewards(connected_operator_address)`: Display available USDC rewards (format with 6 decimals).
    *   `nodeInfo(connected_operator_address)`: Display their `contributionScore`.
*   **Event Listening:**
    *   `NodeContributionUpdated`: For a connected operator, update their displayed score.
    *   `RewardsClaimed`: For a connected operator, update their claimable rewards and potentially show a success message.

#### 1.3 `CarbonCreditToken` (OGCC) - Token Information

*   **Display Token Info (Public View):**
    *   `name()`, `symbol()`, `decimals()` (fixed at 3).
    *   `totalSupply()`: Format with 3 decimals.
    *   `protocolTreasury()`: Display the treasury address.
    *   `balanceOf(protocolTreasuryAddress)`: Display treasury's OGCC balance.
    *   `paused()`: Show if token operations are paused.
*   **User/Operator View (Wallet Connected):**
    *   `balanceOf(connected_address)`: Display user's OGCC balance.
*   **Event Listening:**
    *   `Transfer`: If tracking specific balances (e.g., treasury, connected user), update on relevant transfers.
    *   `ProtocolTreasuryChanged`: Update displayed treasury address.

#### 1.4 `CarbonCreditExchange` - Exchange Status

*   **Display Exchange Parameters (Public View):**
    *   `exchangeRate()`: Format to show USDC per OGCC token (e.g., 1 OGCC = X USDC).
    *   `protocolFeePercentage()`: Format as percentage (value/1_000_000 * 100).
    *   `rewardDistributorPercentage()`: Format as percentage.
    *   `usdcToken()`: Display address.
    *   `exchangeEnabled()`: Show if exchange is active.
    *   `paused()`: Show if exchange is paused.
*   **Display Exchange Statistics (Public View):**
    *   `totalCreditsExchanged()`, `totalUsdcCollected()`, `totalProtocolFees()`, `totalRewardsFunded()`. Format OGCC with 3 decimals, USDC with 6 decimals.
*   **Event Listening:**
    *   `ExchangeRateSet`, `ProtocolFeeSet`, etc.: Update displayed parameters.
    *   `CreditsExchanged`: Update statistics.

---

### Phase 2: User Interactions

#### 2.1 `RewardDistributor` - Node Operator Reward Claim

*   **UI:** A "Claim Rewards" button, visible if `claimableRewards > 0` for the connected operator.
*   **Action:**
    1.  User connects wallet (must be a node operator address).
    2.  Frontend calls `RewardDistributor.claimRewards()` using the operator's signer.
    3.  Handle transaction submission, confirmation (show `RewardsClaimed` event data), or error. Update claimable rewards UI.

#### 2.2 `CarbonCreditExchange` - Exchanging OGCC for USDC (User/Operator via Frontend)

*   **UI:**
    *   Input field for `creditAmount` (OGCC).
    *   Display estimated USDC receivable (net of fees) based on current `exchangeRate` and `protocolFeePercentage`.
    *   "Approve OGCC" button.
    *   "Exchange" button (enabled after approval).
*   **Actions:**
    1.  User connects wallet.
    2.  **Approve:**
        *   User enters `creditAmount`.
        *   Frontend calls `CarbonCreditToken.approve(CarbonCreditExchangeAddress, amount_in_smallest_units)` using user's signer.
        *   Handle transaction. On success, update UI to enable "Exchange".
        *   Display current `CarbonCreditToken.allowance(user_address, CarbonCreditExchangeAddress)`.
    3.  **Exchange:**
        *   User clicks "Exchange".
        *   Frontend calls `CarbonCreditExchange.exchangeCreditsForUSDC(amount_in_smallest_units)` using user's signer.
        *   Handle transaction, show `CreditsExchanged` data, update user's OGCC and (potentially) USDC balances.
    *   **Prerequisites:**
        *   `exchangeEnabled` must be true.
        *   Exchange contract must have USDC liquidity.

#### 2.3 `EnergyDataBridge` - Challenging a Batch (Public/Admin via Frontend)

*   **UI:**
    *   Way to select/input a `batchHash`.
    *   Input field for `reason` (string).
    *   "Challenge Batch" button.
*   **Action:**
    1.  User connects wallet.
    2.  Frontend calls `EnergyDataBridge.challengeBatch(batchHash, reason)` using user's signer.
    3.  Handle transaction, show `BatchChallenged` event data.
    *   **Considerations:** This action is open to anyone. The frontend should inform users about potential implications or if there's a staking/bond mechanism (not in current contracts but common).

---

### Phase 3: Administrative Interactions (Admin Panel Section)

This section assumes the connected user's wallet has the required administrative roles. The UI should clearly indicate these are admin-only functions and potentially hide them for non-admins or show a "permission denied" state if attempted without roles.

#### 3.1 Managing `EnergyDataBridge`

*   **Set Parameters:**
    *   UI fields for `_factor`, `_requiredNodes`, `_delayInSeconds`.
    *   Buttons to call `setEmissionFactor`, `setRequiredConsensusNodes`, `setBatchProcessingDelay`.
    *   Requires `DEFAULT_ADMIN_ROLE`.
*   **Node Management:**
    *   UI to list nodes (from Phase 1).
    *   Form to `registerNode(bytes32 _peerId, address _operator)`.
    *   Mechanism to `updateNodeStatus(bytes32 _peerId, bool _isActive)`.
    *   Requires `NODE_MANAGER_ROLE`.
*   **Challenge Resolution:**
    *   UI to view challenged batches (from Phase 1).
    *   Buttons/options for `resolveChallenge(bytes32 batchHash, bool isUpheld)`.
    *   Requires `DEFAULT_ADMIN_ROLE`.
*   **Pause/Unpause:**
    *   Button to call `pause()` / `unpause()`.
    *   Requires `PAUSER_ROLE`.
*   **Role Management:**
    *   UI to grant/revoke `DATA_SUBMITTER_ROLE`, `NODE_MANAGER_ROLE`, `PAUSER_ROLE`.
    *   Requires admin of the specific role or `DEFAULT_ADMIN_ROLE`.

#### 3.2 Managing `RewardDistributor`

*   **Set Parameters:**
    *   UI field for `_rate`. Button to call `setRewardRate(uint256 _rate)`.
    *   Requires `DEFAULT_ADMIN_ROLE`.
*   **Fund Rewards (Admin Deposit):**
    *   UI field for `amount` (USDC). Button to call `depositRewards(uint256 amount)`.
    *   **Admin Action Required Pre-call:** Admin wallet must `approve` the `RewardDistributor` contract to spend their USDC.
    *   Requires `REWARD_DEPOSITOR_ROLE`.
*   **Pause/Unpause:**
    *   Button to call `pause()` / `unpause()`.
    *   Requires `PAUSER_ROLE`.
*   **Role Management:**
    *   UI to grant/revoke `REWARD_DEPOSITOR_ROLE`, `METRIC_UPDATER_ROLE`, `PAUSER_ROLE`.

#### 3.3 Managing `CarbonCreditToken`

*   **Set Treasury:**
    *   UI field for `_newTreasury`. Button to call `setProtocolTreasury(address _newTreasury)`.
    *   Requires `DEFAULT_ADMIN_ROLE`.
*   **Treasury Operations:**
    *   UI for `transferFromTreasury(address to, uint256 amount)`.
    *   UI for `retireFromTreasury(uint256 amount, string calldata reason)`.
    *   Requires `TREASURY_MANAGER_ROLE`.
*   **Pause/Unpause:**
    *   Button to call `pause()` / `unpause()`.
    *   Requires `PAUSER_ROLE`.
*   **Role Management:**
    *   UI to grant/revoke `MINTER_ROLE`, `TREASURY_MANAGER_ROLE`, `PAUSER_ROLE`.

#### 3.4 Managing `CarbonCreditExchange`

*   **Set Parameters:**
    *   UI for `setExchangeRate`, `setProtocolFee`, `setRewardDistributorPercentage`, `setUSDCToken`.
    *   Requires `RATE_SETTER_ROLE` or `EXCHANGE_MANAGER_ROLE` as appropriate.
*   **Enable/Disable Exchange:**
    *   Toggle/button for `setExchangeEnabled(bool _enabled)`.
    *   Requires `EXCHANGE_MANAGER_ROLE`.
*   **Pause/Unpause:**
    *   Button to call `pause()` / `unpause()`.
    *   Requires `PAUSER_ROLE`.
*   **Role Management:**
    *   UI to grant/revoke `RATE_SETTER_ROLE`, `EXCHANGE_MANAGER_ROLE`, `PAUSER_ROLE`.

---

## Frontend Testing Plan

### A. Setup
*   **Test Environment:** Use a local development network (Anvil) for rapid iteration and a public testnet (e.g., Sepolia) for more realistic E2E testing.
*   **Mock Data/Contracts:** For UI component tests, mock contract responses and wallet states.
*   **Test Wallets:** Configure multiple browser wallet accounts (e.g., MetaMask profiles) with different roles (admin, node operator, regular user, no roles) and varying balances of ETH, Test USDC, and OGCC (once mintable).
*   **Deployed Contracts:** Ensure all contracts are deployed on the test network, and initial roles (inter-contract, admin for test wallets) are set up.

### B. UI Component Testing
*   **Focus:** Test individual UI components in isolation.
*   **Tools:** Jest, React Testing Library, Storybook.
*   **Coverage:**
    *   Rendering with various props (e.g., loading states, error states, different data values).
    *   User interactions within components (button clicks, form inputs) and ensure event handlers are called.
    *   Display formatting for numbers, addresses, dates.

### C. Interaction and Integration Testing
*   **Focus:** Test how UI components interact with wallet services and smart contract instances.
*   **Tools:** Testing libraries (e.g., Cypress, Playwright) combined with `ethers.js` to set up contract states or trigger events.
*   **Coverage:**
    1.  **Wallet Connectivity:**
        *   Test connect/disconnect flows with various wallet providers.
        *   Verify correct display of connected account address and network.
        *   Handle network switching requests.
    2.  **Data Fetching and Display:**
        *   Verify all view functions are called correctly and data is accurately fetched and displayed in the UI.
        *   Test loading states while data is being fetched.
        *   Test error states if RPC calls fail.
        *   Ensure data updates in the UI when underlying contract state changes (e.g., after a transaction or event).
    3.  **Transaction Submission:**
        *   For every user-initiated transaction (e.g., `claimRewards`, `exchangeCreditsForUSDC`, admin functions):
            *   Verify correct parameters are sent to the contract.
            *   Test successful transaction flow: wallet prompt, signing, submission, pending state, confirmation, UI update.
            *   Test user rejection of transaction in wallet.
            *   Test contract revert scenarios (e.g., insufficient funds, lack of permissions, invalid inputs) and ensure UI provides clear error messages.
    4.  **Event Handling:**
        *   Trigger contract events.
        *   Verify UI updates correctly based on received event data (e.g., a new batch appears when `EnergyDataSubmitted` is caught).

### D. End-to-End (E2E) Scenario Testing
*   **Focus:** Test complete user workflows through the UI.
*   **Tools:** Cypress, Playwright.
*   **Coverage - Example Scenarios:**
    1.  **Node Operator Reward Claim:**
        *   Connect operator wallet.
        *   View claimable rewards.
        *   Click "Claim". Approve in wallet.
        *   Verify rewards received in wallet and UI updates.
    2.  **Admin Changes Parameter:**
        *   Connect admin wallet.
        *   Navigate to admin panel for `EnergyDataBridge`.
        *   Change `emissionFactor`. Submit. Approve in wallet.
        *   Verify parameter updates in UI and by calling view function.
    3.  **User Challenges Batch:**
        *   Connect user wallet.
        *   Find a batch, enter a reason, click "Challenge". Approve in wallet.
        *   Verify batch status updates in UI. Admin resolves it, verify further UI update.
    4.  **OGCC Exchange (if UI supports this flow for general users):**
        *   Connect user wallet.
        *   Approve OGCC spending by `CarbonCreditExchange`.
        *   Execute `exchangeCreditsForUSDC`.
        *   Verify token balance changes in UI and wallet.

### E. Role-Based Access Control (RBAC) UI Testing
*   **Focus:** Ensure UI correctly handles different user roles for administrative sections.
*   **Coverage:**
    *   Log in with an admin wallet: Verify admin sections/buttons are visible and functional.
    *   Log in with a non-admin wallet: Verify admin sections/buttons are hidden or disabled. Attempting admin actions should fail gracefully or be prevented by the UI.
    *   Test specific roles: e.g., a wallet with only `NODE_MANAGER_ROLE` should only be able to access node management functions, not change exchange rates.

### F. Usability and Accessibility
*   **Focus:** Ensure the UI is intuitive, responsive, and accessible.
*   **Method:** Manual testing, automated accessibility checkers (e.g., Axe).
*   **Coverage:**
    *   Test on different browsers and screen sizes.
    *   Check for clear navigation and user guidance.
    *   Ensure ARIA attributes are used correctly for accessibility.

---

This comprehensive guide should equip your frontend developer to effectively integrate with the OnGrid Protocol smart contracts and thoroughly test the Node Frontend System UI.
