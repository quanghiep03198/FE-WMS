# Warehouse Management

This project is a warehouse management system built using: React, TypeScript, ShadCN UI, TailwindCSS, TanStack Router, and TanStack Query.

## Table of Contents

-  [Introduction](#introduction)
-  [Features](#features)
-  [Installation](#installation)
-  [Usage](#usage)
-  [Folder Structure](#folder-structure)
-  [Contributing](#contributing)
-  [License](#license)

## Introduction

The warehouse management project helps you manage inventory, track shipments, and process orders efficiently. The application utilizes modern technologies like React and TypeScript to ensure stability and maintainability.

## Features

-  Inventory Tracking: Update inventory quantities.
-  Order Processing Manage Order Statuses.
-  Generating Reports.
-  Exchange & Return Management.
-  Warehouse Import & Export Management.

## Installation & Requirements

**Node.js** version >= 20.14.0.

### Step 1: Clone the repository

```bash
git clone <repository-url> <repository-directory>
cd <repository-directory>
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Run the application

```bash
npm start
```

## Usage

1. After running the `npm start` command, open your browser and go to `http://localhost:3000`.
2. Log in with your warehouse management account.
3. Start managing products, tracking inventory, and processing orders.

## Folder Structure

```
├── .husky
├── public
├── resources
│   └── locales
├── src
│   ├── app
│   ├── assets
│   ├── common
│   ├── components
│   ├── configs
│   └── i18n
│       ├── cn
│       ├── en
│       └── vi
│   ├── mocks
│   ├── schemas
│   ├── services
│   ├── styles
│   ├── _app.tsx
│   └── main.tsx
│   ├── report-web-vitals.ts
│   ├── route-tree.gen.tsx
│   ├── vite-env.d.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── commitlint.config.js
├── components.json
├── index.html
├── package.json
├── postcss.config.js
└── README.md
├── tailwind.config.js
├── tsr.config.json
├── tsconfig.json
├── vite.config.ts
├── ...
```

## Contributing

We welcome contributions from the community. If you have an idea, find a bug, or want to improve the code, please create a pull request or open a new issue.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
