defmodule LimeLease.PropertyRequestCategory.PropertyRequestCategoryResolver do
  alias LimeLease.PropertyRequestCategory.PropertyRequestCategoryContext

  def property_request_categories_query(_parent, _args, %{
    context: %{current_user: _user}
  }) do
    PropertyRequestCategoryContext.get_categories()
  end
end
