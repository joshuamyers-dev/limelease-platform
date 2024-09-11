defmodule LimeLease.User.UserResolver do
  alias LimeLease.User.{User, UserContext, UserService}

  require IEx

  def me_query(_parent, _args, %{
        context: %{
          current_user: current_user
        }
      }) do
    {:ok, current_user}
  end

  def me_query(_parent, _args, %{context: context}) do
    {:ok, nil}
  end

  def login_mutation(_parent, %{email: email, password: password}, _resolver) do
    UserService.login_with_email(email, password)
  end

  def user_send_otp_mutation(_parent, %{mobile_number: mobile_number}, _resolver) do
    UserService.send_otp(mobile_number)
  end

  def user_verify_otp_mutation(_parent, %{mobile_number: mobile_number, code: code}, _resolver) do
    UserService.verify_otp(mobile_number, code)
  end

  def user_add_fcm_token_mutation(_parent, %{token: token}, %{context: %{current_user: %User{} = current_user}}) do
    UserService.add_fcm_token_for_user(token, current_user)
  end

  def is_admin_field(%User{} = user, _args, %{context: %{current_user: _current_user}}) do
    user = user |> Ecto.preload(:agency_agent)

    case UserContext.admin_of_agency?(user) do
      :ok -> {:ok, true}
      _ -> {:ok, false}
    end
  end

  def role_field(%User{} = user, _args, %{context: %{current_user: _current_user}}) do
    user = user |> Ecto.preload([:tenant, :agency])

    cond do
      user.tenant != nil -> {:ok, :tenant}
      user.agency != nil -> {:ok, :agent}
    end
  end
end
