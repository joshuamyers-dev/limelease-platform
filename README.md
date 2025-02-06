# 🍋 LimeLease/Occupie

**LimeLease** (or Occupie) is a **compliance-first lease management platform** designed for **landlords, tenants, and agencies** to streamline tenant requests, lease agreements, documentation, and compliance tracking.

## 🚀 Features

- 🏠 **Property Management** - Add properties and assign tenants to the properties.
- 📜 **Lease Management** – Store, manage, and access lease agreements in one place.
- 🔧 **Manage Tenant Requests** – Tenants submit requests and these requests can be assigned to contractors who can mark the request as completed through SMS.
- ✅ **Compliance Tracking** – Ensure adherence to legal requirements with automated tracking.
- 🔔 **Notifications & Reminders** – Get alerts for lease renewals, compliance deadlines, and document updates.
- 📂 **Document Storage** – Securely store and manage important leasing documents.

## 🛠 Tech Stack

LimeLease is built as a **monorepo** with multiple services:

- **Backend:** Elixir (Phoenix Framework with Absinthe for GraphQL)
- **Frontend (Web):** Next.js
- **Frontend (Mobile):** React Native
- **Services:** AWS Lambda (Node.js) for scraping real estate listing data using Puppeteer
- **Database:** PostgreSQL
- **Authentication:** JWT-based authentication
- **IaC:** AWS using the SST Framework/Pulumi
  - VPC, ECS (Fargate) with auto scaling, S3, API Gateway (Lambda) for hosting scraping and snapshotting services

## 📖 Getting Started

### Prerequisites

- [Elixir & Phoenix](https://www.phoenixframework.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

### 📖 Getting Started

#### Prerequisites

- [Elixir & Phoenix](https://www.phoenixframework.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

#### Installation

```sh
# Clone the repository
git clone https://github.com/your-username/limelease.git
cd limelease

# Install frontend (web) dependencies
cd apps/nextjs-app
npm install
npm run dev

# Install frontend (mobile) dependencies
cd ../apps/tenant-mobile
npm install && cd ios && pod install
iOS - npm run ios
Android - npm run android

# Install backend dependencies and start the server
cd ../services/elixir-api
mix deps.get
mix ecto.setup
mix phx.server
