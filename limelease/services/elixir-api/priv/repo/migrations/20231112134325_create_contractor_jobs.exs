defmodule LimeLease.Repo.Migrations.CreateContractorJobs do
  use Ecto.Migration

  def change do
    create table(:contractor_jobs, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :contractor_id, references(:contractors, on_delete: :delete_all, type: :uuid), null: false
      add :request_id, references(:property_requests, on_delete: :delete_all, type: :uuid), null: false
      add :description, :string, null: false
      add :booking_date_start, :utc_datetime_usec
      add :booking_date_end, :utc_datetime_usec
      add :archived_at, :utc_datetime_usec

      timestamps(type: :utc_datetime_usec)
    end

    create index(:contractor_jobs, [:contractor_id, :request_id])
  end
end
