defmodule LimeLease.Repo.Migrations.CreateGlobalTasks do
  use Ecto.Migration

  def change do
    create table(:tasks, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :task_description, :string, null: false
    end
  end
end
