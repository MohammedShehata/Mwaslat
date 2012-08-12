class CreateStops < ActiveRecord::Migration
  def self.up
    create_table :stops do |t|
      t.string :name
      t.float :lon
      t.float :lat
      t.references :node

      t.timestamps
    end
  end

  def self.down
    drop_table :stops
  end
end
