defmodule LimeLease.PropertyTask.PropertyTaskService do
  alias LimeLease.User.UserContext
  alias LimeLease.PropertyTask.PropertyTaskContext
  alias LimeLease.PropertyTask.PropertyTask
  alias LimeLease.User.User

  def mark_task_completed(task_id, %User{} = user) do
    with {:ok, %PropertyTask{} = property_task} <- PropertyTaskContext.get_property_task_by_id(task_id),
         {:ok, %PropertyTask{} = updated_property_task} <-
           PropertyTaskContext.update_property_task(
             property_task,
             %{completed: true, completed_at: DateTime.utc_now()}
           ) do
      {:ok, updated_property_task}
    end
  end
end
