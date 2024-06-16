defmodule LimeLease.PropertyAgent.PropertyAgent do
  @moduledoc false

  use Ecto.Schema

  import Ecto.{Changeset, Query}

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_agents" do
    belongs_to(:user, LimeLease.User.User, type: :binary_id)
    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(property_agent, attrs) do
    property_agent
    |> cast(attrs, [:user_id, :property_id])
  end

  def with_user_id(query, id) do
    query
    |> where([q], q.user_id == ^id)
  end

  def with_property_id(query, id) do
    query
    |> where([q], q.property_id == ^id)
  end

  def select_property_id(query) do
    query
    |> select([q], q.property_id)
  end

  def select_user_id(query) do
    query
    |> select([q], q.user_id)
  end
end
