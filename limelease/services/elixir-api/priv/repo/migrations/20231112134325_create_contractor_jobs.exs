defmodule LimeLease.Repo.Migrations.CreateContractorJobs do
  use Ecto.Migration

  def change do
    execute "create type contractor_job_state as enum ('sent', 'quote_booked', 'quoted_priced', 'job_booked', 'job_completed', 'archived', 'job_cancelled')",
            "drop type contractor_job_state"

    create table(:contractor_jobs, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :contractor_id, references(:contractors, on_delete: :delete_all, type: :uuid), null: false
      add :request_id, references(:property_requests, on_delete: :delete_all, type: :uuid), null: false
      add :description, :string, null: false
      add :state, :contractor_job_state, default: "sent", null: false
      add :booking_date_start, :utc_datetime_usec
      add :booking_date_end, :utc_datetime_usec

      timestamps(type: :utc_datetime_usec)
    end

    create index(:contractor_jobs, [:contractor_id, :request_id, :state])
  end
end
