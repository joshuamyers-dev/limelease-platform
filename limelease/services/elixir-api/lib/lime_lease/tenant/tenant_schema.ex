defmodule LimeLease.Tenant.TenantSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :tenant do
    field(:id, non_null(:id))
    field :first_name, non_null(:string)
    field :last_name, non_null(:string)
    field :phone_number, non_null(:string)
    field :email, non_null(:string)
  end

  connection(node_type: :tenant)

  # object :tenant_queries do
  # end

  # object :tenant_mutations do
  # end
end
