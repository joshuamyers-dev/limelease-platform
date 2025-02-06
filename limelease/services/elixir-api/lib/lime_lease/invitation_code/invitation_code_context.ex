defmodule LimeLease.InvitationCode.InvitationCodeContext do
  @moduledoc false

  alias LimeLease.InvitationCode.InvitationCode

  alias LimeLease.Repo

  def create_invitation_code(args) do
    %InvitationCode{}
    |> InvitationCode.changeset(args)
    |> Repo.insert()
    |> Repo.ok_error()
  end
end
