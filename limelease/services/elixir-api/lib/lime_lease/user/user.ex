defmodule LimeLease.User.User do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "users" do
    field :email, :string
    field :password, :string
    field :first_name, :string
    field :last_name, :string

    has_one(:agency_agent, LimeLease.AgencyAgent.AgencyAgent)
    has_one(:agency, through: [:agency_agent, :agency])

    timestamps(type: :utc_datetime_usec)
  end

  def default_preloads(query) do
    query
    |> preload(:agency)
  end

  def with_email(query, email) do
    query
    |> where([q], q.email == ^email)
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end
end
