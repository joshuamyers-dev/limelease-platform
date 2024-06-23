defmodule LimeLease.AgencyAgent.AgencyAgentSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.Authorize

  import Absinthe.Resolution.Helpers

  object :agency_agent do
    field(:id, non_null(:id))
    field(:role, non_null(:string))

    field :user, non_null(:user) do
      resolve(dataloader(LimeLease.AgencyAgent.AgencyAgentContext, :user))
    end
  end

  connection(node_type: :agency_agent)

  object :agency_agent_queries do
    @desc "Get a list of team members for your agency."
    connection field :my_team, node_type: :agency_agent do
      arg(:search_term, :string)
      middleware(Authorize)
      resolve(&LimeLease.AgencyAgent.AgencyAgentResolver.my_team_query/3)
    end
  end
end
