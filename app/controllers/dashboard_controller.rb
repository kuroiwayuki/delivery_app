class DashboardController < ApplicationController
  def index
    @deliveries = current_user.deliveries.recent
    @areas = Area.ordered

    apply_filters
    @all_deliveries = @deliveries
    prepare_chart_data
    @deliveries = @deliveries.page(params[:page]).per(50)

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  private

  def apply_filters
    # 期間フィルタ
    if params[:date_from].present? && params[:date_to].present?
      from_date = Date.parse(params[:date_from])
      to_date = Date.parse(params[:date_to]).end_of_day
      @deliveries = @deliveries.in_period(from_date, to_date)
    elsif params[:date_from].present?
      from_date = Date.parse(params[:date_from])
      @deliveries = @deliveries.where('delivered_at >= ?', from_date)
    elsif params[:date_to].present?
      to_date = Date.parse(params[:date_to]).end_of_day
      @deliveries = @deliveries.where('delivered_at <= ?', to_date)
    end

    # 地区フィルタ
    if params[:area_ids].present?
      area_ids = params[:area_ids].is_a?(Array) ? params[:area_ids] : [params[:area_ids]]
      @deliveries = @deliveries.where(area_id: area_ids)
    end

    # 店舗名フィルタ
    if params[:store_name].present?
      @deliveries = @deliveries.by_store_name(params[:store_name])
    end
  end

  def prepare_chart_data
    chart_deliveries = @all_deliveries.reorder(nil)

    @area_delivery_counts = chart_deliveries
      .joins(:area)
      .group('areas.name')
      .count

    @area_avg_prices = chart_deliveries
      .joins(:area)
      .group('areas.name')
      .average(:price_yen)
      .transform_values { |v| v.to_i }
  end
end