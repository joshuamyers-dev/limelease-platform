defmodule LimeLease.Lease.Lease do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "leases" do
    field :start_date, :utc_datetime_usec
    field :end_date, :utc_datetime_usec
    field :rent_pcm, :float

    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)
    has_many(:tenants, LimeLease.Tenant.Tenant, foreign_key: :lease_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(lease, attrs) do
    lease
    |> cast(attrs, [:start_date, :end_date, :rent_pcm, :property_id])
    |> validate_required([:start_date, :end_date, :rent_pcm])
    |> foreign_key_constraint(:property_id)
  end
end
