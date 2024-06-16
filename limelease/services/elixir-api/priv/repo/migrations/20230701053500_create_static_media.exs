defmodule LimeLease.Repo.Migrations.CreateStaticMedia do
  use Ecto.Migration

  def change do
    create table(:static_media, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :s3_key, :string
      add :mime_type, :string

      timestamps(type: :utc_datetime_usec)
    end
  end
end
