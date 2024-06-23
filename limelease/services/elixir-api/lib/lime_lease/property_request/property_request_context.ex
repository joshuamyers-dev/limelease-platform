defmodule LimeLease.PropertyRequest.PropertyRequestContext do
  @moduledoc false

  alias LimeLease.PropertyRequest.PropertyRequest
  alias LimeLease.User.User
  alias LimeLease.PropertyAgent.PropertyAgentContext

  alias LimeLease.Helpers
  alias LimeLease.Repo

  require IEx

  def get_paginated_requests_for_property(property_id, state, pagination_args) do
    PropertyRequest
    |> PropertyRequest.with_property_id(property_id)
    |> PropertyRequest.translate_state_into_filter(state)
    |> PropertyRequest.order_by_creation_date()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  def get_paginated_requests_for_user(state, pagination_args, %User{} = user) do
    {:ok, property_ids} = PropertyAgentContext.get_managed_property_ids_for_agent(user.agency_agent)

    PropertyRequest
    |> PropertyRequest.translate_state_into_filter(state)
    |> PropertyRequest.with_property_id_in(property_ids)
    |> PropertyRequest.order_by_creation_date()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, pagination_args)
  end

  def create_request(request_attrs, photos) do
    ticket_number = Helpers.generate_ticket_number()

    case get_request_by_ticket_number(ticket_number) do
      {:ok, %PropertyRequest{} = _request} ->
        create_request(request_attrs, photos)

      {:error, :not_found} ->
        %PropertyRequest{}
        |> PropertyRequest.create_changeset(
          Map.merge(request_attrs, %{
            ticket_number: ticket_number,
            photos: photos,
            state: :awaiting_response
          })
        )
        |> Repo.insert()
    end
  end

  def get_request_by_id(request_id) do
    PropertyRequest
    |> PropertyRequest.with_id(request_id)
    |> PropertyRequest.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_request_by_ticket_number(ticket_number) do
    PropertyRequest
    |> PropertyRequest.with_ticket_number(ticket_number)
    |> PropertyRequest.default_preloads()
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_request_count_for_property_notifications(property_id) do
    counts =
      PropertyRequest
      |> PropertyRequest.count_important_requests(property_id)
      |> Repo.all()
      |> Enum.into(%{}, fn %{urgency: urgency, count: count} -> {urgency, count} end)

    mid_high_count = Map.get(counts, :mid_high, 0)
    emergency_count = Map.get(counts, :emergency, 0)

    {:ok,
     %{
       mid_high_count: mid_high_count,
       urgent_count: emergency_count,
       messages_count: 0
     }}
  end

  def update_request_state(%PropertyRequest{} = request, state) do
    request
    |> PropertyRequest.update_state_changeset(%{state: state})
    |> Repo.update()
    |> Repo.ok_error()
  end

  def update_request_urgency(%PropertyRequest{} = request, urgency) do
    request
    |> PropertyRequest.update_urgency_changeset(%{urgency: urgency})
    |> Repo.update()
    |> Repo.ok_error()
  end

  def update_multiple_requests_state(request_ids, state) do
    PropertyRequest
    |> PropertyRequest.with_ids_in(request_ids)
    |> Repo.update_all(set: [state: state])
    |> Repo.ok_error()
  end

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
