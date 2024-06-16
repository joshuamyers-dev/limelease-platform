defmodule LimeLease.PropertyRequest.PropertyRequestResolver do
  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestContext, PropertyRequestService}
  alias LimeLease.PropertyRequestComment.PropertyRequestCommentContext

  require IEx

  def requests_for_property_query(_parent, %{property_id: property_id, state: state} = pagination_args, %{
        context: %{current_user: _user}
      }) do
    PropertyRequestContext.get_paginated_requests_for_property(property_id, state, pagination_args)
  end

  def my_requests_query(_parent, %{state: state} = pagination_args, %{
        context: %{current_user: user}
      }) do
    PropertyRequestContext.get_paginated_requests_for_user(state, pagination_args, user)
  end

  def request_query(_parent, %{id: request_id}, _context) do
    PropertyRequestContext.get_request_by_id(request_id)
  end

  def fetch_request_by_ticket_number_query(_parent, %{ticket_number: ticket_number}, _context) do
    PropertyRequestContext.get_request_by_ticket_number(ticket_number)
  end

  def request_create_mutation(_parent, args, %{
        context: %{current_user: user}
      }) do
    photos = Map.get(args, :photos)

    PropertyRequestService.create_request(args, user)
  end

  def request_update_state_mutation(_parent, %{request_ids: request_ids, state: state}, %{
        context: %{current_user: _user}
      }) do
    PropertyRequestService.update_multiple_requests_state(request_ids, state)
  end

  def request_update_urgency_mutation(_parent, %{request_id: request_id, urgency: urgency}, %{
        context: %{current_user: _user}
      }) do
    PropertyRequestService.update_request_urgency(request_id, urgency)
  end

  def comments_field(%PropertyRequest{id: request_id}, args, %{
        context: %{current_user: user}
      }) do
    PropertyRequestCommentContext.get_paginated_comments_for_request(request_id, args, user)
  end
end
