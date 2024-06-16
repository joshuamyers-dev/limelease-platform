defmodule LimeLeaseWeb.TempFileController do
  use LimeLeaseWeb, :controller

  alias LimeLease.Services.AWS

  require IEx

  def upload_temp_photo(conn, %{"propertyListingPhoto" => %Plug.Upload{} = upload}) do
    temp_path = Temp.path!("#{AWS.generate_image_id("temp")}-photo")

    with {:ok, binary} <- File.read(upload.path),
         :ok <- File.write(temp_path, binary, [:binary]) do
      conn
      |> json(%{temp_path: temp_path})
    end
  end
end
