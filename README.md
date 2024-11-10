[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=quanghiep03198_FE-WMS&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=quanghiep03198_FE-WMS)

# Warehouse Management System

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=quanghiep03198_FE-WMS)

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

### Step 3: Run the application in development mode

```bash
npm run dev
```

## Usage

1. After running the `npm run dev` command, open your browser and go to `http://localhost:3000`.
2. Log in with your warehouse management account.
3. Start managing products, tracking inventory, and processing orders.
4. View UI Components documentation by running `npm run storybook`, open your browser then go to `http://localhost:6006`

## Folder Structure

```
├── .husky
├── .storybook
├── public
├── src
│   ├── app
│   ├── assets
│   ├── common
│   │   ├── constants
│   │   ├── errors
│   │   ├── hooks
│   │   ├── types
│   │   ├── hooks
│   │   └── utils
│   ├── components
│   │    ├── shared
│   │    └── ui
│   │        ├── @core
│   │        ├── @custom
│   │        ├── @hook-form
│   │        ├── @override
│   │        └── @react-table
│   ├── configs
│   ├── i18n
│   │    ├── cn
│   │    ├── en
│   │    └── vi
│   ├── providers
│   ├── services
│   ├── stores
│   ├── stories
│   ├── styles
│   ├── _app.tsx
│   ├── main.tsx
│   ├── report-web-vitals.ts
│   ├── route-tree.gen.tsx
│   └── vite-env.d.ts
├── .eslintrc.cjs
├── .prettierrc
├── .gitignore
├── commitlint.config.js
├── components.json
├── ecosystem.config.cjs
├── index.html
├── package.json
├── postcss.config.js
├── sonar-project.properties
├── README.md
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── tsr.config.json
├── vite.config.ts
└── ...
```

## Contributing

We welcome contributions from the community. If you have an idea, find a bug, or want to improve the code, please create a pull request or open a new issue.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
