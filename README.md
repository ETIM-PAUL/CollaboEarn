# CollaboEarn

**CollaboEarn** is a collaborative content creation platform where **writers, illustrators, video creators**, web3 community and **fans** co-create interactive content around admin-created themes. Each contribution to a theme earns royalties from user tips, making collaboration both creative and rewarding.

Contributions (words, artworks, clips) are all stored on IPFS, this helps to reduce the size of the stored data onchain.

---

## Key Features

- **Admin-driven Themes**  
  Admins can create themed prompts (e.g. *"Future of AI"*) that supports either:
  - **Words** (Articles)
  - **Artworks**
  - **Videos**

- **Collaborative Content Creation**  
  Contributors can submit original works under any theme. All submissions require **admin approval** to be visible and eligible for tips.

  Each Theme has  a maximum number of collaborations and doesn't allow more than the number.

- **Tip & Earn**  
  Viewers can **tip any contribution**. The tip amount is equally distributed as royalties to **all approved collaborators** of such theme.

- **Royalty Distribution**  
  Tips are split among contributors automatically via smart contract.

---

## Powered By

- **Smart Contract**  
  - [`Collabo.sol`](./contracts/Collabo.sol) deployed and verified on the **Etherlink Testnet** The fast, fair and (nearly) free L2.

  (https://testnet.explorer.etherlink.com/address/0xF77025Db69882AD1c7f18D2A1C5B8821C091916C)

  - Handles theme creation, contributions, approval, tipping, and revenue sharing

- **Wallet Connection**  
  - Powered by [Thirdweb SDK](https://portal.thirdweb.com/)
  - Easily connect wallets and interact with the contract

---

## Getting Started

### 1. Clone the project

```bash
git clone https://github.com/your-org/CollaboEarn.git
cd CollaboEarn
```

### 2. Install dependencies

```bash
yarn install
# or
npm install
```

### 3. Run the app locally

```bash
yarn dev
# or
npm run dev
```

### 4. Connect to Etherlink Testnet

Ensure your wallet is connected to **Etherlink Testnet** and you have test ETH.  
Use [Thirdweb Connect Wallet](https://portal.thirdweb.com/react/react.connectwallet) integration.

---

## Contract Overview

- `createTheme(...)` Admin-only: Creates a new theme
- `submitContribution(...)` Community members submit content
- `approveContribution(...)` Admin approves/rejects a submission
- `tipTheme(themeId)` Send XTZ tips to a theme; contract auto-splits among contributors

Tip: Contributions are stored via IPFS and referenced in the smart contract.

---

## Testnet Info

- **Chain:** Etherlink Testnet  
- **Block Explorer:** [explorer-testnet.etherlink.com](https://explorer-testnet.etherlink.com)  
- **Faucet:** [testnet-faucet.etherlink.com](https://testnet-faucet.etherlink.com)

---

## Contributing

We welcome contributions! Fork the repo, create a branch, and open a PR.

---

## License

MIT CollaboEarn Team
