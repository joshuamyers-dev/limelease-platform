defmodule LimeLease.GenServers.SmsQueue do
  use GenServer

  require Logger
  require IEx

  alias LimeLease.Helpers
  alias LimeLease.Services.ClickSend

  def start_link(_args) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    :ets.new(:rate_limiter, [:named_table, :public, :set, {:write_concurrency, true}])
    {:ok, []}
  end

  def enqueue_sms(phone_number, message_body, static_media_url \\ nil) do
    GenServer.cast(__MODULE__, {:send_sms, phone_number, message_body, static_media_url})
  end

  def handle_cast({:send_sms, phone_number, message_body, static_media_url}, _state) do
    if rate_limit_exceeded() do
      Process.send_after(self(), {:retry_send_sms, phone_number, message_body, static_media_url}, :timer.seconds(1))
    else
      send_sms(phone_number, message_body, static_media_url)
    end

    {:noreply, []}
  end

  defp rate_limit_exceeded do
    current_second = DateTime.to_unix(DateTime.utc_now(), :second)

    case :ets.lookup(:rate_limiter, current_second) do
      [] ->
        :ets.insert(:rate_limiter, {current_second, 1})
        false

      [{_second, count}] when count >= 200 ->
        true

      [{second, count}] ->
        :ets.insert(:rate_limiter, {second, count + 1})
        false
    end
  end

  defp send_sms(phone_number, message_body, static_media_url) do
    phone_number = Helpers.format_phone_number(phone_number)

    case static_media_url == nil do
      true ->
        case ClickSend.send_sms(phone_number, message_body) do
          {:ok, :delivered} ->
            :ok

          {:error, reason} ->
            Logger.error("Error sending SMS: #{inspect(reason)}")
            Process.send_after(self(), {:retry_send_sms, phone_number, message_body}, :timer.seconds(30))
        end

      false ->
        case ClickSend.send_mms(phone_number, message_body, static_media_url) do
          {:ok, :delivered} ->
            :ok

          {:error, reason} ->
            Logger.error("Error sending SMS: #{inspect(reason)}")
            Process.send_after(self(), {:retry_send_sms, phone_number, message_body}, :timer.seconds(30))
        end
    end
  end

  def handle_info({:retry_send_sms, phone_number, message_body, static_media_url}, _state) do
    send_sms(phone_number, message_body, static_media_url)
    {:noreply, []}
  end
end
