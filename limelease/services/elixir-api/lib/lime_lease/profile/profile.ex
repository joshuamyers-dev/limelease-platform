defmodule LimeLease.Profile.Profile do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query
  import LimeLease.ChangesetHelpers

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "profiles" do
    field :email, :string
    field :first_name, :string
    field :last_name, :string
    field :phone_number, :string

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(profile, attrs \\ %{}) do
    profile
    |> cast(attrs, [:email, :first_name, :last_name, :phone_number])
    |> validate_required([:email, :first_name, :last_name, :phone_number])
    |> validate_contact_number(:phone_number)
    |> validate_email(:email)
    |> unique_constraint([:email, :phone_number])
    |> format_contact_number(:phone_number)
  end
end
