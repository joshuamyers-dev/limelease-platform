defmodule LimeLease.Notification.NotificationContext do
  @moduledoc false

  alias LimeLease.Repo

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
