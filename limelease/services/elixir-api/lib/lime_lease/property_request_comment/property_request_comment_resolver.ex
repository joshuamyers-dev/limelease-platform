defmodule LimeLease.PropertyRequestComment.PropertyRequestCommentResolver do
  @moduledoc false

  alias LimeLease.PropertyRequestComment.{PropertyRequestCommentContext, PropertyRequestCommentService}

  def property_request_comments_query(_parent, args, _context) do
    request_id = Map.get(args, :request_id)

    PropertyRequestCommentService.get_comments_for_request(request_id, args)
  end

  def property_request_comment_create_mutation(_parent, %{request_id: request_id} = args, _context) do
    PropertyRequestCommentService.create_comment_for_request(request_id, args)
  end

  def property_request_comments_count_query(_parent, %{request_id: request_id}, _context) do
    PropertyRequestCommentService.count_comments_for_request(request_id)
  end

  def my_activity_query(_parent, args, %{
        context: %{current_user: user}
      }) do
    PropertyRequestCommentService.get_comment_activity_for_tenant(user, args)
  end
end
