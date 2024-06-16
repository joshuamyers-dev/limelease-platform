defmodule LimeLease.User.UserService do
  alias LimeLease.User.UserContext
  alias LimeLease.User.User

  alias LimeLease.Guardian

  require IEx

  def login_with_email(email, password) do
    with {:ok, %User{} = user} <- UserContext.get_user_by_email(email),
         {:ok, :password_correct} <- verify_password(password, user.password),
         {:ok, token, _claims} <- Guardian.encode_and_sign(user) do
      {:ok, %{token: token, user: user}}
    else
      {:error, :not_found} -> {:error, "This email address is not yet registered. Please contact your administrator to register your account."}
      {:error, :password_incorrect} -> {:error, "The password you entered is incorrect. Please try again."}
    end
  end

  def verify_password(password, stored_password) do
    case Bcrypt.verify_pass(password, stored_password) do
      true -> {:ok, :password_correct}
      false -> {:error, :password_incorrect}
    end
  end
end
