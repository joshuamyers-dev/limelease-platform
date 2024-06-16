defmodule LimeLease.PropertyRequest.PropertyRequestService do
  require Logger
  alias LimeLease.Notifications
  alias LimeLease.StaticMedia.StaticMediaService
  alias LimeLease.StaticMedia.{StaticMedia, StaticMediaContext}
  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestContext}
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentContext, PropertyRequestCommentService}
  alias LimeLease.User.User

  alias LimeLease.Repo
  alias LimeLease.Helpers
  alias LimeLease.Services.AWS

  require IEx

  def create_request(args, %User{} = user) do
    photos =
      case Map.get(args, :photos) do
        nil ->
          nil

        photos ->
          photos
      end
      |> case do
        photos when is_list(photos) ->
          Helpers.upload_temporary_photos(photos)

        _ ->
          []
      end

    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.create_request(args, photos) do
        spawn(fn  ->
          PropertyRequestCommentService.create_system_comment_for_request(request.id, Helpers.full_user_name(user), "Request created.")
        end)

      {:ok, request}
    else
      {:error, %Ecto.Changeset{} = changeset} ->
        {:error, changeset}
    end
  end

  def create_request_status_screenshot(%PropertyRequest{} = request) do
    script_path = Path.join([:code.priv_dir(:lime_lease), "scripts", "puppeteer.js"])
    url = Application.get_env(:lime_lease, :front_end_url) <> "/requests/#{request.ticket_number}"

    with {:ok, screenshot_base64} <- run_puppeteer_script(script_path, url),
         {:ok, %StaticMedia{} = static_media} <- StaticMediaService.create_static_media("screenshot.png", "image/png"),
         {:ok, put_url} <- AWS.generate_presigned_put_url(static_media.s3_key, static_media.mime_type),
         {:ok, %Req.Response{status: 200}} <- Req.put(put_url, body: screenshot_base64),
         {:ok, get_url} <- AWS.generate_presigned_get_url(static_media.s3_key) do
      {:ok, get_url}
    else
      {:ok, %Req.Response{status: status_code} = error_response} when status_code !== 200 ->
        {:error, error_response.body}

      error ->
        {:error, error}

      {:error, _reason} ->
        Logger.error("Failed to create screenshot for request #{request.id}. Error: Node.js did not return a binary. Puppeteer failed. Retrying...")
        create_request_status_screenshot(request)
    end
  end

  defp run_puppeteer_script(script_path, url) do
    try do
      Exile.stream!(~w(node #{script_path} #{url} ))
      |> Enum.into("")
      |> :binary.replace("\n", "")
      |> Base.decode64()
    rescue
      _ ->
        {:error, "Puppeteer failed to create screenshot. #{url}"}
    end
  end

  def update_request_urgency(request_id, urgency) do
    with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id) do
      PropertyRequestContext.update_request_urgency(request, urgency)
    end
  end

  def update_multiple_requests_state(request_ids, state) do
    with {:ok, _} <- PropertyRequestContext.update_multiple_requests_state(request_ids, state) do
      with true <- state == :resolved do
        spawn(fn ->
          send_completion_notifications_for_request_ids(request_ids)
        end)
      end

      {:ok, true}
    end
  end

  def send_completion_notifications_for_request_ids(request_ids) do
    Flow.from_enumerable(request_ids)
    |> Flow.map(fn request_id -> PropertyRequestCommentService.create_system_comment_for_request(request_id, "LimeLease", "Request resolved.") end)
    |> Flow.map(fn request_id ->
      with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_id(request_id) do
        Notifications.send_status_update_email(request)
      end
    end)
    |> Flow.run()
  end
end
