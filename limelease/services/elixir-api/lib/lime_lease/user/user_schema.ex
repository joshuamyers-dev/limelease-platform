defmodule LimeLease.User.UserSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, EctoErrors}

  import Absinthe.Resolution.Helpers

  object :user do
    field :id, non_null(:id)
    field :email, non_null(:string)
    field :password, :string
    field :first_name, :string
    field :last_name, :string

    field :agency, :agency do
      resolve(dataloader(LimeLease.User.UserContext, :agency))
    end
  end

  object :session do
    field(:token, non_null(:string))
    field(:user, non_null(:user))
  end

  connection(node_type: :user)

  object :user_queries do
    @desc "Returns the current user's account"
    field :me, :user do
      resolve(&LimeLease.User.UserResolver.me_query/3)
    end
  end

  object :user_mutations do
    @desc "Login a user with email and password"
    field :user_login, non_null(:session) do
      arg(:email, non_null(:string))
      arg(:password, non_null(:string))

      middleware(fn resolution, _ ->
        case resolution.value do
          %{user: user} ->
            Map.update!(resolution, :context, &Map.put(&1, :current_user, user))

          _ ->
            resolution
        end
      end)

      resolve(&LimeLease.User.UserResolver.login_mutation/3)
    end
  end
end
