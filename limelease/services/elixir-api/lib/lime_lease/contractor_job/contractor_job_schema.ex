defmodule LimeLease.ContractorJob.ContractorJobSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, AuthorizeGuest, EctoErrors}

  import Absinthe.Resolution.Helpers

  object :contractor_job do
    field :id, non_null(:id)
    field :booking_date_start, :datetime
    field :booking_date_end, :datetime
    field :description, :string

    field :request, :property_request do
      resolve(dataloader(LimeLease.ContractorJob.ContractorJobContext, :request))
    end

    field :contractor, :contractor do
      resolve(dataloader(LimeLease.ContractorJob.ContractorJobContext, :contractor))
    end
  end

  connection(node_type: :contractor_job)

  object :contractor_job_queries do
    @desc "Get a paginated list of jobs for a contractor."
    connection field :jobs_for_contractor, node_type: :contractor_job do
      arg(:contractor_id, non_null(:id))
      arg(:state, :property_request_filter, default_value: :all)

      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.ContractorJob.ContractorJobResolver.contractor_jobs_query/3)
    end

    @desc "Get the most recently assigned (active) job for a property request."
    field :contractor_job_active, :contractor_job do
      arg(:request_id, non_null(:id))

      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.ContractorJob.ContractorJobResolver.contractor_job_active_query/3)
    end

    @desc "Fetch upcoming jobs for a tenant."
    field :my_upcoming_jobs, :contractor_job do
      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.ContractorJob.ContractorJobResolver.my_upcoming_jobs_query/3)
    end
  end

  object :contractor_job_mutations do
    @desc "Assign a contractor to a property request."
    field :contractor_job_create, non_null(:contractor_job) do
      arg(:request_id, non_null(:id))
      arg(:contractor_id, non_null(:id))
      arg(:booking_date_start, non_null(:datetime))
      arg(:booking_date_end, non_null(:datetime))
      arg(:description, non_null(:string))
      arg(:contractor_message, non_null(:string))

      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.ContractorJob.ContractorJobResolver.contractor_job_create/3)
    end

    @desc "Delete a contractor job."
    field :contractor_job_delete, non_null(:contractor_job) do
      arg(:id, non_null(:id))

      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.ContractorJob.ContractorJobResolver.contractor_job_delete_mutation/3)
    end
  end
end
