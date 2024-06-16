defmodule LimeLease.Repo.Migrations.CreatePropertyRequestCategories do
  use Ecto.Migration

  def change do
    create table(:property_request_categories, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :name, :string, null: false
    end

    alter table(:property_requests) do
      add :category_id, references(:property_request_categories, on_delete: :nilify_all, type: :uuid), null: false
    end

    create index(:property_requests, [:category_id])
  end
end
