defmodule LimeLease.Notifications do
  alias LimeLease.Tenant.TenantContext
  alias LimeLease.Property.{Property, PropertyLandlord}
  alias LimeLease.Agency.Agency
  alias LimeLease.Tenant.Tenant
  alias LimeLease.User.{User, UserContext}
  alias LimeLease.Profile.Profile
  alias LimeLease.AgencyAgent.AgencyAgent
  alias LimeLease.PropertyRequest.{PropertyRequest, PropertyRequestService}
  alias LimeLease.PropertyAgent.PropertyAgentContext

  alias LimeLease.Helpers

  require IEx
  require Logger

  def send_sms_message(phone_number, message) do
    %{"phone_number" => phone_number, "message" => message}
    |> LimeLease.Workers.SmsDeliveryWorker.new()
    |> Oban.insert()
  end

  def send_fcm_message(token, title, body) do
    %{"token" => token, "title" => title, "body" => body}
    |> LimeLease.Workers.PushDeliveryWorker.new()
    |> Oban.insert()
  end

  def dispatch_status_update_for_request(%PropertyRequest{} = request) do
    send_status_update_email(request)
    send_property_status_update_for_tenants(request)
  end

  def send_status_update_email(%PropertyRequest{} = request) do
    cta_url = Application.get_env(:lime_lease, :front_end_url) <> "/requests/#{request.ticket_number}"

    with {:ok, screenshot_image_url} <- PropertyRequestService.create_request_status_screenshot(request),
         :ok <- send_property_status_update_for_managers(request.property, screenshot_image_url, cta_url),
         :ok <- send_property_status_update_for_landlords(request.property, screenshot_image_url, cta_url) do
      :ok
    else
      {:error, reason} ->
        Logger.error("Failed to send status update email for request #{request.id}. Error: Failed to create screenshot.")
        Logger.error(reason)

      err ->
        Logger.error("Failed to send status update email for request #{request.id}. Error: #{inspect(err)}")
    end
  end

  def send_team_member_invite(
        %AgencyAgent{user: %User{agency: %Agency{} = agency, profile: %Profile{} = profile}},
        invitation_code
      ) do
    email_args = %{
      "agent_name" => "#{profile.first_name}",
      "cta_url" => Application.get_env(:lime_lease, :front_end_url) <> "/invite/#{invitation_code}",
      "agency_name" => agency.name
    }

    %{"type" => "team_member_invite", "to_address" => profile.email, "email_args" => email_args}
    |> LimeLease.Workers.EmailDeliveryWorker.new()
    |> Oban.insert()
  end

  def send_property_status_update_for_tenants(%PropertyRequest{} = request) do
    with {:ok, tenants} <- TenantContext.get_tenants_for_property_id(request.property_id) do
      Enum.map(tenants, fn %Tenant{user: %User{fcm_tokens: tokens}} ->
        Task.async(fn ->
          Enum.map(tokens, fn token ->
            send_fcm_message(token, "Request Updated", "Your request '#{request.title}' has a new status update.")
          end)
        end)
      end)
      |> Task.await_many()
    end
  end

  def send_push_notification_for_tenants(%PropertyRequest{} = request, title, body) do
    with {:ok, tenants} <- TenantContext.get_tenants_for_property_id(request.property_id) do
      Enum.map(tenants, fn %Tenant{user: %User{fcm_tokens: tokens}} ->
        Task.async(fn ->
          Enum.map(tokens, fn token ->
            send_fcm_message(token, title, body)
          end)
        end)
      end)
      |> Task.await_many()
    end
  end

  def send_property_status_update_for_managers(%Property{} = property, screenshot_image_url, cta_url) do
    with {:ok, manager_user_ids} <- PropertyAgentContext.get_manager_user_ids_for_property(property) do
      Logger.info("Sending status update email to property managers (#{manager_user_ids}) for property #{property.id}.")

      Enum.map(manager_user_ids, fn user_id ->
        Task.async(fn ->
          {:ok, %User{} = user} = UserContext.get_user_by_id(user_id)

          email_args = %{
            "name" => Helpers.full_user_name(user),
            "address" => Helpers.address_label(property.address),
            "screenshot_image_url" => screenshot_image_url,
            "cta_url" => cta_url
          }

          %{"type" => "status_update", "to_address" => user.profile.email, "email_args" => email_args}
          |> LimeLease.Workers.EmailDeliveryWorker.new()
          |> Oban.insert()
        end)
      end)
      |> Task.await_many()
      |> Enum.all?(fn
        {:ok, %Oban.Job{}} -> true
        _ -> false
      end)
      |> case do
        true -> :ok
        false -> {:error, "Failed to send status update email to property managers."}
      end
    end
  end

  def send_welcome_email_to_property_tenants(%Property{} = property, %User{} = agent, tenants \\ nil) do
    # If tenants are not provided, use the property's tenants
    tenants =
      case tenants == nil do
        true -> property.tenants
        false -> tenants
      end

    Enum.map(tenants, fn %Tenant{user: %User{profile: %Profile{} = tenant_profile}} ->
      Task.async(fn ->
        email_args = %{
          "tenant_name" => "#{tenant_profile.first_name}",
          "agent_name" => Helpers.full_user_name(agent),
          "address" => Helpers.address_label(property.address)
        }

        %{"type" => "tenant_welcome", "to_address" => tenant_profile.email, "email_args" => email_args}
        |> LimeLease.Workers.EmailDeliveryWorker.new()
        |> Oban.insert()
      end)
    end)
    |> Task.await_many()
    |> Enum.all?(fn
      {:ok, %Oban.Job{}} -> :ok
      _ -> {:error, "Failed to queue jobs for tenant welcome emails"}
    end)
  end

  def send_property_status_update_for_landlords(%Property{} = property, screenshot_image_url, cta_url) do
    Enum.map(property.landlords, fn %PropertyLandlord{} = landlord ->
      Task.async(fn ->
        email_args = %{
          "name" => "#{landlord.first_name} #{landlord.last_name}",
          "address" => Helpers.address_label(property.address),
          "screenshot_image_url" => screenshot_image_url,
          "cta_url" => cta_url
        }

        %{"type" => "status_update", "to_address" => landlord.email, "email_args" => email_args}
        |> LimeLease.Workers.EmailDeliveryWorker.new()
        |> Oban.insert()
      end)
    end)
    |> Task.await_many()
    |> Enum.all?(fn
      {:ok, %Oban.Job{}} -> :ok
      _ -> {:error, "Jobs failed to queue"}
    end)
  end
end
