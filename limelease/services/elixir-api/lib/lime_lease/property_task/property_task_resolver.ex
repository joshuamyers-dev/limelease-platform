defmodule LimeLease.PropertyTask.PropertyTaskResolver do
  alias LimeLease.PropertyTask.{PropertyTaskContext, PropertyTaskService}
  def property_tasks_query(_parent, %{property_id: property_id}, _context) do
    PropertyTaskContext.get_property_tasks_for_property(property_id)
  end

  def mark_completed_mutation(_parent, %{id: id}, %{context: %{current_user: user}}) do
    PropertyTaskService.mark_task_completed(id, user)
  end
end
