class Notification < ActiveRecord::Base
  belongs_to :user
  # CONSTANTS
  DELETED_ROUTE_MSG = ""
  UPDATED_ROUTE_MSG = ""
  ENHANCED_ROUTE_MSG = ""
  DELETED_NODE_MSG = ""
  UPDATED_NODE_MSG = ""
  ADMIN_NODE_USAGE_MSG = ""
  USER_NODE_USAGE_MSG = ""
end
