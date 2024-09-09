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

  # Dataloader functions
  def data() do
    Dataloader.Ecto.new(Repo, query: &query/2)
  end

  def query(queryable, _) do
    queryable
  end
end
