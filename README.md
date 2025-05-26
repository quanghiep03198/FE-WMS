[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=quanghiep03198_FE-WMS&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=quanghiep03198_FE-WMS)

# Warehouse Management System

[![SonarCloud](https://sonarcloud.io/images/project_badges/sonarcloud-black.svg)](https://sonarcloud.io/summary/new_code?id=quanghiep03198_FE-WMS)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Stack](#technologies-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The warehouse management project helps you manage inventory, track shipments, and process orders efficiently. The application utilizes modern technologies like React and TypeScript to ensure stability and maintainability.

## Features

- Inventory Tracking: Update inventory quantities.
- Order Processing Manage Order Statuses.
- Generating Reports.
- Exchange & Return Management.
- Warehouse Import & Export Management.

## Technologies Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Zustand](https://img.shields.io/badge/zustand-%23443e38?style=for-the-badge)
![Tanstack Router](https://img.shields.io/badge/tanstack_router-%2310b981?style=for-the-badge&logo=react&logoColor=white)
![Tanstack Query](https://img.shields.io/badge/-Tanstack%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)
![Tanstack Table](https://img.shields.io/badge/Tanstack_Table-%233b82f6?style=for-the-badge&logo=reacttable&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Radix UI](https://img.shields.io/badge/radix%20ui-161618.svg?style=for-the-badge&logo=radix-ui&logoColor=white)
![Shadcn/UI](https://img.shields.io/badge/shadcn%2Fui-black?style=for-the-badge&logo=shadcnui)
![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)
![Storybook](https://img.shields.io/badge/-Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white)
![Sentry](https://img.shields.io/badge/sentry-%23362D59.svg?style=for-the-badge&logo=sentry&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Vitest](https://img.shields.io/badge/-Vitest-252529?style=for-the-badge&logo=vitest&logoColor=FCC72B)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)

## Installation & Requirements

**Node.js** version >= 20.14.0.

### Step 1: Clone the repository

```bash
git clone <repository-url> <repository-directory>
cd <repository-directory>
```

### Step 2: Install dependencies

```bash
pnpm install
```

### Step 3: Run the application in development mode

```bash
pnpm dev
```

## Usage

1. After running the `pnpm dev` command, open your browser and go to `http://localhost:3000`.
2. Log in with your warehouse management account.
3. Start managing products, tracking inventory, and processing orders.
4. View UI Components documentation by running `pnpm storybook`, open your browser then go to `http://localhost:6006`

## Folder Structure

```
├── .github
├── .husky
├── .storybook
├── infrastructure
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
├── tests
│   ├── components
│   ├── hooks
│   ├── utils
│   └── setup.ts
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
