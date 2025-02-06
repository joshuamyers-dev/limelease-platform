# 🍋 LimeLease

**LimeLease** is a **compliance-first lease management platform** designed for **landlords, tenants, and businesses** to streamline lease agreements, documentation, and compliance tracking.

## 🚀 Features

- 📜 **Lease Management** – Store, manage, and access lease agreements in one place.
- ✅ **Compliance Tracking** – Ensure adherence to legal requirements with automated tracking.
- 🔔 **Notifications & Reminders** – Get alerts for lease renewals, compliance deadlines, and document updates.
- 📂 **Document Storage** – Securely store and manage important leasing documents.

## 🛠 Tech Stack

LimeLease is built as a **monorepo** with multiple services:

- **Backend:** Elixir (Phoenix Framework with Absinthe for GraphQL)
- **Frontend:** Next.js
- **Tenant Application:** React Native
- **Services:** AWS Lambda (Node.js) for scraping real estate listing data
- **Database:** PostgreSQL
- **Authentication:** OAuth / JWT-based authentication
- **Hosting:** AWS

## 📖 Getting Started

### Prerequisites

- [Elixir & Phoenix](https://www.phoenixframework.org/)
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/limelease.git
   cd limelease
# 🍋 LimeLease

**LimeLease** is a **compliance-first lease management platform** designed for **landlords, tenants, and businesses** to streamline lease agreements, documentation, and compliance tracking.

## 🚀 Features

- 📜 **Lease Management** – Store, manage, and access lease agreements in one place.
- ✅ **Compliance Tracking** – Ensure adherence to legal requirements with automated tracking.
- 🔔 **Notifications & Reminders** – Get alerts for lease renewals, compliance deadlines, and document updates.
- 📂 **Document Storage** – Securely store and manage important leasing documents.

## 🛠 Tech Stack

LimeLease is built as a **monorepo** with multiple services:

- **Backend:** Elixir (Phoenix Framework with Absinthe for GraphQL)
- **Frontend:** Next.js
- **Tenant Application:** React Native
- **Services:** AWS Lambda (Node.js) for scraping real estate listing data
- **Database:** PostgreSQL
- **Authentication:** OAuth / JWT-based authentication
- **Hosting:** AWS

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

# Install frontend dependencies
cd apps/frontend
npm install
npm run dev

# Install backend dependencies and start the server
cd ../backend
mix deps.get
mix ecto.setup
mix phx.server
