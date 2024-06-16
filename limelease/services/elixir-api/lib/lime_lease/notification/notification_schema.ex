defmodule LimeLease.Notification.NotificationSchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  import Absinthe.Resolution.Helpers

  object :notification do
    field(:id, non_null(:id))
  end

  connection(node_type: :notification)

  object :notification_queries do
  end

  object :notification_mutations do
  end
end
