defmodule LimeLease.PropertyTask.PropertyTaskSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :property_task do
    field(:id, non_null(:id))
    field(:due_date, non_null(:datetime))
    field(:completed_at, :datetime)
    field(:completed, :boolean)

    field :property, non_null(:property) do
      resolve(dataloader(LimeLease.PropertyTask.PropertyTaskContext, :property))
    end

    field :task, non_null(:task) do
      resolve(dataloader(LimeLease.PropertyTask.PropertyTaskContext, :task))
    end
  end

  connection(node_type: :property_task)

  object :property_task_queries do
    field :property_tasks, list_of(:property_task) do
      arg(:property_id, non_null(:id))
      resolve(&LimeLease.PropertyTask.PropertyTaskResolver.property_tasks_query/3)
    end
  end

  object :property_task_mutations do
    field :property_task_mark_completed, :property_task do
      arg(:id, non_null(:id))
      resolve(&LimeLease.PropertyTask.PropertyTaskResolver.mark_completed_mutation/3)
    end
  end
end
