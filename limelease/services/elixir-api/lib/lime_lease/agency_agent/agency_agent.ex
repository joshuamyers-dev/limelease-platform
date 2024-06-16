defmodule LimeLease.AgencyAgent.AgencyAgent do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "agency_agents" do
    field :role, Ecto.Enum, values: ~w(admin property_agent)a, default: :property_agent

    belongs_to(:user, LimeLease.User.User, type: :binary_id)
    belongs_to(:agency, LimeLease.Agency.Agency, type: :binary_id)
  end
end
