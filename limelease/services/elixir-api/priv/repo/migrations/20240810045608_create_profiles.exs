defmodule LimeLease.Repo.Migrations.CreateProfiles do
  use Ecto.Migration

  def change do
    create table(:profiles, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :email, :string
      add :first_name, :string
      add :last_name, :string
      add :phone_number, :string

      timestamps(type: :utc_datetime_usec)
    end

    alter table(:users) do
      add :profile_id, references(:profiles, on_delete: :delete_all, type: :uuid)
    end

    create unique_index(:profiles, [:email, :phone_number])
  end
end
