defmodule LimeLease.Workers.CleaningWorker do
  use Oban.Worker, queue: :scheduled, max_attempts: 3, priority: 3

  @impl Oban.Worker
  def perform(%Oban.Job{args: _args}) do
    IO.puts("CleaningWorker is running")

    Temp.cleanup()
  end
end
