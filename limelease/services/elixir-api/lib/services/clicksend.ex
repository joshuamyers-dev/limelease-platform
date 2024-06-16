defmodule LimeLease.Services.ClickSend do
  alias ElixirSense.Log
  require IEx
  require Logger

  @base_url "https://rest.clicksend.com/v3"

  def api_username, do: Application.get_env(:lime_lease, :clicksend_api_username)
  def api_key, do: Application.get_env(:lime_lease, :clicksend_api_key)

  def default_headers() do
    [
      {"Content-Type", "application/json"}
    ]
  end

  def send_sms(to_number, message_body) do
    Logger.info("Sending SMS to #{to_number}")
    url = "#{@base_url}/sms/send"

    payload = %{
      messages: [
        %{to: to_number, body: message_body}
      ]
    }

    case Req.post(url, json: payload, auth: {:basic, "#{api_username()}:#{api_key()}"}) do
      {:ok, %Req.Response{status: 200, body: _body}} ->
        Logger.info("Delivered SMS to #{to_number}")

        {:ok, :delivered}

      {:ok, %Req.Response{status: status_code, body: body}} ->
        Logger.error("Failed to send SMS. Status code: #{status_code}. Response body: #{body}")
        {:error, "Failed to send SMS. Status code: #{status_code}. Response body: #{body}"}

      {:error, reason} ->
        Logger.error("Failed to send SMS. Reason: #{reason}")
        {:error, "Failed to send SMS. Reason: #{reason}"}
    end
  end

  def send_mms(to_number, message_body, static_media_url) do
    Logger.info("Sending MMS to #{to_number}")
    url = "#{@base_url}/mms/send"

    payload = %{
      media_file: static_media_url,
      messages: [
        %{to: to_number, body: message_body, subject: "New Job Request"}
      ]
    }

    case Req.post(url, json: payload, auth: {:basic, "#{api_username()}:#{api_key()}"}) do
      {:ok, %Req.Response{status: 200, body: body}} ->
        Logger.info(body)
        Logger.info("Delivered MMS to #{to_number}")

        {:ok, :delivered}

      {:ok, %Req.Response{status: status_code, body: body}} ->
        Logger.error("Failed to send MMS. Status code: #{status_code}. Response body: #{body}")
        {:error, "Failed to send MMS. Status code: #{status_code}. Response body: #{body}"}

      {:error, reason} ->
        Logger.error("Failed to send MMS. Reason: #{reason}")
        {:error, "Failed to send MMS. Reason: #{reason}"}
    end
  end

  def send_voice_message(to_number, message_body) do
    Logger.info("Sending Voice Message to #{to_number}")
    url = "#{@base_url}/voice/send"

    payload = %{
      messages: [
        %{
          to: to_number,
          body: message_body,
          voice: "male",
          country: "AU",
          lang: "en-au"
        }
      ]
    }

    case Req.post(url, json: payload, auth: {:basic, "#{api_username()}:#{api_key()}"}) do
      {:ok, %Req.Response{status: 200, body: body}} ->
        Logger.info(body)
        Logger.info("Delivered Voice Message to #{to_number}")

        {:ok, :delivered}

      {:ok, %Req.Response{status: status_code, body: body}} ->
        Logger.error("Failed to send Voice Message. Status code: #{status_code}. Response body: #{body}")
        {:error, "Failed to send. Status code: #{status_code}. Response body: #{body}"}

      {:error, reason} ->
        Logger.error("Failed to send Voice Message. Reason: #{reason}")
        {:error, "Failed to send. Reason: #{reason}"}
    end
  end
  def convert_file_for_mms(file_url) do
    Logger.info("Converting file hosted at: #{file_url}")

    url = "#{@base_url}/uploads?convert=mms"

    case Req.get(file_url) do
      {:ok, %Req.Response{body: body}} ->
        base64_file_content = Base.encode64(body)

        payload = %{
          content: base64_file_content
        }

        case Req.post(url, json: payload, auth: {:basic, "#{api_username()}:#{api_key()}"}) do
          {:ok, %Req.Response{status: 200, body: %{"data" => %{"_url" => url}}}} ->
            Logger.info("Converted file for MMS.")

            {:ok, url}

          {:ok, %Req.Response{status: status_code, body: body}} ->
            Logger.error("Failed to send MMS. Status code: #{status_code}. Response body: #{body}")
            {:error, "Failed to send MMS. Status code: #{status_code}. Response body: #{body}"}

          {:error, reason} ->
            Logger.error("Failed to send MMS. Reason: #{reason}")
            {:error, "Failed to send MMS. Reason: #{reason}"}
        end

      {:error, reason} ->
        Logger.error("Failed to download file. Reason: #{reason}")
        {:error, "Failed to download file. Reason: #{reason}"}
    end
  end
end
