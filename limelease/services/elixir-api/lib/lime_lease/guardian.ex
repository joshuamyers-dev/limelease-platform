defmodule LimeLease.Guardian do
  use Guardian, otp_app: :lime_lease

  def subject_for_token(%LimeLease.User.User{} = user, _claims) do
    sub = to_string(user.id)
    {:ok, sub}
  end

  def subject_for_token(%{id: id}, _claims) do
    sub = to_string(id)

    {:ok, sub}
  end

  def resource_from_claims(%{"sub" => id}) do
    LimeLease.User.UserContext.get_user_by_id(id)
  end

  def resource_from_claims(_claims) do
    {:error, :reason_for_error}
  end

  def resource_from_claims(_) do
    {:ok, nil}
  end
end
