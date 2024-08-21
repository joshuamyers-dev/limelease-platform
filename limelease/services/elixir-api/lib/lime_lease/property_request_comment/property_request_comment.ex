defmodule LimeLease.PropertyRequestComment.PropertyRequestComment do
  @moduledoc false

  alias LimeLease.PropertyRequest.PropertyRequest

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_request_comments" do
    field :message_body, :string
    field :author_name, :string
    field :system_generated, :boolean, default: false

    belongs_to :request, LimeLease.PropertyRequest.PropertyRequest, type: :binary_id

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(comment, attrs, %PropertyRequest{} = request) do
    comment
    |> cast(attrs, [:message_body, :author_name, :system_generated])
    |> put_assoc(:request, request)
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end

 def with_property_id(query, property_id) do
    query
    |> join(:inner, [q], u in assoc(q, :request))
    |> where([q, u], u.property_id == ^property_id)
  end

  def with_request_id(query, request_id) do
    query
    |> where([q], q.request_id == ^request_id)
  end

  def order_by_inserted_desc(query) do
    query
    |> order_by([q], desc: q.inserted_at)
  end
end
