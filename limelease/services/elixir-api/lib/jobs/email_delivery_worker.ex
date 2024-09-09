defmodule LimeLease.Workers.EmailDeliveryWorker do
  use Oban.Worker, queue: :email, max_attempts: 3, priority: 1

  alias LimeLease.Helpers
  alias LimeLease.Mailer
  alias LimeLeaseWeb.Emails

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"type" => type, "to_address" => to_address, "email_args" => email_args}}) do
    email =
      case type do
        "status_update" ->
          Emails.status_update(
            to_address,
            email_args["name"],
            email_args["address"],
            email_args["screenshot_image_url"],
            email_args["cta_url"]
          )

        "tenant_welcome" ->
          Emails.tenant_welcome(
            to_address,
            email_args
          )

        "team_member_invite" ->
          Emails.team_member_invite(
            to_address,
            email_args
          )

        _ ->
          {:error, :undefined_type}
      end

    case email do
      {:error, :undefined_type} -> {:error, "Undefined email type."}
      _ -> Mailer.deliver(email)
    end
  end
end
