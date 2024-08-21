defmodule LimeLease.Profile.ProfileContext do
  @moduledoc false

  alias LimeLease.Repo

  def get_profile_by_email_and_number(email, phone_number) do
    Repo.get_by(LimeLease.Profile.Profile, email: email, phone_number: phone_number)
    |> Repo.ok_error()
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
