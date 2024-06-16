defmodule LimeLease.Repo do
  use Ecto.Repo,
    otp_app: :lime_lease,
    adapter: Ecto.Adapters.Postgres

  require IEx

  def ok_error(result) do
    case result do
      {:ok, _something} ->
        result

      {:error, _something} = tuple ->
        tuple

      {:error, step, reason, _state}
      when step
           |> is_atom() and
             reason
             |> is_binary() ->
        {:error, reason}

      {:error, step, %Ecto.Changeset{} = changeset, _state}
      when step
           |> is_atom() ->
        {:error, changeset}

      nil ->
        {:error, :not_found}

      data
      when data
           |> is_list() or
             data
             |> is_map() ->
        {:ok, result}

      _else ->
        # IEx.pry()
        {:ok, result}
    end
  end
end
