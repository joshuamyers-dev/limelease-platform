defmodule LimeLease.Workers.PushDeliveryWorker do
  use Oban.Worker, queue: :sms, max_attempts: 3, priority: 0

  alias LimeLease.FCM

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"token" => token, "title" => title, "body" => body}}) do
    %Pigeon.FCM.Notification{} =
      notification =
      Pigeon.FCM.Notification.new({:token, token}, %{"body" => body, "title" => title})
      |> FCM.push()

    case notification do
      %Pigeon.FCM.Notification{response: :success} -> :ok
      %Pigeon.FCM.Notification{error: error} -> {:error, error}
      _ -> {:error, "Unknown error"}
    end
  end
end
