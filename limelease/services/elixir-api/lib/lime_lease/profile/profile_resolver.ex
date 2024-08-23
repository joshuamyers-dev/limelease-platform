defmodule LimeLease.Profile.ProfileResolver do
  alias LimeLease.Profile.ProfileContext

  def update_profile_mutation(
        _parent,
        %{email: email, first_name: first_name, last_name: last_name, phone_number: phone_number},
        %{
          context: %{current_user: user}
        }
      ) do
    ProfileContext.update_profile(user.profile, %{
      email: email,
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number
    })
  end
end
