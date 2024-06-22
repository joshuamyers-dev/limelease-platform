defmodule LimeLease.Property.PropertySchema do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias LimeLeaseWeb.Middleware.{Authorize, EctoErrors}
  alias LimeLeaseWeb.Middleware.EctoErrors

  import Absinthe.Resolution.Helpers

  alias LimeLease.Helpers

  require IEx

  object :property_photo do
    field(:id, non_null(:id))
    field(:order, non_null(:integer))

    field(:static_media, :static_media) do
      resolve(dataloader(LimeLease.Property.PropertyContext, :static_media))
    end
  end

  object :property_landlord do
    field(:id, non_null(:id))
    field(:first_name, non_null(:string))
    field(:last_name, non_null(:string))
    field(:phone_number, non_null(:string))
    field(:email, non_null(:string))
  end

  object :property_notification_counts do
    field(:messages_count, non_null(:integer))
    field(:urgent_count, non_null(:integer))
    field(:mid_high_count, non_null(:integer))
  end

  object :address do
    field(:unit_number, :integer)
    field(:street_number, non_null(:integer))
    field(:street_name, non_null(:string))
    field(:street_type, non_null(:string))
    field(:suburb, non_null(:string))
    field(:postcode, non_null(:integer))
    field(:state, non_null(:string))
  end

  enum :property_filter do
    value(:all)
    value(:occupied)
    value(:vacant)
  end

  object :property do
    field(:id, non_null(:id))
    field(:address, non_null(:address))
    field(:bedrooms, non_null(:integer))
    field(:bathrooms, non_null(:integer))
    field(:carspaces, non_null(:integer))
    field(:photos, non_null(list_of(non_null(:property_photo))))
    field(:landlords, non_null(list_of(non_null(:property_landlord))))

    field(:notification_count, :property_notification_counts) do
      resolve(&LimeLease.Property.PropertyResolver.property_notification_counts_field/3)
    end

    field(:requests, list_of(:property_request)) do
      resolve(dataloader(LimeLease.Property.PropertyContext, :requests))
    end

    field(:tenants, list_of(:tenant)) do
      resolve(dataloader(LimeLease.Property.PropertyContext, :tenants))
    end

    field(:files, list_of(:property_file)) do
      resolve(dataloader(LimeLease.Property.PropertyContext, :files))
    end

    field(:lease, :lease) do
      resolve(dataloader(LimeLease.Property.PropertyContext, :lease))
    end
  end

  connection(node_type: :property)

  object :property_queries do
    @desc "Get a paginated list of properties. Expected errors: unauthorized."
    connection field :my_properties, node_type: :property do
      arg(:filter, :property_filter, default_value: :occupied)
      arg(:search_keywords, :string)

      middleware(Authorize)

      resolve(&LimeLease.Property.PropertyResolver.my_properties_query/3)

      middleware(EctoErrors, [])
    end

    @desc "Fetch a complete property listing. Expected errors: unauthorized, not_found"
    field :fetch_property, non_null(:property) do
      arg(:id, non_null(:id))

      middleware(Authorize)

      resolve(&LimeLease.Property.PropertyResolver.fetch_property_query/3)

      middleware(EctoErrors, [])
    end
  end

  input_object :create_address do
    field(:unit_number, :integer)
    field(:street_number, non_null(:integer))
    field(:street_name, non_null(:string))
    field(:street_type, non_null(:string))
    field(:suburb, non_null(:string))
    field(:postcode, non_null(:integer))
    field(:state, non_null(:string))
  end

  input_object :property_details do
    field :address, non_null(:create_address)
    field(:bedrooms, non_null(:integer))
    field(:bathrooms, non_null(:integer))
    field(:carspaces, non_null(:integer))
  end

  input_object :lease_details do
    field(:id, :id)
    field :start_date, non_null(:datetime)
    field :end_date, non_null(:datetime)
    field :rent_pcm, non_null(:integer)
  end

  input_object :create_photo do
    field(:id, :id)
    field(:name, :string)
    field(:type, :string)
    field(:uri_path, :string)
    field(:url, :string)
  end

  input_object :owner do
    field(:id, :id)
    field(:first_name, non_null(:string))
    field(:last_name, non_null(:string))
    field(:phone_number, non_null(:string))
    field(:email, non_null(:string))
  end

  input_object :landlord do
    field(:id, :id)
    field(:first_name, non_null(:string))
    field(:last_name, non_null(:string))
    field(:phone_number, non_null(:string))
    field(:email, non_null(:string))
  end

  input_object :tenant_object do
    field(:id, :id)
    field(:first_name, non_null(:string))
    field(:last_name, non_null(:string))
    field(:phone_number, non_null(:string))
    field(:email, non_null(:string))
  end

  input_object :file do
    field(:id, :id)
    field(:uri, :string)
    field(:name, non_null(:string))
    field(:type, non_null(:string))
  end

  object :property_mutations do
    @desc "Create a new property"
    field :create_property, non_null(:property) do
      arg(:property_details, non_null(:property_details))
      arg(:lease_details, :lease_details)
      arg(:photos, list_of(non_null(:create_photo)))
      arg(:tenants, list_of(non_null(:tenant_object)))
      arg(:landlords, non_null(list_of(non_null(:landlord))))
      arg(:files, list_of(:file))

      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.Property.PropertyResolver.create_property_mutation/3)
    end

    @desc "Update an existing property"
    field :update_property, non_null(:property) do
      arg(:property_id, non_null(:id))
      arg(:property_details, non_null(:property_details))
      arg(:lease_details, :lease_details)
      arg(:photos, list_of(non_null(:create_photo)))
      arg(:tenants, list_of(non_null(:tenant_object)))
      arg(:landlords, non_null(list_of(non_null(:landlord))))
      arg(:files, list_of(:file))

      middleware(Authorize)
      middleware(EctoErrors)

      resolve(&LimeLease.Property.PropertyResolver.update_property_mutation/3)
    end
  end
end
