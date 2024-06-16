defmodule LimeLease.Repo.Migrations.CreatePropertyFiles do
  use Ecto.Migration

  def change do
    create table(:property_files, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :property_id, references(:properties, on_delete: :delete_all, type: :uuid)
      add :static_media_id, references(:static_media, on_delete: :delete_all, type: :uuid)
      add :file_name, :string, null: false

      timestamps(type: :utc_datetime_usec)
    end
  end
end
