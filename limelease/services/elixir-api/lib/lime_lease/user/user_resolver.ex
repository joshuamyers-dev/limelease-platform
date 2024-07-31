defmodule LimeLease.User.UserResolver do
  alias LimeLease.User.{User, UserService}

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

  def is_admin_field(%User{} = user, _args, %{context: %{current_user: _current_user}}) do
    user = user |> Ecto.preload(:agency_agent)

    case UserContext.admin_of_agency?(user) do
      {:ok, :is_admin_of_agency} -> {:ok, true}
      _ -> {:ok, false}
    end
  end
end
