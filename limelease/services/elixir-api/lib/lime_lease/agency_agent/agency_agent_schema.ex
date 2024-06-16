defmodule LimeLease.AgencyAgent.AgencyAgentSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :agency_agent do
    field(:id, non_null(:id))
  end

  connection(node_type: :agency_agent)

  object :agency_agent_queries do
  end

  object :agency_agent_mutations do
  end
end
