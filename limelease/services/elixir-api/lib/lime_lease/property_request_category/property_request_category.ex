defmodule LimeLease.PropertyRequestCategory.PropertyRequestCategory do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_request_categories" do
    field :name, :string
  end
end
