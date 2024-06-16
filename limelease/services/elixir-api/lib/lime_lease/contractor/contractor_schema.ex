defmodule LimeLease.Contractor.ContractorSchema do
  @moduledoc false
  alias LimeLeaseWeb.Middleware.{Authorize, EctoErrors}

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :contractor do
    field :id, non_null(:id)
    field :business_name, non_null(:string)
    field :website_url, :string
    field :contact_email, non_null(:string)
    field :contact_number, non_null(:string)
    field :areas_served, non_null(list_of(:string))
    field :address, :address

    connection field :jobs, node_type: :contractor_job do
      arg(:state, :property_request_filter, default_value: :all)
      middleware(Authorize)
      resolve(&LimeLease.Contractor.ContractorResolver.contractor_jobs_field/3)
    end
  end

  connection(node_type: :contractor)

  object :contractor_queries do
    @desc "Get a paginated list of contractors for your agency"
    connection field :my_contractors, node_type: :contractor do
      arg(:search_term, :string)
      middleware(Authorize)
      resolve(&LimeLease.Contractor.ContractorResolver.my_contractors_query/3)
    end

    @desc "Fetch a single contractor. Expected Errors: not_found"
    field :fetch_contractor, non_null(:contractor) do
      arg(:contractor_id, non_null(:id))
      middleware(Authorize)
      resolve(&LimeLease.Contractor.ContractorResolver.fetch_contractor_query/3)
    end

    @desc "Fetch the count of contractors a user is associated with. Expected Errors: unauthorized"
    field :contractor_count, non_null(:integer) do
      middleware(Authorize)
      resolve(&LimeLease.Contractor.ContractorResolver.contractor_count_query/3)
    end

    @desc "Search for contractors by name"
    connection field :search_contractors, node_type: :contractor do
      arg(:search_term, non_null(:string))
      middleware(Authorize)
      middleware(EctoErrors)
      resolve(&LimeLease.Contractor.ContractorResolver.search_contractors_query/3)
    end
  end

  object :contractor_mutations do
    @desc "Create a new contractor on behalf of your agency"
    field :create_contractor, non_null(:contractor) do
      arg(:business_name, non_null(:string))
      arg(:website_url, :string)
      arg(:contact_email, non_null(:string))
      arg(:contact_number, non_null(:string))
      arg(:areas_served, non_null(list_of(:string)))
      arg(:address, :create_address)

      middleware(Authorize)
      resolve(&LimeLease.Contractor.ContractorResolver.create_contractor_mutation/3)
      middleware(EctoErrors)
    end
  end
end
