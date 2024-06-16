defmodule LimeLease.Tenant.Tenant do
  @moduledoc false

  use Ecto.Schema

  import Ecto.{Changeset, Query}
  import LimeLease.ChangesetHelpers

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "tenants" do
    field :first_name, :string
    field :last_name, :string
    field :phone_number, :string
    field :email, :string

    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)
    belongs_to(:user, LimeLease.User.User, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(tenant, attrs) do
    tenant
    |> cast(attrs, [:first_name, :last_name, :phone_number, :email])
    |> validate_required([:first_name, :last_name, :phone_number, :email])
    |> validate_email(:email)
    |> validate_contact_number(:phone_number)
    |> format_contact_number(:phone_number)
    |> put_assoc(:user, attrs[:user])
  end

  def update_changeset(tenant, attrs) do
    tenant
    |> cast(attrs, [:first_name, :last_name, :phone_number, :email])
    |> validate_required([:first_name, :last_name, :phone_number, :email])
    |> validate_email(:email)
    |> validate_contact_number(:phone_number)
    |> format_contact_number(:phone_number)
  end
end
