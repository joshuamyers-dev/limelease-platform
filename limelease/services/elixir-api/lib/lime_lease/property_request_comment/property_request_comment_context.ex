defmodule LimeLease.PropertyRequestComment.PropertyRequestCommentContext do
  @moduledoc false

  alias LimeLease.Property
  alias LimeLease.PropertyRequest.PropertyRequest
  alias LimeLease.PropertyRequestComment.PropertyRequestComment
  alias LimeLease.User.User

  alias LimeLease.Repo

  def get_comment_by_id(comment_id) do
    PropertyRequestComment
    |> PropertyRequestComment.with_id(comment_id)
    |> Repo.one()
    |> Repo.ok_error()
  end

  def get_paginated_comments_for_request(%PropertyRequest{} = request, args) do
    PropertyRequestComment
    |> PropertyRequestComment.with_request_id(request.id)
    |> PropertyRequestComment.order_by_inserted_desc()
    |> Absinthe.Relay.Connection.from_query(&Repo.all/1, args)
  end

  def count_comments_for_request(%PropertyRequest{} = request) do
    PropertyRequestComment
    |> PropertyRequestComment.with_request_id(request.id)
    |> Repo.aggregate(:count, :id)
    |> Repo.ok_error()
  end

  def create_comment_for_request(%PropertyRequest{} = request, attrs) do
    %PropertyRequestComment{}
    |> PropertyRequestComment.create_changeset(attrs, request)
    |> Repo.insert()
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
