defmodule LimeLease.Lease.LeaseSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :lease do
    field(:id, non_null(:id))
    field(:start_date, :datetime)
    field(:end_date, :datetime)
    field(:rent_pcm, :float)

    field :property, non_null(:property) do
      resolve(dataloader(LimeLease.Lease.LeaseContext, :property))
    end

    field :tenants, non_null(list_of(:tenant)) do
      resolve(dataloader(LimeLease.Lease.LeaseContext, :tenants))
    end

    field(:is_active, :boolean) do
      resolve(&LimeLease.Lease.LeaseResolver.lease_is_active_field/3)
    end
  end

  connection(node_type: :lease)

  # object :lease_queries do
  # end

  # object :lease_mutations do
  # end
end
