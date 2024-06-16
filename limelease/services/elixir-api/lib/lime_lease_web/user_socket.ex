defmodule LimeLeaseWeb.UserSocket do
  require IEx

  alias LimeLease.Guardian

  use Phoenix.Socket

  use Absinthe.Phoenix.Socket,
    schema: LimeLeaseWeb.Schema

  def connect(params, socket) do
    current_user = current_user(params)

    socket =
      Absinthe.Phoenix.Socket.put_options(socket,
        context: %{
          current_user: current_user
        }
      )

    {:ok, socket}
  end

  defp current_user(%{"token" => token}) do
    with {:ok, %{"sub" => sub}} <- Guardian.decode_and_verify(token),
         {:ok, %LimeLease.User.User{} = user} <- LimeLease.User.UserContext.get_user_by_id(sub) do
      user
    end
  end

  def id(_socket), do: nil
end
