defmodule LimeLease.PropertyRequest.PropertyRequest do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "property_requests" do
    field :state, Ecto.Enum, values: ~w(awaiting_response assigned_to_contractor contractor_appointment_booked resolved deleted)a, default: :awaiting_response
    field :urgency, Ecto.Enum, values: ~w(low mid_high emergency)a
    field :title, :string
    field :details, :string
    field :ticket_number, :string

    embeds_many :photos, LimeLease.PropertyRequest.PropertyRequestPhoto

    belongs_to(:property, LimeLease.Property.Property, type: :binary_id)
    belongs_to(:tenant, LimeLease.Tenant.Tenant, type: :binary_id)
    belongs_to(:category, LimeLease.PropertyRequestCategory.PropertyRequestCategory, type: :binary_id)

    has_many(:comments, LimeLease.PropertyRequestComment.PropertyRequestComment)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(property_request, attrs) do
    property_request
    |> cast(attrs, [:title, :category_id, :details, :urgency, :property_id, :tenant_id, :state, :ticket_number])
    |> validate_required([:title, :category_id, :details, :urgency, :property_id, :state, :ticket_number])
    |> put_embed(:photos, attrs[:photos], required: false)
    |> foreign_key_constraint(:property_id)
    |> foreign_key_constraint(:category_id)
    |> foreign_key_constraint(:tenant_id)
  end

  def update_state_changeset(property_request, attrs) do
    property_request
    |> cast(attrs, [:state])
    |> validate_required([:state])
    |> validate_inclusion(:state, ~w(awaiting_response assigned_to_contractor contractor_appointment_booked resolved deleted)a)
  end

  def update_urgency_changeset(property_request, attrs) do
    property_request
    |> cast(attrs, [:urgency])
    |> validate_required([:urgency])
    |> validate_inclusion(:urgency, ~w(low mid_high emergency)a)
  end

  def default_preloads(query) do
    query
    |> preload([:property, :tenant, [photos: :static_media]])
  end

  def with_property_id(query, id) do
    query
    |> where([q], q.property_id == ^id)
  end

  def with_property_id_in(query, ids) do
    query
    |> where([q], q.property_id in ^ids)
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end

  def with_ids_in(query, ids) do
    query
    |> where([q], q.id in ^ids)
  end

  def with_states(query, states) do
    query
    |> where([q], q.state in ^states)
  end

  def with_urgency(query, urgency) do
    query
    |> where([q], q.urgency == ^urgency)
  end

  def with_urgencies(query, urgencies) do
    query
    |> where([q], q.urgency in ^urgencies)
  end

  def order_by_creation_date(query) do
    query
    |> order_by([q], desc: q.inserted_at)
  end

  def with_ticket_number(query, ticket_number) do
    query
    |> where([q], q.ticket_number == ^ticket_number)
  end

  def with_active_states(query) do
    query
    |> with_states(~w(awaiting_response assigned_to_contractor contractor_appointment_booked))
  end

  def count_important_requests(query, property_id) do
    query
    |> with_property_id(property_id)
    |> with_urgencies([:mid_high, :emergency])
    |> group_by([r], r.urgency)
    |> select([r], %{urgency: r.urgency, count: count(r.id)})
  end

  @spec translate_state_into_filter(any(), :all | :archived | :completed | :new) :: any()
  def translate_state_into_filter(query, state) do
    case state do
      :all ->
        query

      :new ->
        two_weeks = Timex.now() |> Timex.shift(weeks: -2) |> Timex.to_datetime()

        query
        |> where([q], q.inserted_at > ^two_weeks)
        |> with_active_states()

      :completed ->
        query
        |> with_states([:resolved])

      :archived ->
        query
        |> with_states([:deleted])
    end
  end
end
