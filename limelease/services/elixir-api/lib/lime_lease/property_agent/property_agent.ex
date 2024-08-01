defmodule LimeLease.PropertyAgent.PropertyAgent do
  @moduledoc false

  use Ecto.Schema

  import Ecto.{Changeset, Query}

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_agents" do
    belongs_to(:agent, LimeLease.AgencyAgent.AgencyAgent, type: :binary_id)
    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(property_agent, attrs) do
    property_agent
    |> cast(attrs, [:agent_id, :property_id])
  end

  def default_preloads(query) do
    query
    |> preload(agent: :user)
  end

  def with_agent_id(query, id) do
    query
    |> where([q], q.agent_id == ^id)
  end

  def with_property_id(query, id) do
    query
    |> where([q], q.property_id == ^id)
  end

  def select_user_id_for_property_agent(query) do
    query
    |> join(:inner, [pa], a in assoc(pa, :agent))
    |> join(:inner, [pa, a], u in assoc(a, :user))
    |> select([pa, a, u], u.id)
  end

  def select_property_id(query) do
    query
    |> select([q], q.property_id)
  end
end
