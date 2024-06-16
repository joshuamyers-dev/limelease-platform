defmodule LimeLease.StaticMedia.StaticMedia do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "static_media" do
    field :s3_key, :string
    field :mime_type, :string

    timestamps()
  end

  def changeset(static_media, attrs) do
    static_media
    |> cast(attrs, [:s3_key, :mime_type])
    |> validate_required([:s3_key, :mime_type])
    |> unique_constraint(:s3_key)
  end
end
