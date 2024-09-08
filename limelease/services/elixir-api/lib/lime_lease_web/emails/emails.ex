defmodule LimeLeaseWeb.Emails do
  alias LimeLease.PropertyRequest.PropertyRequest

  import Swoosh.Email

  require IEx

  def status_update(email, name, address, screenshot_image_url, cta_link) do
    new()
    |> to({name, email})
    |> from({"OccuPie", "system@occupie.com.au"})
    # |> subject("#{address} - Update")
    |> put_provider_option(:template_alias, "request-update-notification")
    |> put_provider_option(:template_model, %{
      address: address,
      preview_image_url: screenshot_image_url,
      cta_link: cta_link,
      header_text: morning_or_evening_text()
    })
  end

  def tenant_welcome(email, args) do
    with {:ok, mjml_body} <- File.read("#{:code.priv_dir(:lime_lease)}" <> "/static/emails/tenant_welcome.mjml"),
         mjml_body <- inject_variables_to_template(mjml_body, args),
         {:ok, html_body} <- Mjml.to_html(mjml_body) do
      new()
      |> to({args["tenant_name"], email})
      |> from({"OccuPie", "system@occupie.com.au"})
      |> subject("Your new home at #{args["address"]}")
      |> html_body(html_body)
    end
  end

  def inject_variables_to_template(mjml_body, variables) do
    Enum.reduce(variables, mjml_body, fn {key, value}, acc ->
      String.replace(acc, "{{#{key}}}", to_string(value))
    end)
  end

  defp morning_or_evening_text() do
    {:ok, datetime} = DateTime.now("Australia/Sydney")

    case datetime.hour do
      hour when hour in 0..11 -> "Good Morning,"
      hour when hour in 12..23 -> "Good Evening,"
    end
  end
end
