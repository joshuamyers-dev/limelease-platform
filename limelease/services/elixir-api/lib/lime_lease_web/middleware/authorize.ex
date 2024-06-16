defmodule LimeLeaseWeb.Middleware.Authorize do
  @moduledoc false

  @behaviour Absinthe.Middleware

  alias LimeLease.User.User

  require IEx

  def call(resolution, _) do
    case resolution.context do
      %{current_user: %User{}} ->
        resolution

      _ ->
        resolution
        |> Absinthe.Resolution.put_result({:error, "unauthorized"})
    end
  end
end
