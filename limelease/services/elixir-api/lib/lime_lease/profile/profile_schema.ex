defmodule LimeLease.Profile.ProfileSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :profile do
    field :id, non_null(:id)
    field :email, :string
    field :first_name, :string
    field :last_name, :string
    field :phone_number, :string
  end

  connection(node_type: :profile)
end
