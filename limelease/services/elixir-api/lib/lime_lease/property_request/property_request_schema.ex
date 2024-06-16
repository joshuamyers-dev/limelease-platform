defmodule LimeLease.PropertyRequest.PropertyRequestSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, AuthorizeGuest, EctoErrors}

  import Absinthe.Resolution.Helpers

  enum :property_request_state do
    value(:awaiting_response)
    value(:assigned_to_contractor)
    value(:contractor_appointment_booked)
    value(:resolved)
    value(:deleted)
  end

  enum :property_request_urgency do
    value(:low)
    value(:mid_high)
    value(:emergency)
  end

  enum :property_request_filter do
    value(:all)
    value(:new)
    value(:completed)
    value(:archived)
  end

  object :property_request_photo do
    field :static_media, non_null(:static_media) do
      resolve(dataloader(LimeLease.PropertyRequest.PropertyRequestContext, :static_media))
    end
  end

  object :property_request do
    field(:id, non_null(:id))
    field(:ticket_number, non_null(:string))
    field(:state, non_null(:property_request_state))
    field(:urgency, non_null(:property_request_urgency))
    field :title, non_null(:string)
    field :details, non_null(:string)
    field :inserted_at, non_null(:date)
    field :photos, list_of(:property_request_photo)

    field :category, non_null(:property_request_category) do
      resolve(dataloader(LimeLease.PropertyRequest.PropertyRequestContext, :category))
    end

    field :property, non_null(:property) do
      resolve(dataloader(LimeLease.PropertyRequest.PropertyRequestContext, :property))
    end

    field :tenant, :tenant do
      resolve(dataloader(LimeLease.PropertyRequest.PropertyRequestContext, :tenant))
    end

    connection field :comments, node_type: :property_request_comment do
      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.comments_field/3)
    end
  end

  connection(node_type: :property_request)

  object :property_request_queries do
    @desc "Fetch a paginated lists of requests for a particular property. Expected errors: unauthorized, not_found"
    connection field :requests_for_property, node_type: :property_request do
      arg(:property_id, non_null(:id))
      arg(:state, :property_request_filter, default_value: :new)

      middleware(Authorize)
      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.requests_for_property_query/3)
    end

    @desc "Fetch all requests, filtered by a state. Expected errors: unauthorized"
    connection field :my_requests, node_type: :property_request do
      arg(:state, :property_request_filter, default_value: :new)

      middleware(Authorize)
      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.my_requests_query/3)
    end

    @desc "Fetch a complete property request. Expected errors: unauthorized, not_found"
    field :fetch_request, non_null(:property_request) do
      arg(:id, non_null(:id))

      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.request_query/3)
    end

    @desc "Fetch a complete property request by ticket number. Expected errors: unauthorized, not_found"
    field :fetch_request_by_ticket_number, non_null(:property_request) do
      arg(:ticket_number, non_null(:string))

      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.fetch_request_by_ticket_number_query/3)
    end
  end

  object :property_request_mutations do
    @desc "Create a new property request. Expected errors: unauthorized"
    field :request_create, non_null(:property_request) do
      arg(:property_id, non_null(:id))
      arg(:title, non_null(:string))
      arg(:category_id, non_null(:id))
      arg(:details, non_null(:string))
      arg(:urgency, :property_request_urgency, default_value: :low)
      arg(:photos, list_of(:create_photo))

      middleware(Authorize)
      middleware(EctoErrors)
      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.request_create_mutation/3)
    end

    @desc "Update the state of multiple property requests. Expected errors: unauthorized"
    field :request_update_state, non_null(:boolean) do
      arg(:request_ids, non_null(list_of(non_null(:id))))
      arg(:state, non_null(:property_request_state))

      middleware(Authorize)
      middleware(EctoErrors)
      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.request_update_state_mutation/3)
    end

    @desc "Update the urgency of a property request. Expected errors: unauthorized"
    field :request_update_urgency, non_null(:property_request) do
      arg(:request_id, non_null(:id))
      arg(:urgency, non_null(:property_request_urgency))

      middleware(Authorize)
      middleware(EctoErrors)
      resolve(&LimeLease.PropertyRequest.PropertyRequestResolver.request_update_urgency_mutation/3)
    end
  end
end
