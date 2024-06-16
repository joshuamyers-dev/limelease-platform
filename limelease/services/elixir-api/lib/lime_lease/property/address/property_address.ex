defmodule LimeLease.Property.Address do
  use Ecto.Schema

  import Ecto.{Changeset}

  embedded_schema do
    field :postcode, :integer
    field :state, :string
    field :street_name, :string
    field :street_number, :integer
    field :street_type, :string
    field :suburb, :string
    field :unit_number, :integer
  end

  def create_changeset(address, attrs) do
    address
    |> cast(attrs, [:postcode, :state, :street_name, :street_number, :street_type, :suburb, :unit_number])
    |> validate_required([:postcode, :state, :street_name, :street_number, :street_type, :suburb])
  end
end
