defmodule LimeLease.Repo.Migrations.CreatePropertyRequests do
  use Ecto.Migration

  def change do
    execute "create type property_request_state as enum ('awaiting_response', 'assigned_to_contractor', 'contractor_appointment_booked', 'resolved', 'deleted')",
            "drop type property_request_state"

    execute "create type property_request_urgency as enum ('low', 'mid_high', 'emergency')",
            "drop type property_request_urgency"

    create table(:property_requests, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :ticket_number, :string, null: false, unique: true
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid), null: false
      add :tenant_id, references(:tenants, on_delete: :nilify_all, type: :uuid)
      add :state, :property_request_state, null: false
      add :title, :string, null: false
      add :details, :string, null: false
      add :urgency, :property_request_urgency, null: false
      add :photos, :map

      timestamps(type: :utc_datetime_usec)
    end

    create index(:property_requests, [:property_id, :tenant_id, :state])
    create unique_index(:property_requests, [:ticket_number])
  end
end
