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

    field :properties, list_of(:property) do
      resolve(dataloader(LimeLease.AgencyAgent.AgencyAgentContext, :properties))
    end
  end

  input_object :team_member_invite_args do
    field(:email, non_null(:string))
    field(:role, non_null(:string))
    field(:first_name, non_null(:string))
    field(:last_name, non_null(:string))
    field(:phone_number, non_null(:string))
    field(:assigned_property_ids, non_null(list_of(:string)))
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

  object :agency_agent_mutations do
    @desc "Invite a new team member to your agency."
    field :team_member_invite, :agency_agent do
      arg(:input, non_null(:team_member_invite_args))
      middleware(Authorize)
      resolve(&LimeLease.AgencyAgent.AgencyAgentResolver.team_member_invite_mutation/3)
    end
  end
end
