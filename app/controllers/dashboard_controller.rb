class DashboardController < ApplicationController
  def index
    @deliveries = current_user.deliveries.recent
    @areas = Area.ordered
    
    # フィルタを適用
    apply_filters
    
    # KPI用の全件データを保存
    @all_deliveries = @deliveries
    
    # ページネーションを適用
    @deliveries = @deliveries.page(params[:page]).per(50)
    
    # Turbo Frameリクエストの場合は部分テンプレートをレンダー
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