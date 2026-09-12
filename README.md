# ChainGuard

### Multi-Chain Blockchain Transaction Verification Platform

ChainGuard is a full-stack web application designed to automatically verify blockchain transactions across multiple blockchain networks.

The platform retrieves real on-chain transaction data through public APIs and RPC endpoints, compares it with the expected transaction parameters, and provides a clear validation result. Validation data is also stored to support history and statistical analysis.

This project was developed as part of the **Informatics Engineering degree at IPVC**.

---

## Overview

Blockchain networks use different architectures, APIs and transaction models, making transaction verification challenging in a multi-chain environment.

ChainGuard addresses this problem through a modular validation architecture capable of handling different blockchain technologies while providing a unified interface for the user.

The application allows users to:

* Select a blockchain network
* Enter transaction details
* Validate transactions against real blockchain data
* View validation results
* Review previous validations
* Analyse basic validation statistics

---

## Key Features

* **Multi-chain transaction validation**
* **Real-time blockchain data retrieval**
* **Support for different blockchain architectures**
* **Modular validator architecture**
* **User authentication and protected endpoints**
* **Validation history**
* **Statistical dashboard**
* **Error handling and transaction revalidation**
* **Persistent data storage**

---

## Supported Blockchain Networks

The project was designed to work with multiple blockchain ecosystems, including:

* Ethereum
* Polygon
* Binance Smart Chain
* Arbitrum
* Optimism
* Avalanche
* Bitcoin
* Solana
* Bittensor
* Theta
* Solar
* Vana
* Wanchain
* Celestia
* Neutron
* Osmosis
* Oraichain
* Tron
* VeChain
* Near
* Ontology
* Nillion

The validator architecture was designed to make adding new blockchain networks easier without changing the core application logic.

---

## Architecture

ChainGuard follows a full-stack architecture composed of three main layers:

**Frontend**

* React.js
* User interface
* Authentication
* Transaction validation
* Dashboard and statistics

**Backend**

* Node.js
* Express.js
* REST API
* Authentication
* Transaction validation
* Blockchain communication

**Database**

* MongoDB Atlas
* User data
* Validation records
* Historical statistics

### Validator Architecture

The backend uses a modular validator structure:

```text
BaseValidator
├── ExplorerAPIValidator
├── EVMValidator
├── BitcoinValidator
└── SolanaValidator
```

This approach allows common validation logic to be reused while supporting the specific characteristics of different blockchain models.

---

## How It Works

```text
User
  │
  ▼
React Frontend
  │
  ▼
Node.js / Express API
  │
  ▼
Blockchain Validator
  │
  ├── Blockchain Explorer APIs
  └── RPC Endpoints
  │
  ▼
On-Chain Transaction Data
  │
  ▼
Validation & Comparison
  │
  ├── Passed
  ├── Failed
  └── Error
  │
  ▼
MongoDB Atlas
```

The validation process follows these steps:

1. The user selects a blockchain network.
2. Transaction parameters are submitted through the frontend.
3. The backend identifies the appropriate validator.
4. The validator retrieves the transaction from the blockchain.
5. Retrieved data is compared with the expected values.
6. A validation result is generated.
7. The result is stored in the database.
8. The result is displayed to the user.

---

## Technologies

### Frontend

* React.js
* JavaScript
* HTML
* CSS

### Backend

* Node.js
* Express.js
* REST APIs
* JWT Authentication

### Database

* MongoDB
* MongoDB Atlas

### Blockchain

* Blockchain Explorer APIs
* RPC endpoints
* EVM-compatible networks
* Bitcoin
* Solana

### Development Tools

* Git
* GitHub
* Visual Studio Code
* Render

---

## Authentication & Security

The application includes an authentication system based on:

* User registration and login
* JWT-based authentication
* Password hashing
* Protected API endpoints

This ensures that user-specific validation data and application functionality are appropriately protected.

---

## Dashboard

The application includes a dashboard designed to provide an overview of transaction validations.

It provides information such as:

* Total validations
* Successful and failed validations
* Blockchain usage
* Validation history
* Temporal validation data

---

## Main Challenges

One of the main challenges of the project was dealing with the **heterogeneity of blockchain networks**.

Different networks expose transaction data through different APIs, RPC endpoints and data structures. Some use fundamentally different transaction models, such as Bitcoin's UTXO model compared with account-based EVM networks.

Another challenge was designing a system that could support multiple blockchain networks without duplicating validation logic.

The final architecture therefore focuses on **modularity, reusability and extensibility**.

---

## What This Project Demonstrates

This project allowed me to work with several areas of software development, including:

* Full-stack web development
* REST API development
* Database integration
* Authentication and authorization
* Blockchain technologies
* API and RPC integration
* Modular software architecture
* Data validation
* Error handling
* Git/GitHub development workflow
* Deployment of web applications

It also involved analysing technical limitations and adapting the architecture during development, eventually moving from an initial Svelte + Python approach to a unified **React + Node.js + Express** architecture.

---

## Future Improvements

Possible future improvements include:

* Adding support for more blockchain networks
* Improving API reliability through caching and retry mechanisms
* More advanced statistics and benchmarking
* Enhanced filtering and search
* More detailed data visualizations
* Automated testing
* Monitoring and performance analysis
* Role-based access control

---

## Authors

**Inês Branco**
Informatics Engineering Student

**Sara Rodrigues**
Informatics Engineering Student

---

## Academic Project

Developed as part of the **Informatics Engineering degree at Instituto Politécnico de Viana do Castelo (IPVC)**.

**Project III — 2025/2026**

---


