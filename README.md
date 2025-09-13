# Debt Consolidation Calculator

This tool helps you calculate the benefits of consolidating multiple debts into a single payment. Enter your debts, compare repayment options, and see how much you could save by consolidating.

## Screenshots

![Initial screen](<Screenshot 2025-09-12 at 10.51.52 pm.png>)
![Filled rows](<Screenshot 2025-09-12 at 10.51.18 pm.png>)
![Results screen](<Screenshot 2025-09-12 at 10.49.38 pm.png>)

## Live Demo

[dcs-calculator-danial.vercel.app](https://dcs-calculator-danial.vercel.app/)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm, npm, yarn, or bun

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/daniql/dcs-calculator.git
cd dcs-calculator
pnpm install # or npm install, yarn install, bun install
```

### Local Use

Start the development server:

```bash
pnpm run dev # or npm run dev, yarn dev, bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Known Issues

when theres large gaps between the balance and monthly payment this causes a NaN error during calculation, need to look into industry info to update
![large gap in inputs](<Screenshot 2025-09-12 at 10.56.56 pm.png>)
![NaN error](<Screenshot 2025-09-12 at 10.56.49 pm.png>)
