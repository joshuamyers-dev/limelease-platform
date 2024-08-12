defmodule LimeLease.Tenant.TenantSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :tenant do
    field(:id, non_null(:id))

    field :user, non_null(:user) do
      resolve(dataloader(LimeLease.Tenant.TenantContext, :user))
    end

    field :property, non_null(:property) do
      resolve(dataloader(LimeLease.Tenant.TenantContext, :property))
    end
  end

  connection(node_type: :tenant)

  # object :tenant_queries do
  # end

  # object :tenant_mutations do
  # end
end
