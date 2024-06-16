defmodule LimeLease.Repo.Migrations.CreateProperties do
  use Ecto.Migration

  def change do
    create table(:properties, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :address, {:map, :string}
      add :bedrooms, :integer
      add :bathrooms, :integer
      add :carspaces, :integer
      add :photos, :map
      add :landlords, :map
      add :files, :map

      timestamps(type: :utc_datetime_usec)
    end

    execute("""
    ALTER TABLE properties
    ADD COLUMN address_tsvector tsvector GENERATED ALWAYS AS (
      setweight(to_tsvector('english', coalesce(address->>'street_name', '')), 'A') ||
      setweight(to_tsvector('english', coalesce(address->>'street_type', '')), 'A') ||
      setweight(to_tsvector('english', coalesce(address->>'unit_number'::text, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(address->>'street_number'::text, '')), 'B') ||
      setweight(to_tsvector('english', coalesce(address->>'suburb', '')), 'C') ||
      setweight(to_tsvector('english', coalesce(address->>'state', '')), 'C') ||
      setweight(to_tsvector('english', coalesce(address->>'postcode'::text, '')), 'D')
    ) STORED
    """)

    execute("""
    CREATE INDEX properties_address_tsvector_idx
    ON properties
    USING gin(address_tsvector);
    """)
  end
end
