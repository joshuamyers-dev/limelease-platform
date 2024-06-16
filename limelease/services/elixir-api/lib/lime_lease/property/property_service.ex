defmodule LimeLease.Property.PropertyService do
  alias Hex.HTTP
  alias LimeLease.Property.{Property, PropertyContext}
  alias LimeLease.User.User
  alias LimeLease.StaticMedia.{StaticMedia, StaticMediaService}

  alias LimeLease.Services.AWS
  alias LimeLease.Helpers

  alias LimeLease.Repo

  require IEx

  def create_property(
        %User{} = user,
        %{address: _address, bathrooms: _bathrooms, bedrooms: _bedrooms, carspaces: _carspaces} = property_details,
        lease_details,
        photos,
        tenants,
        landlords,
        files
      ) do
    photos = prepare_photos(photos)
    changeset = build_changeset(nil, property_details, landlords, tenants, photos, lease_details, user)

    with %Ecto.Changeset{valid?: true} <- changeset do
      case Enum.empty?(files) do
        true ->
          Repo.insert(changeset)
          |> Repo.ok_error()

        false ->
          {:ok, files} = upload_property_files(files)

          changeset
          |> Ecto.Changeset.put_embed(:files, files)
          |> Repo.insert()
          |> Repo.ok_error()
      end
    else
      _ -> {:error, changeset}
    end
  end

  defp prepare_photos(photos) when length(photos) > 0 do
    for_user_upload = Enum.filter(photos, &Map.has_key?(&1, :uri_path))
    for_system_upload = Enum.filter(photos, &Map.has_key?(&1, :url))

    case length(for_user_upload) > 0 do
      true ->
        Helpers.upload_temporary_fs_photos(for_user_upload)

      false ->
        case length(for_system_upload) > 1 do
          true ->
            Helpers.upload_external_photos(for_system_upload)

          false ->
            photos
        end
    end
  end

  defp prepare_photos(photos), do: photos

  defp build_changeset(property, property_details, landlords, tenants, photos, lease_details, user) do
    params =
      Map.merge(property_details, %{
        landlords: landlords,
        tenants: tenants,
        photos: photos,
        lease: lease_details
      })

    case property do
      nil ->
        %Property{}
        |> Property.create_changeset(params, user)

      %Property{} = property ->
        property
        |> Property.update_changeset(params)
    end
  end

  defp upload_property_files(files) do
    files = Enum.map(files, &Task.async(fn -> upload_file(&1) end)) |> Task.await_many()

    {:ok, files}
  end

  defp upload_file(file) do
    {:ok, image_id} = AWS.upload_multipart!(file.url, file.name, file.type)

    {:ok,
     %{
       url: AWS.build_bucket_url() <> image_id,
       name: file.name
     }}
  end

  def update_property(
        property_id,
        %User{} = user,
        %{address: _address, bathrooms: _bathrooms, bedrooms: _bedrooms, carspaces: _carspaces} = property_details,
        lease_details,
        photos,
        tenants,
        landlords,
        files
      ) do
    with {:ok, %Property{} = property} <- PropertyContext.get_property_by_id_for_user(user, property_id) do
      photos = prepare_photos(photos)
      changeset = build_changeset(property, property_details, landlords, tenants, photos, lease_details, user)

      with %Ecto.Changeset{valid?: true} <- changeset do
        case Enum.empty?(files) do
          true ->
            Repo.update(changeset) |> Repo.ok_error()

          false ->
            {:ok, files} = upload_property_files(files)

            changeset
            |> Ecto.Changeset.put_embed(:files, files)
            |> Repo.update()
            |> Repo.ok_error()
        end
      else
        _ -> {:error, changeset}
      end
    end
  end
end
