defmodule LimeLease.User.UserResolver do
  alias LimeLease.User.UserService

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
end
