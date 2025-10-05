class DashboardController < ApplicationController
  def index
    @deliveries = current_user.deliveries.recent
    @areas = Area.ordered
    
    # フィルタを適用
    apply_filters
    
    # フィルタ適用後のデータ一覧
    @all_deliveries = @deliveries
    
    # チャート用データ
    prepare_chart_data
    
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
    # 期間
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

    # 地区
    if params[:area_ids].present?
      area_ids = params[:area_ids].is_a?(Array) ? params[:area_ids] : [params[:area_ids]]
      @deliveries = @deliveries.where(area_id: area_ids)
    end

    # 店舗名
    if params[:store_name].present?
      @deliveries = @deliveries.by_store_name(params[:store_name])
    end
  end

  def prepare_chart_data
    # チャート用データはORDER BYを除外して準備
    chart_deliveries = @all_deliveries.reorder(nil)  # ORDER BYを削除
    
    # 地区別配達件数
    @area_delivery_counts = chart_deliveries
      .joins(:area)
      .group('areas.name')
      .count

    # 地区別平均単価
    @area_avg_prices = chart_deliveries
      .joins(:area)
      .group('areas.name')
      .average(:price_yen)
      .transform_values { |v| v.to_i }

    # デバッグ用ログ
    Rails.logger.debug "Area delivery counts: #{@area_delivery_counts}"
    Rails.logger.debug "Area avg prices: #{@area_avg_prices}"
  end
end