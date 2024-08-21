defmodule LimeLease.PropertyRequestComment.PropertyRequestCommentService do
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentContext}
  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestContext}
  alias LimeLease.User.User

  def get_comments_for_request(request_id, args) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id) do
      PropertyRequestCommentContext.get_paginated_comments_for_request(request, args)
    end
  end

  def get_comment_activity_for_tenant(%User{} = user, args) do
    PropertyRequestCommentContext.get_paginated_comments_for_property_id(user.tenant.property_id, args)
  end

  def create_comment_for_request(request_id, args) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id) do
      PropertyRequestCommentContext.create_comment_for_request(request, args)
    end
  end

  def create_system_comment_for_request(request_id, author_name, message_body) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id) do
      PropertyRequestCommentContext.create_comment_for_request(request, %{
        message_body: message_body,
        system_generated: true,
        author_name: author_name
      })
    end
  end

  def count_comments_for_request(request_id) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id) do
      PropertyRequestCommentContext.count_comments_for_request(request)
    end
  end
end
