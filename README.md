🍋 LimeLease

LimeLease is a compliance-first lease management platform designed for landlords, tenants, and businesses to streamline lease agreements, documentation, and compliance tracking.

🚀 Features

📜 Lease Management – Store, manage, and access lease agreements in one place.
✅ Compliance Tracking – Ensure adherence to legal requirements with automated tracking.
🔔 Notifications & Reminders – Get alerts for lease renewals, compliance deadlines, and document updates.
📂 Document Storage – Securely store and manage important leasing documents.
🛠 Tech Stack

LimeLease is built as a monorepo with multiple services:

Backend: Elixir (Phoenix Framework with Absinthe for GraphQL)
Frontend: Next.js
Tenant Application: React Native
Services: AWS Lambda (Node.js) for scraping real estate listing data
Database: PostgreSQL
Authentication: OAuth / JWT-based authentication
Hosting: AWS
📖 Getting Started

Prerequisites
Elixir & Phoenix
Node.js
PostgreSQL
Docker
Installation
Clone the repository:
git clone https://github.com/your-username/limelease.git
cd limelease
Install frontend dependencies:
cd apps/frontend
npm install
npm run dev
Install backend dependencies and start the server:
cd apps/backend
mix deps.get
mix ecto.setup
mix phx.server
(Optional) Run AWS Lambda service locally:
cd services/scraper
npm install
serverless offline
📌 Roadmap

 MVP with lease storage & basic compliance tracking
 Automated reminders & notifications
 AI-powered lease document analysis
🤝 Contributing

We welcome contributions! Feel free to submit PRs or create issues.

Fork the repository.
Create a new feature branch (git checkout -b feature-new).
Commit your changes (git commit -m "Add new feature").
Push to the branch (git push origin feature-new).
Open a pull request.
📜 License

MIT License © 2025 LimeLease
