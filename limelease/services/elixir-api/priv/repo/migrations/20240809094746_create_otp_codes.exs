defmodule LimeLease.Repo.Migrations.CreateOtpCodes do
  use Ecto.Migration

  def change do
    create table(:otp_codes, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :code, :string, null: false
      add :mobile_number, :string, null: false
      add :expires_at, :utc_datetime_usec, null: false

      timestamps(type: :utc_datetime_usec)
    end

    create unique_index(:otp_codes, [:code])
  end
end
