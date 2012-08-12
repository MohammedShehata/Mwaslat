class Stop < ActiveRecord::Base
  belongs_to :node
  has_many :stoppings, :dependent => :destroy
  has_many :routes, :through => :stoppings
end
