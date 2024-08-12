defmodule LimeLease.OtpCode.OtpCodeContext do
  alias LimeLease.OtpCode.OtpCode
  alias LimeLease.Repo

  def get_otp_code_by_code(code) do
    Repo.get_by(LimeLease.OtpCode.OtpCode, code: code)
    |> Repo.ok_error()
  end

  def delete_otp_code(otp) do
    Repo.delete(otp)
  end

  def create_otp_code(code, mobile_number) do
    %OtpCode{}
    |> OtpCode.create_changeset(%{
      code: Integer.to_string(code),
      mobile_number: mobile_number,
      expires_at: DateTime.utc_now() |> DateTime.add(5, :minute)
    })
    |> Repo.insert()
  end
end
