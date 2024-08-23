defmodule LimeLease.Profile.ProfileSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.Authorize

  import Absinthe.Resolution.Helpers

  object :profile do
    field :id, non_null(:id)
    field :email, :string
    field :first_name, :string
    field :last_name, :string
    field :phone_number, :string
  end

  connection(node_type: :profile)

  object :profile_mutations do
    @desc "Update the current user's profile."
    field :update_profile, non_null(:profile) do
      arg(:email, non_null(:string))
      arg(:first_name, non_null(:string))
      arg(:last_name, non_null(:string))
      arg(:phone_number, non_null(:string))

      middleware(Authorize)

      resolve(&LimeLease.Profile.ProfileResolver.update_profile_mutation/3)
    end
  end
end
