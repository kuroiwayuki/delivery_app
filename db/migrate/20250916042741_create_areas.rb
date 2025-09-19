class CreateAreas < ActiveRecord::Migration[7.2]
  def change
    create_table :areas do |t|
      t.string :name
      t.string :slug

      t.timestamps
    end
    add_index :areas, :slug
  end
end
