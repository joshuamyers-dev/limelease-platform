defmodule LimeLease.ChangesetHelpers do
  import Ecto.Changeset

  alias LimeLease.Helpers

  def format_contact_number(%Ecto.Changeset{} = changeset, field) do
    case changeset do
      %Ecto.Changeset{changes: %{^field => number}} when is_binary(number) ->
        %{changeset | changes: Map.update(changeset.changes, field, number, &Helpers.format_phone_number/1)}

      _ ->
        changeset
    end
  end

  def validate_contact_number(%Ecto.Changeset{valid?: true} = changeset, field) do
    validate_format(changeset, field, ~r/^04\d{8}$/, message: "invalid")
  end

  def validate_contact_number(%Ecto.Changeset{valid?: false} = changeset), do: changeset

  def validate_email(%Ecto.Changeset{valid?: true} = changeset, field) do
    validate_format(changeset, field, ~r/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: "invalid")
  end

  def validate_email(%Ecto.Changeset{valid?: false} = changeset), do: changeset

  def validate_website_url(%Ecto.Changeset{valid?: true, changes: %{website_url: website_url}} = changeset) when is_binary(website_url) do
    case URI.parse(website_url) do
      %URI{scheme: nil, host: nil} ->
        add_error(changeset, :website_url, "invalid URL")

      _ ->
        changeset
    end
  end

  def validate_website_url(changeset), do: changeset
end
