defmodule LimeLease.Repo.Migrations.CreateAgencies do
  use Ecto.Migration

  def change do
    create table(:agencies, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string, null: false

      timestamps(type: :utc_datetime_usec)
    end

    alter table(:properties, primary_key: false) do
      add :agency_id, references(:agencies, on_delete: :delete_all, type: :uuid), null: false
    end

    alter table(:contractors, primary_key: false) do
      add :agency_id, references(:agencies, on_delete: :delete_all, type: :uuid), null: false
    end

    create index(:properties, [:agency_id])
    create index(:contractors, [:agency_id])
  end
end
