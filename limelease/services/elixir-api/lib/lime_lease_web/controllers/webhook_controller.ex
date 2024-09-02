defmodule LimeLeaseWeb.WebhookController do
  use LimeLeaseWeb, :controller

  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestContext}
  alias LimeLease.ContractorJob.{ContractorJob, ContractorJobContext}
  alias LimeLease.PropertyRequestComment.{PropertyRequestComment, PropertyRequestCommentContext, PropertyRequestCommentService}
  alias LimeLease.Contractor.{Contractor, ContractorContext}
  alias LimeLease.Notifications

  alias LimeLease.Helpers

  alias LimeLease.Services.AWS
  alias LimeLease.GenServers.SmsQueue

  require IEx
  require Logger

  def front_end_url, do: Application.get_env(:lime_lease, :front_end_url)

  def health_check(conn, _args) do
    conn
    |> send_resp(200, "")
  end

  def inbound_sms(conn, %{"originalmessage" => original_message_body, "body" => response_body, "sms" => from_number}) do
    ticket_number =
      original_message_body
      |> String.split("\n")
      |> Enum.find_value(fn line ->
        case Regex.run(~r/Ticket Number: #(\w+)/, line) do
          [_, ticket] -> ticket
          _ -> nil
        end
      end)

    with true <- ticket_number != nil,
         {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.get_request_by_ticket_number(ticket_number),
         {:ok, true} <- request_is_awaiting_contractor(request) do
      accepted_response = String.downcase(response_body) |> String.contains?("yes")

      case accepted_response do
        true ->
          with {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.update_request_state(request, :contractor_appointment_booked),
               {:ok, %ContractorJob{} = job} <- ContractorJobContext.get_contractor_job_for_request(request),
               {:ok, %ContractorJob{} = _job} <- ContractorJobContext.update_contractor_job_state(job, :job_booked),
               {:ok, %PropertyRequestComment{} = _comment} <-
                 PropertyRequestCommentService.create_system_comment_for_request(
                   request.id,
                   job.contractor.business_name,
                   "The contractor has accepted the job on the requested date and time."
                 ) do
            spawn(fn ->
              Notifications.send_sms_message(job.contractor.contact_number, "Thank you. We have sent your confirmation to the property manager.")
              Notifications.dispatch_status_update_for_request(request)
            end)

            conn
            |> send_resp(200, "")
          end

        false ->
          with {:ok, %ContractorJob{} = job} <- ContractorJobContext.get_contractor_job_for_request(request),
               {:ok, %PropertyRequest{} = request} <- PropertyRequestContext.update_request_state(request, :assigned_to_contractor),
               {:ok, %PropertyRequestComment{} = _comment} <-
                 PropertyRequestCommentContext.create_comment_for_request(request, %{
                   message_body: "The contractor has declined the job request.",
                   author_name: job.contractor.business_name,
                   system_generated: true
                 }) do
            spawn(fn ->
              Notifications.send_sms_message(
                job.contractor.contact_number,
                "Thanks for confirming. Please leave a comment to arrange an alternative time:\n\n#{front_end_url()}/requests/#{request.ticket_number}"
              )

              Notifications.dispatch_status_update_for_request(request)
            end)

            conn
            |> send_resp(200, "")
          end
      end
    end
  else
    {:error, reason} ->
      Logger.info("Failed to process inbound SMS. Reason: #{reason}")

      conn
      |> send_resp(200, "")

    _ ->
      Logger.info("Failed to process inbound SMS. Request ID was not found.")

      conn
      |> send_resp(200, "")
  end

  defp request_is_awaiting_contractor(%PropertyRequest{} = request) do
    case request.state == :assigned_to_contractor do
      true -> {:ok, true}
      false -> {:error, "The request has been responded to already and has progressed to the next stage."}
    end
  end
end
