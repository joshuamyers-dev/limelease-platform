defmodule LimeLease.Workers.JobCleanUpWorker do
  alias LimeLease.Notifications
  alias LimeLease.ContractorJob.{ContractorJob, ContractorJobContext}
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentService}
  alias LimeLease.Contractor.Contractor

  use Oban.Worker, queue: :scheduled, max_attempts: 3, priority: 3

  @impl Oban.Worker
  def perform(%Oban.Job{args: _args}) do
    with {:ok, jobs} <- ContractorJobContext.get_expired_contractor_jobs() do
      all_completed = Enum.map(jobs, fn %ContractorJob{contractor: %Contractor{} = contractor} = job ->
        with {:ok, %ContractorJob{} = job} = ContractorJobContext.archive_contractor_job(job),
             {:ok, %PropertyRequestComment{} = _comment} <- create_comment_notification(job.request_id, contractor.business_name),
             {:ok, "push_notifications_sent"} <- Notifications.send_tenant_push_notifications(job.request) do
          :ok
        end
      end)
      |> Enum.all?(&(&1 == :ok))

      case all_completed do
        true -> {:ok, "all_jobs_archived"}
        false -> {:error, "failed_to_archive_jobs"}
      end
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
