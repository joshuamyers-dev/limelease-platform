defmodule LimeLease.Repo.Migrations.CreateTenants do
  use Ecto.Migration

  def change do
    create table(:tenants, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid)
      add :user_id, references(:users, on_delete: :nilify_all, type: :uuid)

      timestamps(type: :utc_datetime_usec)
    end

    create index(:tenants, [:property_id, :user_id])
  end
end
