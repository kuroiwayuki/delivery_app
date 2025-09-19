class CreateDeliveries < ActiveRecord::Migration[7.2]
  def change
    create_table :deliveries do |t|
      t.references :user, null: false, foreign_key: true
      t.references :area, null: false, foreign_key: true
      t.datetime :delivered_at
      t.integer :price_yen
      t.integer :duration_min
      t.text :memo

      t.timestamps
    end
  end
end
