defmodule LimeLease.ContractorJob.ContractorJob do
  @moduledoc false
  alias LimeLease.PropertyRequest.PropertyRequest
  alias LimeLease.Contractor.Contractor

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "contractor_jobs" do
    field :booking_date_start, :utc_datetime_usec
    field :booking_date_end, :utc_datetime_usec
    field :archived_at, :utc_datetime_usec
    field :description, :string

    belongs_to(:contractor, LimeLease.Contractor.Contractor, type: :binary_id)
    belongs_to(:request, LimeLease.PropertyRequest.PropertyRequest, type: :binary_id)

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(contractor_job, attrs, %Contractor{} = contractor, %PropertyRequest{} = property_request) do
    contractor_job
    |> cast(attrs, [:booking_date_start, :booking_date_end, :description])
    |> put_assoc(:contractor, contractor)
    |> put_assoc(:request, property_request)
  end

  def update_state_changeset(contractor_job, attrs) do
    contractor_job
    |> cast(attrs, [:archived_at])
  end

  def default_preloads(query) do
    query
    |> preload([:contractor, :request])
  end

  def with_id(query, id) do
    query
    |> where([q], q.id == ^id)
  end

  def with_contractor_id(query, contractor_id) do
    query
    |> where([q], q.contractor_id == ^contractor_id)
  end

  def with_request_id(query, request_id) do
    query
    |> where([q], q.request_id == ^request_id)
  end

  def with_limit(query, limit) do
    query
    |> limit(^limit)
  end

  def with_property(query, property_id) do
    query
    |> join(:inner, [c], r in assoc(c, :request))
    |> where([c, r], r.property_id == ^property_id)
  end

  def with_expired_booking_date(query) do
    query
    |> where([q], q.booking_date_end < ^Timex.now())
  end

  def order_by_inserted_desc(query) do
    query
    |> order_by([q], desc: q.inserted_at)
  end

  def is_active(query) do
    query
    |> where([q], is_nil(q.archived_at))
  end

  def is_archived(query) do
    query
    |> where([q], not is_nil(q.archived_at))
  end

  def translate_state_into_filter(query, state) do
    case state do
      :all ->
        query

      :new ->
        two_weeks = Timex.now() |> Timex.shift(weeks: -1) |> Timex.to_datetime()

        query
        |> where([q], q.inserted_at > ^two_weeks)

      :archived ->
        query
        |> is_archived()
    end
  end
end
