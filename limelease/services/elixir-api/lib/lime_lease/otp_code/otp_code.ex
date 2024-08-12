defmodule LimeLease.OtpCode.OtpCode do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query

  @primary_key {:id, UUIDv7, autogenerate: true}

  schema "otp_codes" do
    field :code, :string
    field :mobile_number, :string
    field :expires_at, :utc_datetime_usec

    timestamps(type: :utc_datetime_usec)
  end

  def create_changeset(otp_code, attrs) do
    otp_code
    |> cast(attrs, [:code, :mobile_number, :expires_at])
    |> validate_required([:code, :mobile_number, :expires_at])
    |> validate_length(:code, min: 4, max: 4)
    |> validate_format(:code, ~r/^\d{4}$/)
  end
end
