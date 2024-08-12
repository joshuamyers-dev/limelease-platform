defmodule LimeLease.ContractorJob.ContractorJobResolver do
  alias LimeLease.ContractorJob.{ContractorJobService, ContractorJobContext}
  alias LimeLease.Contractor.ContractorContext

  def contractor_job_create(
        _parent,
        %{
          contractor_id: contractor_id,
          request_id: request_id,
          booking_date_start: booking_date_start,
          booking_date_end: booking_date_end,
          description: description,
          contractor_message: contractor_message
        },
        %{
          context: %{current_user: user}
        }
      ) do
    ContractorJobService.create_contractor_job(contractor_id, request_id, booking_date_start, booking_date_end, description, contractor_message, user)
  end

  def contractor_jobs_query(_parent, %{contractor_id: contractor_id} = args, %{context: %{current_user: user}}) do
    ContractorJobService.get_jobs_for_contractor(contractor_id, args, user)
  end

  def my_upcoming_jobs_query(_parent, _args, %{context: %{current_user: user}}) do
    ContractorJobContext.get_contractor_job_for_tenant(user)
  end

  def contractor_job_active_query(_parent, %{request_id: request_id}, %{context: %{current_user: user}}) do
    ContractorJobService.get_contractor_job_for_request(request_id)
  end

  def contractor_job_delete_mutation(_parent, %{id: id}, %{context: %{current_user: user}}) do
    ContractorJobService.delete_contractor_job(id, user)
  end
end
