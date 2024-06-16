defmodule LimeLease.Property.PropertyLandlord do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import LimeLease.ChangesetHelpers

  embedded_schema do
    field :first_name, :string
    field :last_name, :string
    field :phone_number, :string
    field :email, :string
  end

  def changeset(property_landlord, attrs) do
    property_landlord
    |> cast(attrs, [:first_name, :last_name, :phone_number, :email])
    |> validate_required([:first_name, :last_name, :phone_number, :email])
    |> validate_email(:email)
    |> validate_contact_number(:phone_number)
    |> format_contact_number(:phone_number)
  end
end
