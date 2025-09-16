class DeliveriesController < ApplicationController
  before_action :set_delivery, only: [:show, :edit, :update, :destroy]

  def index
    @deliveries = current_user.deliveries.recent
  end

  def show
  end

  def new
    @delivery = current_user.deliveries.build
    @areas = Area.ordered
  end

  def create
    @delivery = current_user.deliveries.build(delivery_params)
    @areas = Area.ordered

    if @delivery.save
      redirect_to @delivery, notice: '配達記録を作成しました。'
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
    @areas = Area.ordered
  end

  def update
    if @delivery.update(delivery_params)
      redirect_to @delivery, notice: '配達記録を更新しました。'
    else
      @areas = Area.ordered
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @delivery.destroy
    redirect_to deliveries_url, notice: '配達記録を削除しました。'
  end

  private

  def set_delivery
    @delivery = current_user.deliveries.find(params[:id])
  end

  def delivery_params
    params.require(:delivery).permit(:area_id, :delivered_at, :price_yen, :duration_min, :memo)
  end
end
