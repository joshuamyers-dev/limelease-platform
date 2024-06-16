defmodule LimeLease.Repo.Migrations.CreatePropertyRequestComments do
  use Ecto.Migration

  def change do
    create table(:property_request_comments, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :request_id, references(:property_requests, on_delete: :delete_all, type: :uuid), null: false
      add :author_name, :string, null: false
      add :message_body, :string, null: false
      add :system_generated, :boolean, default: false

      timestamps(type: :utc_datetime_usec)
    end

    create index(:property_request_comments, [:request_id])
  end
end
