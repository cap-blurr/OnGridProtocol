# Smart Contract Integration Guide for Frontend Developers

## Introduction

This guide provides a step-by-step approach to integrating the OnGrid Finance smart contracts with a frontend application. It details the key functions to call, events to listen for, and data formats for inputs and outputs, tailored for a developer using a modern TypeScript stack (e.g., with Ethers.js or Viem).

**Assumptions:**
*   You have the ABIs for all relevant contracts.
*   You have the deployed contract addresses on the target network.
*   Your application stack includes a backend that can interact with a database (like Supabase) and a decentralized file storage system (like IPFS) for handling off-chain data.

---

## Core Contracts & Addresses (Base Sepolia)

The frontend will primarily interact with the following contracts.

| Contract                    | Type              | Address                                | Purpose                                                                                                 |
| --------------------------- | ----------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **USDC Token**              | ERC20             | `(Obtain from your deployment)`        | The stablecoin used for all financial transactions.                                                     |
| **DeveloperRegistry**       | UUPS Proxy        | `0x8C7b1B4423B396016c6ec3c872eC7ab7Ce1Cf67B` | Manages developer identity and KYC status.                                                              |
| **DeveloperDepositEscrow**  | Standard Contract | `0xA1A2e73903d084623C93f9d0c3fC19093921F169` | Holds the 20% upfront deposit from developers for their projects.                                       |
| **ProjectFactory**          | UUPS Proxy        | `0xdE3c3bAD342CDD661F50698Be8459083d166AEC2` | The entry point for developers to create new projects.                                                  |
| **LiquidityPoolManager**    | UUPS Proxy        | `0x1D025E099503356491702CAdD32Cd7dFe1B74425` | Manages liquidity pools for funding low-value projects.                                                 |
| **RepaymentRouter**         | Standard Contract | `0xa2c78a53bc6D9Be0769E4eE5eb7dAF93c7F27F6b` | A central router for all loan repayments from developers.                                               |
| **FeeRouter**               | UUPS Proxy        | `0xf5d976Ab4aFe651849C0b28A777176ea4200EB95` | Calculates and routes protocol fees from repayments.                                                    |
| **DirectProjectVault**      | Cloned Contract   | (Obtained from `ProjectCreated` event) | A dedicated vault for funding a single high-value project. Each high-value project gets its own clone. |
| **RiskRateOracleAdapter**   | UUPS Proxy        | `0xE4F5Cd8eF3C73BCcfD725Bc9290b27dFD4877D41` | Manages risk parameters for projects. Mostly used by backend/admin.                                     |
| **PausableGovernor**        | Standard Contract | `0xfb00757cd8Ade9ccdCFDb9C64b11eEfE0f6b1812` | Central admin for pausing contracts. For admin panel use.                                               |

---

## Data Type Formatting

When interacting with the contracts, ensure you use the correct data types to avoid transaction reverts.

*   **Addresses**: `string` (e.g., `"0x123..."`)
*   **Integers (`uint256`, `uint64`, etc.)**: Use `bigint` in TypeScript (`BigInt("value")`) when sending data to the contract. When reading data, it will likely be returned as a `bigint`.
*   **Formatting USDC**: The protocol uses USDC with 6 decimals. To display a `uint256` amount from the contract as a readable dollar value, divide the `bigint` by `10n ** 6n`. When sending an amount to the contract, multiply the user's input by `10 ** 6`.
*   **Bytes (`bytes32`, `bytes`, etc.)**: `string` (hexadecimal, e.g., `"0xabc..."`)
*   **Booleans (`bool`)**: `boolean` (`true`/`false`)
*   **Strings (`string`)**: `string`
*   **Tuples/Structs**: `object` or `array` as per your library's documentation. The order of fields is critical.

---

## Displaying On-Chain Data (View Functions)

This section details how to query the contracts to populate your frontend with data for various views.

### For a General Audience (Project & Pool Discovery)

**1. Listing All High-Value Projects:**
*   **Contract**: `ProjectFactory`
*   **Function**: `getAllHighValueProjects()`
*   **Returns**: `address[]` - An array of `DirectProjectVault` contract addresses.
*   **Usage**: Iterate over this array to display a list of all high-value projects available for investment. For each `vaultAddress` in the array, you can then fetch more details as described below.

**2. Displaying a High-Value Project Card/Summary:**
*   **Contract**: `DirectProjectVault` (at its specific `vaultAddress`)
*   **Function**: `getProjectSummary()`
*   **Returns**: A `tuple` containing:
    *   `state`: `uint8` - The current project state (e.g., `PROJECT_STATE_FUNDING_OPEN`, `PROJECT_STATE_ACTIVE`). Match this with the `Constants.sol` values.
    *   `fundingProgress`: `uint16` - Percentage of funding achieved in basis points (e.g., `5000` means 50.00%). Divide by 100 for display.
    *   `timeRemaining`: `uint256` - Seconds until the funding deadline (0 if passed).
    *   `totalReturn`: `uint256` - Total returns distributed.
*   **Usage**: Ideal for summary cards on a project discovery page.

**3. Listing All Liquidity Pools:**
*   **Contract**: `LiquidityPoolManager`
*   **Function**: `getAllPools()`
*   **Returns**: An array of `PoolInfo` structs. Each struct contains:
    *   `exists`: `bool`
    *   `name`: `string`
    *   `totalAssets`: `uint256` - Total USDC in the pool.
    *   `totalShares`: `uint256` - Total LP shares minted for the pool.
*   **Usage**: Display a list of all available liquidity pools for investors.

**4. Displaying Details of a Specific Liquidity Pool:**
*   **Contract**: `LiquidityPoolManager`
*   **Function**: `getPoolInfo(poolId)`
*   **Returns**: A single `PoolInfo` struct (see above).
*   **Function**: `getPoolLoans(poolId)`
*   **Returns**:
    *   `projectIds`: `uint256[]`
    *   `loanAmounts`: `uint256[]`
    *   `outstandingAmounts`: `uint256[]`
    *   `states`: `uint8[]`
*   **Usage**: On a dedicated page for a pool, show its stats and a list of the projects it has funded.

### For Investors (Portfolio & Project Details)

**1. User's High-Value Project Investments:**
*   **Contract**: `DirectProjectVault`
*   **Function**: `getInvestorDetails(investorAddress)`
*   **Returns**: A `tuple` with:
    *   `shares`: `uint256` - The amount of USDC the investor has deposited.
    *   `principalClaimed`: `uint256`
    *   `interestClaimed`: `uint256`
    *   `claimablePrincipalAmount`: `uint256` - Amount of principal ready to be claimed now.
    *   `claimableInterestAmount`: `uint256` - Amount of interest ready to be claimed now.
*   **Usage**: In an investor's portfolio, for each high-value project they've invested in, display their investment size and what they can claim.

**2. User's Liquidity Pool Investments:**
*   **Contract**: `LiquidityPoolManager`
*   **Function**: `getUserPoolInvestments(userAddress)`
*   **Returns**: A `tuple` of three arrays:
    *   `poolIds`: `uint256[]`
    *   `shares`: `uint256[]` - The user's LP shares in each corresponding pool.
    *   `values`: `uint256[]` - The current USDC value of the user's shares in each pool.
*   **Usage**: The primary function for building an investor's portfolio view of their pool investments.

### For Developers (Project Management)

**1. Listing a Developer's Projects:**
*   **Data Source**: A backend indexer is the most robust solution. The frontend should query a backend endpoint that has indexed all `ProjectCreated` and `LowValueProjectSubmitted` events to get a list of `projectId`s for a given `developerAddress`.
*   **On-Chain Fallback**:
    *   `ProjectFactory.userProjects(developerAddress, index)` can be called in a loop. To get the number of projects, call `DeveloperRegistry.getTimesFunded(developerAddress)`. This gives the total count of projects the developer has created. You can then loop from `0` to `count - 1` to get all their project IDs.

**2. Displaying a Project's Status and Repayment Info:**
*   For a given `projectId`:
    *   **Contract**: `ProjectFactory` -> `projectStates(projectId)` -> `uint8` state.
    *   **Contract**: `RepaymentRouter` -> `getProjectPaymentSummary(projectId)` -> `(totalRepaid, lastPayment, paymentCount)`.
    *   **Contract**: `FeeRouter` -> `getNextPaymentInfo(projectId)` -> `(dueDate, amount)`.
*   **Usage**: Build a dashboard for developers to track their active and past loans.

---

## Transactional User Flows

### Flow 1: Developer Onboarding & Project Creation

This flow covers a new or existing developer creating a project.

#### Step 1: Check Developer KYC Status
*   **Action**: Call `DeveloperRegistry.isVerified(developerAddress)`.
*   **UI**: If `false`, guide the developer to the KYC submission process (Step 2). If `true`, enable the project creation form (Step 3).

#### Step 2: KYC Submission Process (Off-Chain + Admin)
1.  **Frontend**: Collect KYC data and documents from the developer.
2.  **Backend/IPFS**: Upload documents to IPFS. Store the resulting IPFS CID and developer metadata in a secure backend (e.g., Supabase).
3.  **Admin Panel**: An admin reviews the off-chain data.
4.  **Admin Action**: Admin calls `DeveloperRegistry.submitKYC(developerAddress, kycHash, ipfsCID)` and then `DeveloperRegistry.setVerifiedStatus(developerAddress, true)`.
5.  **Frontend Update**: Listen for the `KYCStatusChanged(address developer, bool isVerified)` event to update the UI, or poll the `isVerified` function.

#### Step 3: Create a Project
1.  **Form Inputs**: Gather `loanAmountRequested`, `requestedTenor`, `fundingDeadline`, and `metadataCID` from the developer.
2.  **Calculate & Approve Deposit**: The frontend must calculate the required 20% deposit and prompt the user for a USDC approval.
    *   **Calculation**: `depositAmount = (loanAmountRequested * 2000) / 10000`.
    *   **Contract Interaction**: Call `approve()` on the `USDC_TOKEN_ADDRESS` contract.
        *   **Function**: `approve(spender: DEVELOPER_DEPOSIT_ESCROW_ADDRESS, amount: depositAmount)`
    *   **Testing**: Verify the `Approval` event is emitted from the USDC contract and that the allowance is updated with `USDC_TOKEN_CONTRACT.allowance(developerAddress, DEVELOPER_DEPOSIT_ESCROW_ADDRESS)`.

3.  **Submit Project to Factory**:
    *   **Contract Interaction**: Call `createProject()` on the `PROJECT_FACTORY_ADDRESS` contract.
    *   **`params` struct format**:
        ```typescript
        {
          loanAmountRequested: BigInt(loanAmount), // e.g., 100000e6 for $100,000
          requestedTenor: 365,
          fundingDeadline: 2592000, // 30 days in seconds
          metadataCID: "ipfs://YourMetadataCID"
        }
        ```
    *   **Testing**:
        *   Listen for `ProjectCreated` (for high-value projects) or `LowValueProjectSubmitted` (for low-value projects) on `ProjectFactory`.
        *   Listen for `DepositFunded` on `DeveloperDepositEscrow`.
        *   Listen for `DeveloperFundedCounterIncremented` on `DeveloperRegistry`.

---

### Flow 2: Investor - High-Value Project (via `DirectProjectVault`)

1.  **Display Project**: Use the `view` functions in the data display section above to populate the project page. Disable investment UI if `DirectProjectVault.isFundingClosed()` is `true`.
2.  **Invest**:
    *   **Approval**: Call `USDC_TOKEN_CONTRACT.approve(vaultAddress, investmentAmount)`.
    *   **Deposit**: Call `DirectProjectVault(vaultAddress).invest(investmentAmount)`.
    *   **Testing**: Listen for the `Invested` event on the vault. Verify `investorShares` and `totalAssetsInvested` have updated correctly. Check that the user's USDC balance decreased and the vault's USDC balance increased.

3.  **Claim**:
    *   **Display**: Use `claimablePrincipal(investorAddress)` and `claimableYield(investorAddress)` to show available funds.
    *   **Action**: Call `claimPrincipal()`, `claimYield()`, or `redeem()` on the `vaultAddress`.
    *   **Testing**: Listen for `PrincipalClaimed` and/or `YieldClaimed` events. Verify the user's USDC balance increases by the correct amount and that their `principalClaimedByInvestor` and `interestClaimedByInvestor` state in the vault have been updated.

---

### Flow 3: Investor - Low-Value Projects (via `LiquidityPoolManager`)

1.  **Display Pools**: Use `getAllPools()` and `getPoolInfo(poolId)` to list available pools.
2.  **Deposit**:
    *   **Approval**: Call `USDC_TOKEN_CONTRACT.approve(LIQUIDITY_POOL_MANAGER_ADDRESS, depositAmount)`.
    *   **Deposit**: Call `LiquidityPoolManager.depositToPool(poolId, depositAmount)`.
    *   **Testing**: Listen for `PoolDeposit` event. Verify the `sharesMinted` is correct. Check `getUserShares` to confirm the user's new balance.

3.  **Redeem**:
    *   **Pre-check**: Use `getUserShares(poolId, userAddress)` to confirm share balance.
    *   **Redemption**: Call `LiquidityPoolManager.redeem(poolId, sharesToRedeem)`.
    *   **Testing**: Listen for `PoolRedeem` event. Verify the `assetsWithdrawn` is correct and that the user's USDC balance increased accordingly.

4.  **View Investments**:
    *   **Action**: Call `LiquidityPoolManager.getUserPoolInvestments(userAddress)`.
    *   **Usage**: This is the primary function for building an investor's portfolio view of their pool investments. It returns parallel arrays of the pools they are in, their share counts, and the current USDC value of those shares.

---

### Flow 4: Developer Loan Repayment

1.  **Display Repayment Info**: Use the `view` functions in the data display section to show the developer their outstanding loan balance and next payment details for a given `projectId`.
2.  **Make Repayment**:
    *   **Approval**: Call `USDC_TOKEN_CONTRACT.approve(REPAYMENT_ROUTER_ADDRESS, repaymentAmount)`.
    *   **Repay**: Call `RepaymentRouter.repay(projectId, repaymentAmount)`.
    *   **Testing**:
        *   Listen for the `RepaymentRouted` event on `RepaymentRouter` to confirm the payment and see the breakdown.
        *   Listen for the `RepaymentReceived` event on the corresponding funding source (the Vault or Pool Manager).
        *   Query `getPrincipalRepaid()` on the funding source to see the updated value.
        *   Query `getNextPaymentInfo(projectId)` on the `FeeRouter` to see the updated due date.

---

## Detailed Event Monitoring & UI Actions

To provide a responsive user experience, the frontend must listen for key events. This allows the UI to update dynamically without requiring page reloads. A backend indexer service is highly recommended for robustly tracking and querying historical events.

### Global & Factory Events

*   **Contract**: `ProjectFactory`
    *   **Event**: `ProjectCreated (projectId, developer, vaultAddress, devEscrowAddress, loanAmount)`
        *   **Significance**: A new high-value project vault has been created.
        *   **UI Action**: Add the new project to the main discovery page. You can now use the `vaultAddress` to fetch and display detailed project information.
    *   **Event**: `LowValueProjectSubmitted (projectId, developer, poolId, loanAmount, success)`
        *   **Significance**: A low-value project has been processed by the `LiquidityPoolManager`.
        *   **UI Action**: Add the project to a list of "Pool-Funded Projects". If `success` is `true`, show its status as "Active" and the `poolId` it was funded from. If `false`, show it as "Pending Liquidity".

### Investor-Facing Events

*   **Contract**: `DirectProjectVault` (Listen on the specific `vaultAddress`)
    *   **Event**: `Invested (investor, amountInvested, totalAssetsInvested)`
        *   **Significance**: An investment was made in this vault.
        *   **UI Action**: If the `investor` is the current user, show a success confirmation. Update the "Total Raised" or funding progress bar for the project using `totalAssetsInvested`.
    *   **Event**: `FundingClosed (projectId, totalAssetsInvested)`
        *   **Significance**: The project has been fully funded and the loan is now active.
        *   **UI Action**: Update the project status to "Active". Disable the investment input fields. Show the `loanStartTime`.
    *   **Event**: `PrincipalClaimed (investor, amountClaimed)` / `YieldClaimed (investor, amountClaimed)`
        *   **Significance**: An investor has claimed their returns.
        *   **UI Action**: If the `investor` is the current user, show a success confirmation and update their wallet balance. Refresh their "Claimable" amounts for this vault by re-calling `getInvestorDetails`.
    *   **Event**: `LoanClosed (...)`
        *   **Significance**: The project is fully repaid.
        *   **UI Action**: Update the project status to "Completed". All remaining principal and interest should now be claimable.

*   **Contract**: `LiquidityPoolManager`
    *   **Event**: `PoolDeposit (poolId, investor, assetsDeposited, sharesMinted)`
        *   **Significance**: An investor has deposited into a liquidity pool.
        *   **UI Action**: If the `investor` is the current user, confirm the deposit and show them the `sharesMinted`. Update their portfolio view by re-calling `getUserPoolInvestments`.
    *   **Event**: `PoolRedeem (poolId, redeemer, sharesBurned, assetsWithdrawn)`
        *   **Significance**: An investor has withdrawn from a liquidity pool.
        *   **UI Action**: If the `redeemer` is the current user, confirm the withdrawal and show them the `assetsWithdrawn`. Update their portfolio view.

### Developer-Facing Events

*   **Contract**: `DeveloperRegistry`
    *   **Event**: `KYCStatusChanged (developer, isVerified)`
        *   **Significance**: An admin has updated a developer's KYC status.
        *   **UI Action**: If the `developer` is the current user and `isVerified` is `true`, unlock the project creation functionality for them.
    *   **Event**: `DeveloperFundedCounterIncremented (developer, newCount)`
        *   **Significance**: The developer successfully created and funded a project.
        *   **UI Action**: Update the developer's dashboard to reflect their new total project count.

*   **Contract**: `DeveloperDepositEscrow`
    *   **Event**: `DepositFunded (projectId, developer, amount)`
        *   **Significance**: The developer's 20% deposit for a project has been successfully transferred to escrow.
        *   **UI Action**: Confirm this step in the project creation timeline.
    *   **Event**: `DepositReleased (projectId, developer, amount)`
        *   **Significance**: The developer's deposit has been returned. This happens when a low-value project is successfully funded or a high-value project is fully repaid.
        *   **UI Action**: Show a notification that their deposit for `projectId` has been returned to their wallet.

*   **Contract**: `RepaymentRouter`
    *   **Event**: `RepaymentRouted (projectId, payer, totalAmountRepaid, feeAmount, principalAmount, interestAmount, fundingSource)`
        *   **Significance**: A developer's repayment was successfully processed and distributed.
        *   **UI Action**: Show a detailed confirmation of the repayment, including the breakdown of fees, principal, and interest. Update the project's repayment history.

---

## Phase 3: Enhanced Analytics & Real-Time Monitoring

Phase 3 introduces advanced analytics capabilities, real-time monitoring systems, and comprehensive reporting features that provide deep insights into project performance, energy production metrics, and ecosystem health.

### Advanced Analytics Architecture

**Overview**: Phase 3 analytics combines on-chain data from smart contracts with off-chain IoT sensor data, weather APIs, and machine learning models to provide comprehensive project analytics and predictive insights.

**Key Components**:
*   **Real-time Data Aggregation**: Continuous monitoring of energy production, weather conditions, and financial metrics
*   **Predictive Analytics Engine**: ML models for forecasting energy output, maintenance needs, and ROI projections
*   **Carbon Credit Tracking**: Automated calculation and verification of carbon credits generated
*   **Performance Benchmarking**: Comparative analysis across projects and industry standards

### Real-Time Energy Production Analytics

#### 1. Live Production Monitoring

**Data Sources**:
*   IoT sensors on solar panels/wind turbines
*   Smart inverters and energy meters
*   Weather station APIs
*   Grid connection monitoring

**Implementation**:
```typescript
interface EnergyProductionData {
  projectId: string;
  timestamp: number;
  currentOutput: number; // MW
  efficiency: number; // percentage
  weatherConditions: {
    irradiance: number; // W/m²
    temperature: number; // °C
    windSpeed: number; // m/s
    cloudCover: number; // percentage
  };
  equipmentStatus: {
    inverterHealth: number; // percentage
    panelDegradation: number; // percentage
    maintenanceAlerts: string[];
  };
}

// Real-time data fetching
async function getLiveProductionData(projectId: string): Promise<EnergyProductionData> {
  const response = await fetch(`/api/analytics/production/${projectId}/live`);
  return response.json();
}

// WebSocket connection for real-time updates
const ws = new WebSocket(`wss://api.ongrid.com/analytics/${projectId}/live`);
ws.onmessage = (event) => {
  const data: EnergyProductionData = JSON.parse(event.data);
  updateProductionDashboard(data);
};
```

#### 2. Performance Prediction Models

**Energy Forecast API**:
```typescript
interface EnergyForecast {
  projectId: string;
  forecastPeriod: string; // '24h', '7d', '30d', '1y'
  predictions: {
    timestamp: number;
    expectedOutput: number; // MWh
    confidence: number; // percentage
    factors: {
      weather: number;
      seasonality: number;
      equipment: number;
    };
  }[];
}

async function getEnergyForecast(
  projectId: string, 
  period: string
): Promise<EnergyForecast> {
  const response = await fetch(`/api/analytics/forecast/${projectId}?period=${period}`);
  return response.json();
}
```

### Financial Performance Analytics

#### 1. ROI Tracking & Projections

**Contract Integration**:
```typescript
// Enhanced ROI calculations with analytics
interface ProjectROIAnalytics {
  projectId: string;
  currentROI: number;
  projectedROI: number;
  benchmarkROI: number;
  riskAdjustedReturn: number;
  paybackPeriod: number; // months
  cashFlowProjections: {
    month: number;
    energyRevenue: number;
    carbonCredits: number;
    maintenanceCosts: number;
    netCashFlow: number;
  }[];
}

async function getProjectROIAnalytics(projectId: string): Promise<ProjectROIAnalytics> {
  // Combine on-chain financial data with off-chain analytics
  const [onChainData, analyticsData] = await Promise.all([
    getProjectPaymentSummary(projectId),
    fetch(`/api/analytics/roi/${projectId}`).then(r => r.json())
  ]);
  
  return {
    projectId,
    currentROI: calculateCurrentROI(onChainData),
    projectedROI: analyticsData.projectedROI,
    benchmarkROI: analyticsData.benchmarkROI,
    riskAdjustedReturn: analyticsData.riskAdjustedReturn,
    paybackPeriod: analyticsData.paybackPeriod,
    cashFlowProjections: analyticsData.cashFlowProjections
  };
}
```

#### 2. Risk Assessment & Monitoring

**Risk Analytics API**:
```typescript
interface ProjectRiskAssessment {
  projectId: string;
  overallRiskScore: number; // 0-100
  riskFactors: {
    weather: {
      score: number;
      description: string;
      mitigation: string;
    };
    technical: {
      score: number;
      equipmentAge: number;
      maintenanceHistory: string[];
    };
    financial: {
      score: number;
      cashFlowStability: number;
      marketVolatility: number;
    };
    regulatory: {
      score: number;
      policyChanges: string[];
      incentiveStability: number;
    };
  };
  recommendedActions: string[];
}
```

### Carbon Credit Analytics

#### 1. Automated Carbon Credit Calculation

**Integration with Environmental APIs**:
```typescript
interface CarbonCreditData {
  projectId: string;
  periodStart: number;
  periodEnd: number;
  energyGenerated: number; // MWh
  co2Avoided: number; // tons
  carbonCreditsEarned: number;
  verificationStatus: 'pending' | 'verified' | 'issued';
  certificationBody: string;
  blockchainTxHash?: string;
}

async function calculateCarbonCredits(
  projectId: string,
  periodStart: number,
  periodEnd: number
): Promise<CarbonCreditData> {
  const energyData = await getEnergyProductionData(projectId, periodStart, periodEnd);
  const gridEmissionFactor = await getGridEmissionFactor(projectId);
  
  const co2Avoided = energyData.totalGeneration * gridEmissionFactor;
  const carbonCreditsEarned = co2Avoided; // 1 credit per ton CO2
  
  return {
    projectId,
    periodStart,
    periodEnd,
    energyGenerated: energyData.totalGeneration,
    co2Avoided,
    carbonCreditsEarned,
    verificationStatus: 'pending',
    certificationBody: 'Gold Standard',
    blockchainTxHash: undefined
  };
}
```

#### 2. Carbon Credit Trading Integration

**Smart Contract Interface**:
```typescript
// Integration with carbon credit marketplace
interface CarbonCreditMarketplace {
  listCreditsForSale(
    projectId: string,
    credits: number,
    pricePerCredit: number
  ): Promise<string>; // returns listing ID
  
  buyCredits(
    listingId: string,
    quantity: number
  ): Promise<string>; // returns transaction hash
  
  getCreditPrice(): Promise<number>; // current market price
}
```

### Advanced Reporting & Dashboards

#### 1. Executive Summary Reports

**Automated Report Generation**:
```typescript
interface ExecutiveReport {
  reportId: string;
  generatedAt: number;
  period: {
    start: number;
    end: number;
  };
  summary: {
    totalEnergyGenerated: number; // MWh
    totalRevenue: number; // USDC
    totalCO2Avoided: number; // tons
    averageROI: number; // percentage
    activeProjects: number;
    completedProjects: number;
  };
  topPerformingProjects: {
    projectId: string;
    name: string;
    roi: number;
    energyOutput: number;
  }[];
  marketInsights: {
    energyPricesTrend: string;
    carbonCreditPrices: number;
    regulatoryUpdates: string[];
  };
  recommendations: string[];
}

async function generateExecutiveReport(
  startDate: number,
  endDate: number
): Promise<ExecutiveReport> {
  const [projects, market, analytics] = await Promise.all([
    getAllProjectsAnalytics(startDate, endDate),
    getMarketData(),
    getAnalyticsInsights(startDate, endDate)
  ]);
  
  return {
    reportId: generateReportId(),
    generatedAt: Date.now(),
    period: { start: startDate, end: endDate },
    summary: calculateSummaryMetrics(projects),
    topPerformingProjects: getTopPerformers(projects),
    marketInsights: market,
    recommendations: generateRecommendations(analytics)
  };
}
```

#### 2. Interactive Analytics Dashboard

**Component Architecture**:
```typescript
// Main analytics dashboard component
const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  
  const { data: liveData } = useLiveAnalytics(selectedProjects);
  const { data: historicalData } = useHistoricalAnalytics(selectedProjects, timeRange);
  const { data: forecast } = useEnergyForecast(selectedProjects, timeRange);
  
  return (
    <div className="analytics-dashboard">
      <MetricsOverview data={liveData} />
      <EnergyProductionChart data={historicalData} forecast={forecast} />
      <ROIAnalytics projects={selectedProjects} />
      <CarbonCreditTracker projects={selectedProjects} />
      <RiskAssessment projects={selectedProjects} />
      <PerformanceBenchmarks data={historicalData} />
    </div>
  );
};

// Real-time data hooks
function useLiveAnalytics(projectIds: string[]) {
  return useQuery(['liveAnalytics', projectIds], async () => {
    const data = await Promise.all(
      projectIds.map(id => getLiveProductionData(id))
    );
    return aggregateAnalyticsData(data);
  }, {
    refetchInterval: 30000, // 30 seconds
    enabled: projectIds.length > 0
  });
}
```

### Predictive Maintenance System

#### 1. Equipment Health Monitoring

**AI-Powered Diagnostics**:
```typescript
interface EquipmentHealthData {
  projectId: string;
  equipment: {
    id: string;
    type: 'solar_panel' | 'inverter' | 'wind_turbine' | 'battery';
    healthScore: number; // 0-100
    predictedFailureDate?: number;
    maintenanceRecommendations: {
      priority: 'low' | 'medium' | 'high' | 'critical';
      action: string;
      estimatedCost: number;
      impactOnProduction: number; // percentage
    }[];
    performanceMetrics: {
      efficiency: number;
      degradationRate: number;
      expectedLifespan: number; // years remaining
    };
  }[];
}

async function getEquipmentHealth(projectId: string): Promise<EquipmentHealthData> {
  const response = await fetch(`/api/analytics/equipment-health/${projectId}`);
  return response.json();
}
```

#### 2. Maintenance Scheduling Optimization

**Smart Scheduling Algorithm**:
```typescript
interface MaintenanceSchedule {
  projectId: string;
  scheduledMaintenance: {
    equipmentId: string;
    maintenanceType: string;
    scheduledDate: number;
    estimatedDuration: number; // hours
    estimatedCost: number;
    productionImpact: number; // MWh lost
    priority: number; // 1-10
  }[];
  totalMaintenanceCost: number;
  totalProductionLoss: number;
  optimizationScore: number; // efficiency of schedule
}

async function optimizeMaintenanceSchedule(
  projectId: string,
  timeHorizon: number // days
): Promise<MaintenanceSchedule> {
  const [equipmentHealth, weatherForecast, energyPrices] = await Promise.all([
    getEquipmentHealth(projectId),
    getWeatherForecast(projectId, timeHorizon),
    getEnergyPriceForecast(timeHorizon)
  ]);
  
  // AI algorithm to optimize maintenance timing
  return optimizeSchedule(equipmentHealth, weatherForecast, energyPrices);
}
```

### Environmental Impact Analytics

#### 1. Comprehensive Environmental Tracking

**Environmental Metrics API**:
```typescript
interface EnvironmentalImpact {
  projectId: string;
  period: { start: number; end: number };
  metrics: {
    co2Avoided: number; // tons
    equivalentCarsOffRoad: number;
    treesEquivalent: number;
    waterSaved: number; // liters
    landUseEfficiency: number; // MW/hectare
    biodiversityScore: number; // 0-100
  };
  certifications: {
    name: string;
    issuer: string;
    validUntil: number;
    certificateUrl: string;
  }[];
  complianceStatus: {
    environmental: boolean;
    social: boolean;
    governance: boolean;
  };
}
```

#### 2. Sustainability Reporting

**ESG Compliance Dashboard**:
```typescript
interface ESGReport {
  projectId: string;
  reportingPeriod: string;
  environmental: {
    carbonFootprint: number;
    renewableEnergyPercentage: number;
    wasteReduction: number;
    waterUsage: number;
  };
  social: {
    jobsCreated: number;
    localCommunityBenefit: number;
    safetyIncidents: number;
    trainingHours: number;
  };
  governance: {
    transparencyScore: number;
    auditCompliance: boolean;
    stakeholderEngagement: number;
    riskManagement: number;
  };
  overallESGScore: number;
  benchmarkComparison: {
    industry: number;
    region: number;
    global: number;
  };
}
```

### Market Intelligence & Competitive Analysis

#### 1. Market Trends Analysis

**Market Data Integration**:
```typescript
interface MarketIntelligence {
  energyMarket: {
    currentPrices: {
      residential: number; // per kWh
      commercial: number;
      industrial: number;
    };
    priceForecasts: {
      timeframe: string;
      predicted_price: number;
      confidence: number;
    }[];
    volatility: number;
  };
  carbonMarket: {
    currentPrice: number; // per ton CO2
    tradingVolume: number;
    priceHistory: {
      date: number;
      price: number;
    }[];
  };
  competitorAnalysis: {
    averageROI: number;
    marketShare: {
      company: string;
      percentage: number;
    }[];
    technologyTrends: string[];
  };
  regulatoryEnvironment: {
    policyChanges: {
      date: number;
      policy: string;
      impact: 'positive' | 'negative' | 'neutral';
    }[];
    incentives: {
      name: string;
      amount: number;
      duration: number;
    }[];
  };
}
```

### Advanced User Interface Components

#### 1. Real-time Analytics Widgets

**Widget Library**:
```typescript
// Energy production gauge
const EnergyGauge: React.FC<{
  currentOutput: number;
  capacity: number;
  efficiency: number;
}> = ({ currentOutput, capacity, efficiency }) => {
  return (
    <div className="energy-gauge">
      <CircularProgress
        value={efficiency}
        color={efficiency > 80 ? 'green' : efficiency > 60 ? 'yellow' : 'red'}
      />
      <div className="output-display">
        {currentOutput.toFixed(2)} MW / {capacity} MW
      </div>
    </div>
  );
};

// ROI trend chart
const ROITrendChart: React.FC<{
  data: ROIDataPoint[];
  forecast: ROIDataPoint[];
}> = ({ data, forecast }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={[...data, ...forecast]}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line dataKey="actual" stroke="#4CAF50" strokeWidth={2} />
        <Line dataKey="forecast" stroke="#FFA726" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

#### 2. Interactive Data Visualization

**Advanced Chart Components**:
```typescript
// Heat map for performance across projects
const ProjectPerformanceHeatMap: React.FC<{
  projects: ProjectPerformanceData[];
}> = ({ projects }) => {
  const heatmapData = projects.map(project => ({
    id: project.id,
    name: project.name,
    efficiency: project.efficiency,
    roi: project.roi,
    co2Saved: project.co2Saved
  }));
  
  return (
    <div className="heatmap-container">
      <HeatMap
        data={heatmapData}
        xAccessor="efficiency"
        yAccessor="roi"
        colorAccessor="co2Saved"
        colorScheme="green"
      />
    </div>
  );
};

// 3D visualization for energy production
const EnergyProduction3D: React.FC<{
  data: EnergyTimeSeriesData[];
}> = ({ data }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <EnergyMesh data={data} />
      <OrbitControls />
    </Canvas>
  );
};
```

### Integration Testing & Validation

#### 1. Analytics Data Validation

**Test Suite for Analytics Functions**:
```typescript
describe('Phase 3 Analytics Integration', () => {
  test('Real-time energy data collection', async () => {
    const projectId = 'test-project-1';
    const data = await getLiveProductionData(projectId);
    
    expect(data.currentOutput).toBeGreaterThanOrEqual(0);
    expect(data.efficiency).toBeBetween(0, 100);
    expect(data.timestamp).toBeLessThanOrEqual(Date.now());
  });
  
  test('ROI calculations accuracy', async () => {
    const projectId = 'test-project-1';
    const roi = await getProjectROIAnalytics(projectId);
    
    expect(roi.currentROI).toBeFinite();
    expect(roi.projectedROI).toBeFinite();
    expect(roi.paybackPeriod).toBeGreaterThan(0);
  });
  
  test('Carbon credit calculations', async () => {
    const credits = await calculateCarbonCredits(
      'test-project-1',
      Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
      Date.now()
    );
    
    expect(credits.co2Avoided).toBeGreaterThanOrEqual(0);
    expect(credits.carbonCreditsEarned).toEqual(credits.co2Avoided);
  });
});
```

#### 2. Performance Benchmarks

**Analytics Performance Standards**:
```typescript
const ANALYTICS_PERFORMANCE_BENCHMARKS = {
  REAL_TIME_DATA_LATENCY: 5000, // 5 seconds max
  DASHBOARD_LOAD_TIME: 3000, // 3 seconds max
  FORECAST_ACCURACY: 0.85, // 85% minimum accuracy
  UPTIME_REQUIREMENT: 0.999, // 99.9% uptime
  DATA_FRESHNESS: 60000 // 1 minute max age for live data
};
```

---

## Summary

Phase 3 of the OnGrid Protocol integration provides a comprehensive analytics ecosystem that combines real-time monitoring, predictive analytics, financial performance tracking, and environmental impact assessment. This advanced system enables stakeholders to make data-driven decisions, optimize project performance, and maximize both financial returns and environmental benefits.

The implementation leverages modern web technologies, machine learning algorithms, and blockchain integration to deliver a seamless user experience while maintaining the highest standards of data accuracy and system reliability.