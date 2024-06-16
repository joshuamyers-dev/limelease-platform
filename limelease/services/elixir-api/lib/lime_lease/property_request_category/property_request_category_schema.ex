defmodule LimeLease.PropertyRequestCategory.PropertyRequestCategorySchema do
  @moduledoc false
  alias LimeLeaseWeb.Middleware.Authorize

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :property_request_category do
    field(:id, non_null(:id))
    field(:name, non_null(:string))
  end

  connection(node_type: :property_request_category)

  object :property_request_category_queries do
    @desc "Fetch a list of property request categories."
    field :property_request_categories, list_of(:property_request_category) do
      middleware(Authorize)
      resolve(&LimeLease.PropertyRequestCategory.PropertyRequestCategoryResolver.property_request_categories_query/3)
    end
  end
end
