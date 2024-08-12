defmodule LimeLease.Tenant.Tenant do
  @moduledoc false

  use Ecto.Schema

  import Ecto.{Changeset, Query}
  import LimeLease.ChangesetHelpers

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "tenants" do
    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)
    belongs_to(:user, LimeLease.User.User, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(tenant, attrs) do
    tenant
    |> cast(attrs, [])
    |> cast_assoc(:user, with: &LimeLease.User.User.create_changeset/2, required: true)
  end

  def update_changeset(tenant, attrs) do
    tenant
    |> cast(attrs, [:phone_number])
    |> validate_required([:phone_number])
    |> validate_contact_number(:phone_number)
    |> format_contact_number(:phone_number)
  end

  def default_preloads(query) do
    query
    |> preload(:user)
  end

  def with_phone_number(query, phone_number) do
    query
    |> join(:inner, [q], u in assoc(q, :user))
    |> join(:inner, [q, u], p in assoc(u, :profile))
    |> where([q, u, p], p.phone_number == ^phone_number)
  end
end
