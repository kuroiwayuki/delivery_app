class DashboardController < ApplicationController
  def index
    @deliveries = current_user.deliveries.recent.limit(200)
    @areas = Area.ordered
  end
end
