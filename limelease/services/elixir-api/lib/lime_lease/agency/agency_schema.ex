defmodule LimeLease.Agency.AgencySchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :agency do
    field(:id, non_null(:id))
    field(:name, non_null(:string))
  end

  connection(node_type: :agency)

  # object :agency_queries do
  # end

  # object :agency_mutations do
  # end
end
