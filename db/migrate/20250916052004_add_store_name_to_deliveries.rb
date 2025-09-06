class AddStoreNameToDeliveries < ActiveRecord::Migration[7.2]
  def change
    add_column :deliveries, :store_name, :string
  end
end
