defmodule LimeLease.User.UserSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, EctoErrors}

  import Absinthe.Resolution.Helpers



  object :user do
    field :id, non_null(:id)

    field :profile, non_null(:profile) do
      resolve(dataloader(LimeLease.User.UserContext, :profile))
    end

    field :agency, :agency do
      resolve(dataloader(LimeLease.User.UserContext, :agency))
    end

    field :tenant, :tenant do
      resolve(dataloader(LimeLease.User.UserContext, :tenant))
    end

    field :is_admin, non_null(:boolean) do
      resolve(&LimeLease.User.UserResolver.is_admin_field/3)
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

    @desc "Send OTP code for user (tenant) login"
    field :user_send_otp, non_null(:boolean) do
      arg(:mobile_number, non_null(:string))

      resolve(&LimeLease.User.UserResolver.user_send_otp_mutation/3)
    end

    @desc "Verify OTP code for user (tenant) login"
    field :user_verify_otp, non_null(:session) do
      arg(:mobile_number, non_null(:string))
      arg(:code, non_null(:string))

      resolve(&LimeLease.User.UserResolver.user_verify_otp_mutation/3)
    end
  end
end
