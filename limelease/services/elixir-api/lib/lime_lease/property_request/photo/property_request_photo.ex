defmodule LimeLease.PropertyRequest.PropertyRequestPhoto do
  @moduledoc false

  use Ecto.Schema

  embedded_schema do
    field :order, :integer

    belongs_to(:static_media, LimeLease.StaticMedia.StaticMedia, type: :binary_id)
  end
end
