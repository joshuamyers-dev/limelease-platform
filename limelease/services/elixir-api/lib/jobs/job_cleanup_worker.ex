defmodule LimeLease.Workers.JobCleanUpWorker do
  require IEx
  alias LimeLease.Task.{Task, TaskContext}
  alias LimeLease.PropertyTask.{PropertyTask, PropertyTaskContext}
  alias LimeLease.Property.{Property, PropertyContext}
  alias LimeLease.PropertyRequest.PropertyRequest
  alias LimeLease.Notifications
  alias LimeLease.ContractorJob.{ContractorJob, ContractorJobContext}
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentService}
  alias LimeLease.Contractor.Contractor

  alias LimeLease.Repo

  use Oban.Worker, queue: :scheduled, max_attempts: 3, priority: 3

  @impl Oban.Worker
  def perform(%Oban.Job{args: _args}) do
    with :ok <- clean_contractor_jobs(),
         {:ok, _} <- create_property_tasks() do
      :ok
    else
      {:error, reason} -> {:error, reason}
      _ -> {:error, "unknown_error"}
    end
  end

  def clean_contractor_jobs() do
    IO.puts("Cleaning expired contractor jobs...")

    with {:ok, jobs} <- ContractorJobContext.get_expired_contractor_jobs() do
      Enum.each(jobs, fn %ContractorJob{contractor: %Contractor{} = contractor} = job ->
        with {:ok, %ContractorJob{request: %PropertyRequest{} = request} = job} = ContractorJobContext.archive_contractor_job(job),
             {:ok, %PropertyRequestComment{} = _comment} <- create_comment_notification(job.request_id, contractor.business_name) do
          Notifications.send_push_notification_for_tenants(
            job.request,
            "Your Request - #{request.title}",
            "We hope everything went well with #{contractor.business_name}. Please let your Property Manager know how the job went!"
          )
        end
      end)

      :ok
    else
      _ -> :ok
    end
  end

  def create_property_tasks() do
    IO.puts("Scheduling tasks for properties...")

    Repo.transaction(fn ->
      {:ok, tasks} = TaskContext.get_tasks()

      Property
      |> Repo.stream()
      |> Stream.chunk_every(100)
      |> Stream.each(fn chunk ->
        Flow.from_enumerable(chunk, max_demand: 100)
        |> Flow.map(fn %Property{} = property ->
          {:ok, current_property_tasks} = PropertyTaskContext.get_all_property_tasks_for_property(property.id)

          Flow.from_enumerable(tasks, max_demand: 10)
          |> Flow.map(fn %Task{} = task ->
            Enum.find(current_property_tasks, fn %PropertyTask{task: %Task{} = t} -> t.id == task.id end)
            |> case do
              nil ->
                IO.puts("Task created for property: #{property.id}")

                PropertyTaskContext.create_property_task(%{
                  property: property,
                  task: task
                })

              %PropertyTask{task: %Task{} = task} = property_task ->
                with true <- property_task.completed do
                  PropertyTaskContext.update_property_task(property_task, %{
                    due_date: property_task.due_date |> DateTime.add(task.frequency_months * 30 * 24 * 60 * 60, :second),
                    completed: false
                  })
                end
            end
          end)
          |> Flow.run()
        end)
        |> Flow.run()
      end)
      |> Stream.run()
    end)
  end

  def create_comment_notification(request_id, contractor_name) do
    PropertyRequestCommentService.create_system_comment_for_request(
      request_id,
      "OccuPie",
      "The job assigned to #{contractor_name} has expired."
    )
  end
end
