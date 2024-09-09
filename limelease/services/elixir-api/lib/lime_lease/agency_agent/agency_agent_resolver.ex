defmodule LimeLease.AgencyAgent.AgencyAgentResolver do
  @moduledoc false
  alias LimeLease.AgencyAgent.AgencyAgentService
  alias LimeLease.AgencyAgent.AgencyAgentContext

alias LimeLease.Repo

  require IEx

  def my_team_query(_parent, pagination_args, %{context: %{current_user: current_user}}) do
    search_term = Map.get(pagination_args, :search_term)

    AgencyAgentContext.fetch_team_members_for_agency(current_user.agency.id, search_term, pagination_args)
  end

  def team_member_invite_mutation(_parent, %{input: input_args}, %{context: %{current_user: current_user}}) do
    AgencyAgentService.create_team_member_for_agency(current_user.agency.id, input_args)
  end
end
