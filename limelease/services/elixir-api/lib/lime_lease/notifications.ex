defmodule LimeLease.Notifications do
  alias LimeLease.Property.{Property, PropertyLandlord}
  alias LimeLease.Tenant.Tenant
  alias LimeLease.User.{User, UserContext}
  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestService}
  alias LimeLease.PropertyAgent.PropertyAgentContext

  alias LimeLease.{Helpers, Mailer}

  alias LimeLeaseWeb.Emails

  require IEx
  require Logger

  def send_status_update_email(%PropertyRequest{} = request) do
    case PropertyRequestService.create_request_status_screenshot(request) do
      {:ok, screenshot_image_url} ->
        cta_url = Application.get_env(:lime_lease, :front_end_url) <> "/requests/#{request.ticket_number}"

        with :ok <- send_email_notification_to_property_managers(request.property, screenshot_image_url, cta_url),
             :ok <- send_email_notification_to_landlord(request.property, screenshot_image_url, cta_url) do
          {:ok, "emails_sent"}
        end

      {:error, reason} ->
        Logger.error("Failed to send status update email for request #{request.id}. Error: Failed to create screenshot.")
        Logger.error(reason)
    end
  end

  def send_email_notification_to_property_managers(%Property{} = property, screenshot_image_url, cta_url) do
    with {:ok, manager_user_ids} <- PropertyAgentContext.get_manager_user_ids_for_property(property) do
      Logger.info("Sending status update email to property managers (#{manager_user_ids}) for property #{property.id}.")

      Flow.from_enumerable(manager_user_ids)
      |> Flow.map(fn user_id ->
        {:ok, %User{} = user} = UserContext.get_user_by_id(user_id)

        Logger.info("Sending email to #{user.email}")

        Emails.status_update(user.email, Helpers.full_user_name(user), Helpers.address_label(property.address), screenshot_image_url, cta_url)
        |> Mailer.deliver()
      end)
      |> Flow.run()
    end
  end

  def send_welcome_email_to_tenants(%Property{} = property, %User{} = agent) do
    Flow.from_enumerable(property.tenants)
    |> Flow.map(fn %Tenant{} = tenant ->
      Emails.tenant_welcome(
        tenant.user.email,
        Helpers.full_user_name(tenant.user),
        Helpers.full_user_name(agent),
        Helpers.address_label(property.address),
        "/"
      )
      |> Mailer.deliver()
    end)
    |> Flow.run()
  end

  def send_email_notification_to_landlord(%Property{} = property, screenshot_image_url, cta_url) do
    Flow.from_enumerable(property.landlords)
    |> Flow.map(fn %PropertyLandlord{} = landlord ->
      PropertyRequestEmails.status_update(
        landlord.email,
        Helpers.full_user_name(landlord),
        Helpers.address_label(property.address),
        screenshot_image_url,
        cta_url
      )
      |> Mailer.deliver()
    end)
    |> Flow.run()
  end
end
