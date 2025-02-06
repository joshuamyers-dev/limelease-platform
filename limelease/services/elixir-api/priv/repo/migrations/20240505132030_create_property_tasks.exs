defmodule LimeLease.Repo.Migrations.CreatePropertyAgentTasks do
  use Ecto.Migration

  def change do
    create table(:property_tasks, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :task_id, references(:tasks, on_delete: :delete_all, type: :uuid)
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid)
      add :due_date, :utc_datetime_usec, null: false
      add :completed_at, :utc_datetime_usec, null: false
      add :completed, :boolean, default: false, null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:property_tasks, [:task_id, :property_id, :due_date])
  end
end
