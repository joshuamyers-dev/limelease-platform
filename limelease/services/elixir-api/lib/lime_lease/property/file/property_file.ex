defmodule LimeLease.Property.PropertyFile do
  @moduledoc false

  use Ecto.Schema

  import Ecto.{Changeset, Query}
  import LimeLease.ChangesetHelpers

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_files" do
    field :file_name, :string
    field :type, Ecto.Enum, values: ~w(contract condition_report rtba_form other)a

    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)
    belongs_to(:static_media, LimeLease.StaticMedia.StaticMedia, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(file, attrs) do
    file
    |> cast(attrs, [:file_name, :static_media_id, :type])
    |> validate_required([:file_name, :static_media_id, :type])
    |> foreign_key_constraint(:property_id)
    |> foreign_key_constraint(:static_media_id)
    |> validate_inclusion(:type, in: ~w(contract condition_report rtba_form other)a)
  end

  def update_changeset(file, attrs) do
    file
    |> cast(attrs, [:file_name, :static_media_id])
    |> validate_required([:file_name])
    |> foreign_key_constraint(:property_id)
    |> foreign_key_constraint(:static_media_id)
  end
end
