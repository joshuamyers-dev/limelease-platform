defmodule LimeLease.Property.PropertyResolver do
  alias LimeLease.Property.{Property, PropertyContext, PropertyService}
  alias LimeLease.PropertyRequest.PropertyRequestContext

  require IEx

  def my_properties_query(_parent, %{filter: filter} = pagination_args, %{
        context: %{current_user: user}
      }) do
    search_keywords = Map.get(pagination_args, :search_keywords, "")

    PropertyContext.get_paginated_properties_for_user(user, filter, search_keywords, pagination_args)
  end

  def create_property_mutation(_parent, %{property_details: property_details, photos: photos, tenants: tenants, landlords: landlords} = arguments, %{
        context: %{current_user: user}
      }) do
    files = Map.get(arguments, :files, [])
    lease_details = Map.get(arguments, :lease_details, nil)

    PropertyService.create_property(user, property_details, lease_details, photos, tenants, landlords, files)
  end

  def update_property_mutation(
        _parent,
        %{property_id: property_id, property_details: property_details, photos: photos, tenants: tenants, landlords: landlords} = arguments,
        %{
          context: %{current_user: user}
        }
      ) do
    files = Map.get(arguments, :files, [])
    lease_details = Map.get(arguments, :lease_details, nil)

    PropertyService.update_property(property_id, user, property_details, lease_details, photos, tenants, landlords, files)
  end

  def property_notification_counts_field(%Property{id: id}, _args, %{
        context: %{current_user: user}
      }) do
    PropertyRequestContext.get_request_count_for_property_notifications(id)
  end

  def fetch_property_query(_parent, %{id: id}, %{
        context: %{current_user: user}
      }) do
    PropertyContext.get_property_by_id_for_user(user, id)
  end
end
