defmodule LimeLease.Repo.Migrations.CreatePropertyFiles do
  use Ecto.Migration

  def change do
    execute "create type property_file_type as enum ('contract', 'condition_report', 'rtba_form', 'other')",
    "drop type property_file_type"

    create table(:property_files, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid)
      add :static_media_id, references(:static_media, on_delete: :delete_all, type: :uuid)
      add :file_name, :string, null: false
      add :file_type, :string, null: false
      add :type, :property_file_type, default: "other", null: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:property_files, [:property_id])
  end
end
