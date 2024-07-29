defmodule LimeLease.Repo.Migrations.CreatePropertyAgents do
  use Ecto.Migration

  def change do
    create table(:property_agents, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid), null: false
      add :agent_id, references(:agency_agents, on_delete: :delete_all, type: :uuid), null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:property_agents, [:agent_id, :property_id])
  end
end
