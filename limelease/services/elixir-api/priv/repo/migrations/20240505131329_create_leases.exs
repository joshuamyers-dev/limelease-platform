defmodule LimeLease.Repo.Migrations.CreateLeases do
  use Ecto.Migration

  def change do
    create table(:leases, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid)
      add :start_date,  :utc_datetime_usec, null: false
      add :end_date,  :utc_datetime_usec, null: false
      add :rent_pcm, :float, null: false

      timestamps(type: :utc_datetime_usec)
    end

    alter table(:tenants) do
      add :lease_id, references(:leases, on_delete: :delete_all, type: :uuid)
    end
  end
end
