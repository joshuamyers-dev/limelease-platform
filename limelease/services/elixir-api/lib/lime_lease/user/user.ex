defmodule LimeLease.User.User do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "users" do
    field :password, :string
    field :fcm_tokens, {:array, :string}

    belongs_to(:profile, LimeLease.Profile.Profile, foreign_key: :profile_id, type: :binary_id)
    has_one(:tenant, LimeLease.Tenant.Tenant)
    has_one(:agency_agent, LimeLease.AgencyAgent.AgencyAgent)
    has_one(:agency, through: [:agency_agent, :agency])

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(user, attrs) do
    user
    |> cast(attrs, [:password])
    |> cast_assoc(:profile, with: &LimeLease.Profile.Profile.create_changeset/2, required: true)
  end

  def update_changeset(user, attrs) do
    user
    |> cast(attrs, [:fcm_tokens])
    |> validate_length(:fcm_tokens, min: 1)
  end

  def default_preloads(query) do
    query
    |> preload([:agency, :tenant, :profile])
  end

  def with_email(query, email) do
    query
    |> join(:inner, [q], p in assoc(q, :profile))
    |> where([q, p], p.email == ^email)
  end

  def with_phone_number(query, phone_number) do
    query
    |> where([q], q.phone_number == ^phone_number)
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end
end
