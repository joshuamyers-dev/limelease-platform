defmodule LimeLease.AgencyAgent.AgencyAgentResolver do
  @moduledoc false
  alias LimeLease.AgencyAgent.AgencyAgentContext

alias LimeLease.Repo

  require IEx

  def my_team_query(_parent, pagination_args, %{context: %{current_user: current_user}}) do
    search_term = Map.get(pagination_args, :search_term)

    AgencyAgentContext.fetch_team_members_for_agency(current_user.agency.id, search_term, pagination_args)
  end
end
