defmodule LimeLeaseWeb.PropertyRequestEmails do
  alias LimeLease.PropertyRequest.PropertyRequest

  import Swoosh.Email

  require IEx

  def status_update(email, name, address, screenshot_image_url, cta_link) do
    new()
    |> to({name, email})
    |> from({"RentRevu", "noreply@rentrevu.com"})
    # |> subject("#{address} - Update")
    |> put_provider_option(:template_alias, "request-update-notification")
    |> put_provider_option(:template_model, %{address: address, preview_image_url: screenshot_image_url, cta_link: cta_link, header_text: morning_or_evening_text()})
  end

  defp morning_or_evening_text() do
    {:ok, datetime} = DateTime.now("Australia/Sydney")

    case datetime.hour do
      hour when hour in 0..11 -> "Good Morning,"
      hour when hour in 12..23 -> "Good Evening,"
    end
  end
end
