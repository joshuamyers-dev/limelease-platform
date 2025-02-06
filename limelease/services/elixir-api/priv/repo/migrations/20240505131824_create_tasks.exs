defmodule LimeLease.Repo.Migrations.CreateGlobalTasks do
  use Ecto.Migration

  def change do
    execute "create type task_type as enum ('compliance', 'safety', 'routine')",
    "drop type task_type"

    create table(:tasks, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string, null: false
      add :frequency_months, :integer, null: false
      add :type, :task_type, null: false
    end
  end
end
