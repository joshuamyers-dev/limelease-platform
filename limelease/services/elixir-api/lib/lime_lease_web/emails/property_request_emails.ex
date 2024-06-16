defmodule LimeLeaseWeb.PropertyRequestEmails do
  alias LimeLease.PropertyRequest.PropertyRequest

  import Swoosh.Email

  require IEx

  def status_update(email, name, address, screenshot_image_url, cta_link) do
    new()
    |> to({name, email})
    |> from({"LimeLease", "notifications@limelease.com.au"})
    # |> subject("#{address} - Update")
    |> put_provider_option(:template_alias, "request-update-notification")
    |> put_provider_option(:template_model, %{address: address, preview_image_url: screenshot_image_url, cta_link: cta_link})
  end
end
