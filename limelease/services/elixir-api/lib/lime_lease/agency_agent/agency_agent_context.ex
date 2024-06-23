defmodule LimeLease.AgencyAgent.AgencyAgentContext do
  @moduledoc false

  require IEx
  alias LimeLease.AgencyAgent.AgencyAgent
  alias LimeLease.Repo

  def fetch_team_members_for_agency(agency_id, search_term, pagination_args) do
    AgencyAgent
    |> AgencyAgent.with_agency(agency_id)
    |> apply_search(search_term)
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  defp apply_search(query, nil = _search_term), do: query
  defp apply_search(query, search_term) when is_binary(search_term) do
    query |> AgencyAgent.search_by_name(search_term)
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
