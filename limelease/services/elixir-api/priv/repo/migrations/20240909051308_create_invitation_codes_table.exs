defmodule LimeLease.Repo.Migrations.CreateInvitationCodesTable do
  use Ecto.Migration

  def change do
    create table(:invitation_codes, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :code, :string, null: false
      add :email, :string, null: false

      timestamps(type: :utc_datetime_usec)
    end
  end
end
