defmodule LimeLease.Notification.Notification do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "notification" do

  end
end
