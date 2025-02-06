defmodule LimeLease.InvitationCode.InvitationCode do
  @moduledoc false

  use Ecto.Schema

  import Ecto.Changeset
  import Ecto.Query
  import LimeLease.ChangesetHelpers

  @primary_key false

  schema "invitation_codes" do
    field :code, :string
    field :email, :string

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(invitation_code, attrs) do
    invitation_code
    |> cast(attrs, [:code, :email])
    |> validate_required([:code, :email])
    |> validate_email(:email)
  end
end
