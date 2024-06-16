defmodule LimeLease.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :email, :string
      add :password, :string
      add :first_name, :string
      add :last_name, :string

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:users, [:email])
  end
end
