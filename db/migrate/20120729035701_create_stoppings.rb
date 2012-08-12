class CreateStoppings < ActiveRecord::Migration
  def self.up
    create_table :stoppings do |t|
      t.references :stop
      t.references :route

      t.timestamps
    end
  end

  def self.down
    drop_table :stoppings
  end
end
