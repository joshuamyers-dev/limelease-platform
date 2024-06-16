defmodule LimeLease.Repo.Migrations.CreateContractors do
  use Ecto.Migration

  def change do
    create table(:contractors, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :business_name, :string, non_null: true
      add :website_url, :string
      add :contact_email, :string
      add :contact_number, :string
      add :areas_served, {:array, :string}
      add :address, {:map, :string}

      timestamps(type: :utc_datetime_usec)
    end

    execute("CREATE INDEX contractors_trgm_idx ON contractors USING GIN (to_tsvector('english', business_name || ' ' ))")
  end
end
