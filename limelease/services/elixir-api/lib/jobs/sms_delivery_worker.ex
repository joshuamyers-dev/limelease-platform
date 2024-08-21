defmodule LimeLease.Workers.SmsDeliveryWorker do
  use Oban.Worker, queue: :sms, max_attempts: 3, priority: 0

  alias LimeLease.Helpers
  alias LimeLease.Services.ClickSend

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"phone_number" => phone_number, "message" => message}}) do
    phone_number = Helpers.format_phone_number(phone_number)
    ClickSend.send_sms(phone_number, message)
  end
end
