defmodule LimeLease.PropertyRequestComment.PropertyRequestCommentSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, AuthorizeGuest, EctoErrors}

  import Absinthe.Resolution.Helpers

  object :property_request_comment do
    field(:id, non_null(:id))
    field(:message_body, :string)
    field(:author_name, non_null(:string))
    field(:system_generated, :boolean)
    field(:inserted_at, non_null(:datetime))

    field :request, non_null(:property_request) do
      resolve(dataloader(LimeLease.PropertyRequestComment.PropertyRequestCommentContext, :request))
    end
  end

  connection(node_type: :property_request_comment)

  object :property_request_comment_queries do
    @desc "Fetch a paginated list of property request comments by ID"
    connection field :property_request_comments, node_type: :property_request_comment do
      arg(:request_id, non_null(:id))
      resolve(&LimeLease.PropertyRequestComment.PropertyRequestCommentResolver.property_request_comments_query/3)
    end

    @desc "Fetch the latest comment activity for a tenant user."
    connection field :my_activity, node_type: :property_request_comment do
      middleware(Authorize)
      resolve(&LimeLease.PropertyRequestComment.PropertyRequestCommentResolver.my_activity_query/3)
    end

    @desc "Fetch a count of property request comments by Request ID"
    field :property_request_comments_count, non_null(:integer) do
      arg(:request_id, non_null(:id))
      resolve(&LimeLease.PropertyRequestComment.PropertyRequestCommentResolver.property_request_comments_count_query/3)
    end
  end

  object :property_request_comment_mutations do
    @desc "Add a new comment to a property request."
    field :property_request_comment_create, :property_request_comment do
      arg(:request_id, non_null(:id))
      arg(:message_body, non_null(:string))
      arg(:author_name, non_null(:string))
      arg(:system_generated, :boolean, default_value: false)
      resolve(&LimeLease.PropertyRequestComment.PropertyRequestCommentResolver.property_request_comment_create_mutation/3)
    end
  end
end
