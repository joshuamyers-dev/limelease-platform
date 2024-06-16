defmodule LimeLease.PropertyRequestComment.PropertyRequestCommentResolver do
  @moduledoc false

  alias LimeLease.PropertyRequestComment.{PropertyRequestCommentContext, PropertyRequestCommentService}

  def property_request_comments_query(_parent, %{request_id: request_id} = args, _context) do
    PropertyRequestCommentService.get_comments_for_request(request_id, args)
  end

  def property_request_comment_create_mutation(_parent, %{request_id: request_id} = args, _context) do
    PropertyRequestCommentService.create_comment_for_request(request_id, args)
  end

  def property_request_comments_count_query(_parent, %{request_id: request_id}, _context) do
    PropertyRequestCommentService.count_comments_for_request(request_id)
  end
end
