defmodule LimeLease.PropertyAgent.PropertyAgentSchema do
  @moduledoc false
  alias LimeLeaseWeb.Middleware.Authorize

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :property_agent do
    field(:id, non_null(:id))

    field(:agent, :agency_agent) do
      resolve(dataloader(LimeLease.PropertyAgent.PropertyAgentContext, :agent))
    end
  end

  connection(node_type: :property_agent)
end
