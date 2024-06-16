defmodule LimeLease.Property.PropertyFile do
  @moduledoc false

  use Ecto.Schema

  import Ecto.{Changeset, Query}
  import LimeLease.ChangesetHelpers

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_files" do
    field :file_name, :string

    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)
    belongs_to(:static_media, LimeLease.StaticMedia.StaticMedia, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(tenant, attrs) do
    tenant
    |> cast(attrs, [:file_name, :property_id, :static_media_id])
    |> validate_required([:file_name, :property_id, :static_media_id])
    |> foreign_key_constraint(:property_id)
    |> foreign_key_constraint(:static_media_id)
  end
end
