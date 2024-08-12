defmodule LimeLease.Helpers do
  alias LimeLease.Property
  alias LimeLease.StaticMedia.{StaticMedia, StaticMediaService}
  alias LimeLease.User.User
  alias LimeLease.Services.AWS

  def return_from_json_or_map(json_map, key) do
    value =
      case json_map[key] == nil do
        true -> Map.get(json_map, String.to_atom(key))
        false -> json_map[key]
      end

    {:ok, value}
  end

  def format_phone_number(number) do
    case String.starts_with?(number, "04") do
      true ->
        trailing_chars = String.slice(number, 2..String.length(number)) |> String.replace(" ", "")

        "+614" <> trailing_chars

      false ->
        number
    end
  end

  def full_user_name(user_landlord) do
    "#{user_landlord.first_name} #{user_landlord.last_name}"
  end

  def address_label(%LimeLease.Property.Address{} = address, with_locality \\ false) do
    unit_number =
      case address.unit_number == nil do
        true -> ""
        false -> "#{address.unit_number}/"
      end

    case with_locality do
      true ->
        "#{unit_number}#{address.street_number} #{address.street_name}, #{address.suburb} #{address.state}"

      false ->
        "#{unit_number}#{address.street_number} #{address.street_name}"
    end
  end

  def format_search_keywords_ts_query(keywords) do
    keywords
    |> String.split()
    |> Enum.map_join(" & ", &sanitize_tsquery_keyword/1)
  end

  defp sanitize_tsquery_keyword(keyword) do
    keyword =
      String.replace_suffix(keyword, ":*", "")
      |> String.replace(~r/([!&':()*|<-@])/u, "\\\\\\1")

    keyword <> ":*"
  end

  def generate_ticket_number() do
    random_number =
      :rand.uniform(999)
      |> Integer.to_string()
      |> String.pad_leading(4, "0")

    random_letter = <<Enum.random(?A..?Z)>>

    "OP" <> random_number <> random_letter
  end

  def upload_temporary_fs_photos(photos) do
    photos
    |> Enum.with_index()
    |> Enum.map(fn {photo, index} ->
      Task.async(fn ->
        with {:ok, file_contents} <- File.read(photo.uri_path),
             {:ok, %StaticMedia{} = static_media} <- StaticMediaService.create_static_media(photo.name, photo.type),
             {:ok, put_url} <- AWS.generate_presigned_put_url(static_media.s3_key, static_media.mime_type),
             {:ok, %Req.Response{status: 200}} <- Req.put(put_url, body: file_contents) do
          %{
            static_media_id: static_media.id,
            order: index + 1
          }
        else
          {:ok, %Req.Response{status: status_code} = error_response} when status_code !== 200 ->
            {:error, error_response.body}

          error ->
            {:error, error}
        end
      end)
    end)
    |> Task.await_many(:timer.seconds(60))
  end

  def upload_temporary_fs_files(files) do
    files
    |> Enum.with_index()
    |> Enum.map(fn {file, index} ->
      Task.async(fn ->
        with {:ok, file_contents} <- File.read(file.uri),
             {:ok, %StaticMedia{} = static_media} <- StaticMediaService.create_static_media(file.name, file.type),
             {:ok, put_url} <- AWS.generate_presigned_put_url(static_media.s3_key, static_media.mime_type),
             {:ok, %Req.Response{status: 200}} <- Req.put(put_url, body: file_contents) do
          %{
            file_name: file.name,
            static_media_id: static_media.id,
          }
        else
          {:ok, %Req.Response{status: status_code} = error_response} when status_code !== 200 ->
            {:error, error_response.body}

          error ->
            {:error, error}
        end
      end)
    end)
    |> Task.await_many(:timer.seconds(60))
  end

  def upload_external_photos(photos) do
    photos
    |> Enum.with_index()
    |> Enum.map(fn {photo, index} ->
      Task.async(fn ->
        with {:ok, %Req.Response{body: body}} <- Req.get(photo.url),
             {:ok, %StaticMedia{} = static_media} <- StaticMediaService.create_static_media("#{UUIDv7.generate()}.jpeg", "image/jpeg"),
             {:ok, put_url} <- AWS.generate_presigned_put_url(static_media.s3_key, static_media.mime_type),
             {:ok, %Req.Response{status: 200}} <- Req.put(put_url, body: body) do
          %{
            static_media_id: static_media.id,
            order: index + 1
          }
        else
          {:ok, %Req.Response{status: status_code} = error_response} when status_code !== 200 ->
            {:error, error_response.body}

          error ->
            {:error, error}
        end
      end)
    end)
    |> Task.await_many(:timer.seconds(60))
  end
end
