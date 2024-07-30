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
        %{address: _address, bathrooms: _bathrooms, bedrooms: _bedrooms, carspaces: _carspaces} =
        property_details,
        lease_details,
        photos,
        tenants,
        landlords,
        files
      ) do
    with {:ok, photos} <- prepare_photos(photos),
         {:ok, files} <- prepare_files(files) do
      changeset =
        build_changeset(nil, property_details, landlords, tenants, photos, files, lease_details, user)

      with %Ecto.Changeset{valid?: true} <- changeset do
        changeset
        |> Ecto.Changeset.put_assoc(:files, files, with: &LimeLease.Property.PropertyFile.create_changeset/2)
        |> Repo.insert()
        |> Repo.ok_error()
      else
        _ -> {:error, changeset}
      end
    end
  end

  defp prepare_photos(photos) when length(photos) > 0 do
    for_user_upload = Enum.filter(photos, &Map.has_key?(&1, :uri_path))
    for_system_upload = Enum.filter(photos, &Map.has_key?(&1, :url))

    case length(for_user_upload) > 0 do
      true ->
        photos = Helpers.upload_temporary_fs_photos(for_user_upload)

        {:ok, photos}

      false ->
        case length(for_system_upload) > 1 do
          true ->
            photos = Helpers.upload_external_photos(for_system_upload)

            {:ok, photos}

          false ->
            {:ok, photos}
        end
    end
  end

  defp prepare_photos(photos), do: photos

  defp prepare_files(files) do
    files = Helpers.upload_temporary_fs_files(files)

    {:ok, files}
  end

  defp build_changeset(
         property,
         property_details,
         landlords,
         tenants,
         photos,
         files,
         lease_details,
         %User{} = user
       ) do
    params =
      Map.merge(property_details, %{
        landlords: landlords,
        tenants: tenants,
        photos: photos,
        files: files,
        lease: lease_details
      })

    case property do
      nil ->
        %Property{}
        |> Property.create_changeset(params, user.agency_agent)

      %Property{} = property ->
        property
        |> Property.update_changeset(params)
    end
  end

  def update_property(
        property_id,
        %User{} = user,
        %{address: _address, bathrooms: _bathrooms, bedrooms: _bedrooms, carspaces: _carspaces} =
          property_details,
        lease_details,
        photos,
        tenants,
        landlords,
        files
      ) do
    with {:ok, %Property{} = property} <-
           PropertyContext.get_property_by_id_for_user(user, property_id),
         {:ok, photos} <- prepare_photos(photos),
         {:ok, files} <- prepare_files(files) do
      changeset =
        build_changeset(
          property,
          property_details,
          landlords,
          tenants,
          photos,
          files,
          lease_details,
          user
        )

      with %Ecto.Changeset{valid?: true} <- changeset do
        changeset
        |> Repo.update()
        |> Repo.ok_error()
      else
        _ -> {:error, changeset}
      end
    end
  end
end
