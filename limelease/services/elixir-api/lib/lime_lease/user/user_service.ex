defmodule LimeLease.User.UserService do
  alias LimeLease.Helpers
  alias LimeLease.User.{User, UserContext}
  alias LimeLease.Tenant.{Tenant, TenantContext}
  alias LimeLease.OtpCode.{OtpCode, OtpCodeContext}

  alias LimeLease.Guardian
  alias LimeLease.Services.ClickSend
  alias LimeLease.Repo

  require IEx

  def login_with_email(email, password) do
    with {:ok, %User{} = user} <- UserContext.get_user_by_email(email),
         {:ok, :password_correct} <- verify_password(password, user.password),
         {:ok, token, _claims} <- Guardian.encode_and_sign(user) do
      {:ok, %{token: token, user: user}}
    else
      {:error, :not_found} -> {:error, "This email address is not yet registered. Please contact your administrator to register your account."}
      {:error, :password_incorrect} -> {:error, "The password you entered is incorrect. Please try again."}
    end
  end

  def add_fcm_token_for_user(token, %User{} = user) do
    tokens =
      case user.fcm_tokens do
        nil -> [token]
        _ -> user.fcm_tokens ++ [token]
      end

    with {:ok, true} <- token_not_duplicated(tokens, token),
         {:ok, %User{} = _user} <- UserContext.update_user(user, %{fcm_tokens: tokens}) do
      {:ok, true}
    end
  end

  defp token_not_duplicated(tokens, token) do
    case Enum.find(tokens, fn t -> t == token end) do
      nil -> {:ok, true}
      _ -> {:ok, false}
    end
  end

  def send_otp(mobile_number) do
    mobile_number = Helpers.format_phone_number(mobile_number)
    otp_code = generate_otp()

    with {:ok, %Tenant{} = _tenant} <- TenantContext.get_tenant_by_phone_number(mobile_number),
         {:ok, %OtpCode{} = _otp} <- OtpCodeContext.create_otp_code(otp_code, mobile_number),
         {:ok, :delivered} <- ClickSend.send_sms(mobile_number, "Your OTP code to login for OccuPie is: #{otp_code}") do
      {:ok, true}
    end
  end

  def verify_otp(mobile_number, code) do
    mobile_number = Helpers.format_phone_number(mobile_number)

    with {:ok, %OtpCode{} = otp} <- OtpCodeContext.get_otp_code_by_code(code),
         true <- otp.code == code,
         {:ok, %Tenant{} = tenant} <- TenantContext.get_tenant_by_phone_number(mobile_number),
         {:ok, token, _claims} <- Guardian.encode_and_sign(tenant.user),
         {:ok, %OtpCode{} = _otp} <- OtpCodeContext.delete_otp_code(otp) do
      {:ok, %{token: token, user: tenant.user}}
    end
  end

  defp generate_otp() do
    :rand.seed(:exsplus, :os.timestamp())
    :rand.uniform(9000) + 1000
  end

  def verify_password(password, stored_password) do
    case Bcrypt.verify_pass(password, stored_password) do
      true -> {:ok, :password_correct}
      false -> {:error, :password_incorrect}
    end
  end
end
