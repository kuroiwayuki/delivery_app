class DashboardController < ApplicationController
  def index
    @deliveries = current_user.deliveries.recent.limit(200)
    @areas = Area.ordered
    
    # 非同期リクエストの場合のみフィルタを適用
    if request.xhr?
      apply_filters
      render partial: 'dashboard_content', locals: { deliveries: @deliveries, areas: @areas }
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

    # 地区フィルタ（複数選択対応）
    if params[:area_ids].present?
      area_ids = params[:area_ids].is_a?(Array) ? params[:area_ids] : [params[:area_ids]]
      @deliveries = @deliveries.where(area_id: area_ids)
    end

    # 店舗名フィルタ
    if params[:store_name].present?
      @deliveries = @deliveries.by_store_name(params[:store_name])
    end
  end
end
