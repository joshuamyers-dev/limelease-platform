defmodule LimeLease.Task.TaskSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  enum :task_type do
    value(:compliance)
    value(:safety)
    value(:routine)
  end

  object :task do
    field(:id, non_null(:id))
    field(:name, non_null(:string))
    field(:frequency_months, non_null(:integer))
    field(:type, non_null(:task_type))
  end

  connection(node_type: :task)
end
