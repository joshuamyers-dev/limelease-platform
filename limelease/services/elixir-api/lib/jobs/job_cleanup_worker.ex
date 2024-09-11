defmodule LimeLease.Workers.JobCleanUpWorker do
  alias LimeLease.PropertyRequest.PropertyRequest
  alias LimeLease.Notifications
  alias LimeLease.ContractorJob.{ContractorJob, ContractorJobContext}
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentService}
  alias LimeLease.Contractor.Contractor

  use Oban.Worker, queue: :scheduled, max_attempts: 3, priority: 3

  @impl Oban.Worker
  def perform(%Oban.Job{args: _args}) do
    with {:ok, jobs} <- ContractorJobContext.get_expired_contractor_jobs() do
      Enum.map(jobs, fn %ContractorJob{contractor: %Contractor{} = contractor} = job ->
        with {:ok, %ContractorJob{request: %PropertyRequest{} = request} = job} = ContractorJobContext.archive_contractor_job(job),
             {:ok, %PropertyRequestComment{} = _comment} <- create_comment_notification(job.request_id, contractor.business_name) do
          Notifications.send_push_notification_for_tenants(
            job.request,
            "Your Request - #{request.title}",
            "We hope everything went well with #{contractor.business_name}. Please let your Property Manager know how the job went!"
          )
        end
      end)
    else
      _ -> {:ok, "not_required"}
    end
  end

  def create_comment_notification(request_id, contractor_name) do
    PropertyRequestCommentService.create_system_comment_for_request(
      request_id,
      "OccuPie",
      "The job assigned to #{contractor_name} has expired."
    )
  end
end
