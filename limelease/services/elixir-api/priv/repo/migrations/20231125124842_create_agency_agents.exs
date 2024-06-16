defmodule LimeLease.Repo.Migrations.CreateAgencyAgents do
  use Ecto.Migration

  def change do
    execute "create type agency_agent_role as enum ('admin', 'property_agent')",
            "drop type agency_agent_role"

    create table(:agency_agents, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :agency_id, references(:agencies, on_delete: :nilify_all, type: :uuid), null: false
      add :user_id, references(:users, on_delete: :delete_all, type: :uuid), null: false
      add :role, :agency_agent_role, null: false, default: "property_agent"

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:agency_agents, [:agency_id, :user_id])
  end
end
