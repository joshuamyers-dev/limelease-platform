defmodule LimeLease.Agency.Agency do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "agencies" do
    field(:name, :string)

    has_many(:agents, LimeLease.AgencyAgent.AgencyAgent)

    timestamps(type: :utc_datetime_usec)
  end
end
