defmodule LimeLease.AgencyAgent.AgencyAgent do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "agency_agents" do
    field :role, Ecto.Enum, values: ~w(admin property_agent)a, default: :property_agent

    belongs_to(:user, LimeLease.User.User, type: :binary_id)
    belongs_to(:agency, LimeLease.Agency.Agency, type: :binary_id)
  end

  def default_preloads(query) do
    query
    |> preload(user: [:agency])
  end

  def with_agency(query, id) do
    query
    |> where([q], q.agency_id == ^id)
  end

  def order_by_name(query) do
    query
    |> join(:inner, [q], u in assoc(q, :user))
    |> order_by([q, u], u.name)
  end

  def search_by_name(query, name) do
    name = LimeLease.Helpers.format_search_keywords_ts_query(name)

    query
    |> join(:inner, [q], u in assoc(q, :user))
    |> where([q, u], fragment("? @@ to_tsquery('english', ?)", u.name, ^name))
  end
end
