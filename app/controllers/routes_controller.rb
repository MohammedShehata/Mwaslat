require 'geo_ruby'

class RoutesController < ApplicationController
  before_filter :allow_guest!, :only => [:index, :new, :create, :edit, :update, :apply_changes, :enhance_results, :enhance_route]
  before_filter :prevent_guest!, :only => [:destroy]

  def show
    @route = Route.find(params[:id])
    authorize_route(@route)
    @route.set_sub_routes_durations
    @route.order_sub_routes
    @route.sub_routes = @route.sub_routes.unshift(SubRoute.new(:dest=> @route.sub_routes[0].src))
  end
  
  def index
   if current_user.admin?
     @search = Route.search(params[:search])
     @routes = @search.group("id").page(params[:page]).per_page(15)
   else
     @routes = current_user.routes
   end
  end
  
  def new
    @route = Route.new
    2.times do
      sub_route = @route.sub_routes.build
      sub_route.dest = Node.new
    end
  end
  
  def create
    numOfStops = 0
    children = []
    notified_nodes = []
    created_districts = []
    children_params = params[:route]["sub_routes_attributes"]
    keys = children_params.keys
    keys.collect! {|i| i.to_f}
    keys.sort!
    keys.collect! do |i|
       if i == i.to_i
         i.to_i.to_s
       else
         i.to_s
       end
    end
    for i in 0..keys.length-1
      child_params = children_params[keys[i]]
      dest_params = child_params["dest_attributes"]
      dest_id = dest_params["id"]
      if child_params["_destroy"] != "1"
        numOfStops += 1
        child = SubRoute.new
        if(dest_id == "")
          dest = Node.new(dest_params)
          if(dest.name = "" || dest.path == "")
            numOfStops = 0
            break
          end
          dest.category = "District"
          dest.user = current_user
          created_districts.push (dest)
        else
          dest = Node.find(dest_id)
          notified_nodes.push(dest) if (dest.user != current_user)
        end
        child.dest = dest
        child.duration_hours = child_params["duration_hours"].split(" ")[0].to_i
        child.duration_minutes = child_params["duration_minutes"].split(" ")[0].to_i
        child.sum_duration
        children.push(child)
      end
    end
    if(numOfStops < 2)
      redirect_to(:back, :notice => "Invalid Stops' Data. Please be sure to either select places from tha map or add a new polygon and provide each with a proper name")
    else
    params[:route].delete("sub_routes_attributes")
    @route = Route.new(params[:route])
    mappings = []
    for i in 1..children.length-1
      children[i].src = children[i-1].dest
      if(children[i].src.id.nil? || children[i].dest.id.nil?)
        children[i].save
        mappings.push(Mapping.new(:route => @route, :sub_route => children[i], :duration => children[i].duration))
      else
        s = SubRoute.search(:src_id_eq => children[i].src.id, :dest_id_eq => children[i].dest.id).all
        if(s.empty?)
          children[i].save
          mappings.push(Mapping.new(:route => @route, :sub_route => children[i], :duration => children[i].duration))
        else
          mappings.push(Mapping.new(:route => @route, :sub_route => s[0], :duration => children[i].duration))
        end
      end
    end
    children = children.drop(1)    # removes first sub-route
    created_districts.each do |district|
      district.setChildren()
    end
    @route.mappings = mappings
    @route.user = current_user
    respond_to do |format|
      if @route.save
        notify_nodes_users(notified_nodes, @route)
        format.html { redirect_to(routes_path, :notice => "Route successfully Added") }
      else
        format.html { render :action => "new" }
      end
    end
    end
  end
  
  def edit
    @route = Route.find(params[:id])
    authorize_route(@route)
    @route.set_sub_routes_durations
    @route.order_sub_routes
    @route.sub_routes = @route.sub_routes.unshift(SubRoute.new(:dest=> @route.sub_routes[0].src))
  end
  
  def update
    @route = Route.find(params[:id])
    authorize_route(@route)
    numOfStops = 0
    notified_nodes = []
    children = []
    children_params = params[:route]["sub_routes_attributes"]
    keys = children_params.keys
    keys.collect! {|i| i.to_f}
    keys.sort!
    keys.collect! do |i|
       if i == i.to_i 
         i.to_i.to_s
       else
         i.to_s 
       end
    end
    for i in 0..keys.length-1
      child_params = children_params[keys[i]]
      child_id = child_params["id"]
      dest_params = child_params["dest_attributes"]
      dest_id = dest_params["id"]
      if child_params["_destroy"] == "1"
        @route.getMapping(child_id.to_i).destroy() if child_id != ""
      else
        numOfStops += 1
        child = SubRoute.new
        if(dest_id == "")
          dest = Node.new(dest_params)
          if(dest.name = "" || dest.path == "")
            numOfStops = 0
            break
          end
          dest.category = "District"
          dest.user = current_user
        else
          dest = Node.find(dest_id)
          notified_nodes.push(dest) if (dest.user != current_user && !@route.nodes.include?(dest))
        end
        child.dest = dest
        child.duration_hours = child_params["duration_hours"].split(" ")[0].to_i
        child.duration_minutes = child_params["duration_minutes"].split(" ")[0].to_i
        child.sum_duration
        children.push(child)
      end
    end
    if(numOfStops < 2)
      redirect_to(:back, :notice => "Invalid Stops' Data. Please be sure to either select places from tha map or add a new polygon and provide each with a proper name")
    else
      params[:route].delete("sub_routes_attributes")
      @route.update_attributes(params[:route])
      mappings = []
      for i in 1..children.length-1
        children[i].src = children[i-1].dest
        if(children[i].src.id.nil? || children[i].dest.id.nil?)
          children[i].save
          mappings.push(Mapping.new(:route => @route, :sub_route => children[i], :duration => children[i].duration))
        else
          s = SubRoute.search(:src_id_eq => children[i].src.id, :dest_id_eq => children[i].dest.id).all
          if(s.empty?)
            children[i].save
            mappings.push(Mapping.new(:route => @route, :sub_route => children[i], :duration => children[i].duration))
          else
            found_mapping = @route.getMapping(s[0].id)
            if(found_mapping.nil?)
              mappings.push(Mapping.new(:route => @route, :sub_route => s[0], :duration => children[i].duration))
            else
              found_mapping.update_attributes(:duration => children[i].duration)
              mappings.push(found_mapping)
            end
          end
        end
      end
      # children[0].destroy
      children = children.drop(1)    # removes first sub-route
      @route.mappings = mappings
      respond_to do |format|
        if @route.save
          if(current_user.admin?)
            notify_route(@route, "updated")
          end
          notify_nodes_users(notified_nodes, @route)
          format.html { redirect_to(routes_path, :notice => "Route successfully Updated") }
        else
          format.html { render :action => "new" }
        end
      end
    end
  end

  def enhance_route
    @route = Route.find(params[:id])
    @route.set_sub_routes_durations
    @route.order_sub_routes
    @route.sub_routes = @route.sub_routes.unshift(SubRoute.new(:dest=> @route.sub_routes[0].src))
  end
  
  def apply_changes
    @route = Route.find(params[:id])
    notified_nodes = []
    children = []
    children_params = params[:route]["sub_routes_attributes"]
    keys = children_params.keys
    keys.collect! {|i| i.to_f}
    keys.sort!
    keys.collect! do |i|
       if i == i.to_i 
         i.to_i.to_s
       else
         i.to_s 
       end
    end
    for i in 0..keys.length-1
      child_params = children_params[keys[i]]
      child_id = child_params["id"]
      dest_params = child_params["dest_attributes"]
      dest_id = dest_params["id"]
      if child_params["_destroy"] != "1"
        child = SubRoute.new
        if(dest_id == "")
          dest = Node.new(dest_params)
          dest.category = "District"
          dest.user = current_user
        else
          dest = Node.find(dest_id)
          notified_nodes.push(dest) if (dest.user != current_user && !@route.nodes.include?(dest))
        end
        child.dest = dest
        child.duration_hours = child_params["duration_hours"].split(" ")[0].to_i
        child.duration_minutes = child_params["duration_minutes"].split(" ")[0].to_i
        child.sum_duration
        children.push(child)
      end
    end
    params[:route].delete("sub_routes_attributes")
    mappings = []
    for i in 1..children.length-1
      children[i].src = children[i-1].dest
      if(children[i].src.id.nil? || children[i].dest.id.nil?)
        children[i].save
        mappings.push(Mapping.new(:route => @route, :sub_route => children[i], :duration => children[i].duration))
      else
        s = SubRoute.search(:src_id_eq => children[i].src.id, :dest_id_eq => children[i].dest.id).all
        if(s.empty?)
          children[i].save
          mappings.push(Mapping.new(:route => @route, :sub_route => children[i], :duration => children[i].duration))
        else
          found_mapping = @route.getMapping(s[0].id)
          if(found_mapping.nil?)
            mappings.push(Mapping.new(:route => @route, :sub_route => s[0], :duration => children[i].duration))
          else
            found_mapping.update_attributes(:duration => children[i].duration)
            mappings.push(found_mapping)
          end
        end
      end
    end
    children = children.drop(1)    # removes first sub-route
    @route.mappings = mappings
    respond_to do |format|
      if @route.save
        if(current_user != @route.user)
          notify_route_enhancement(@route)
        end
        notify_nodes_users(notified_nodes, @route)
        format.html { redirect_to(routes_path, :notice => "You successfully enhanced a route") }
      else
        format.html { render :action => "new" }
      end
    end
  end

  def destroy
    route = Route.find(params[:id])
    if(current_user.admin?)
      notify_route(route, "deleted")
      route.destroy
      redirect_to(routes_path, :notice => "Route successfully Deleted")
    elsif(current_user == route.user)
      route.destroy
      redirect_to(routes_path, :notice => "Route successfully Deleted")
    else
      error_page
    end
  end
  
  def search
    if(params[:src] != nil or params[:dest] != nil)
      n = Node.new
      if(params[:src] != "" and params[:dest] != "")
          @src = get_poi_destricts(Node.where(:name => params[:src]))
          @dest = get_poi_destricts(Node.where(:name => params[:dest]))
      elsif(params[:p_src] != "")
        x = params[:p_src].split(',')[0]
        y = params[:p_src].split(',')[1]
        p = GeoRuby::SimpleFeatures::Point.new
        p.x = x.to_f
        p.y = y.to_f
        @src = n.contained_districts p
        @dest = get_poi_destricts(Node.where(:name => params[:dest]))
      elsif(params[:p_dest] != "")
        x = params[:p_dest].split(',')[0]
        y = params[:p_dest].split(',')[1]
        p = GeoRuby::SimpleFeatures::Point.new
        p.x = x.to_f
        p.y = y.to_f
        @src = get_poi_destricts(Node.where(:name => params[:src]))
        @dest = n.contained_districts p
      end

      search = Search.new
      routes = search.searches(@src, @dest)
      comp = Compinations.new
      @routes = comp.get_comp routes, @src

      respond_to do |format|
          format.html
          if params[:key] == "1234"
            format.xml       # search.xml
          end
      end
    end
  end
  
  def get_poi_destricts arr
    districts = []
    arr.each do |node|
      if node.category == "District"
        districts.push node
      else
        districts += node.districts
      end
    end
    return districts
  end
  
  def enhance_results
    @name = params[:name]
    @routes = Route.search(:sub_routes_src_name_or_sub_routes_dest_name_like => @name).all
  end
  
  def data
    if params[:commit]
      if params[:commit] == ">"
        @nodes = Node.offset(params[:next].to_i).first(10)
        if @nodes.length == 0
          @nodes = Node.offset(params[:next].to_i - 10).first(10)
          @next = params[:next].to_i - 10
        else
          @next = params[:next].to_i + 10
        end
      else
        if params[:next].to_i - 20 <= 0
          @nodes = Node.first 10
          @next = 10
        else
          @nodes = Node.offset(params[:next].to_i - 20).first(10)
          @next = params[:next].to_i - 10
        end
      end
    else
      @nodes = Node.first 10
      @next = 10
    end
  end
  
private

  def notify_nodes_users(nodes, route)
    nodes.each do |node|
      notify_node_usage(node, route)
    end
  end
  def authorize_route(route)
    if(!current_user.admin? && current_user != route.user)
      error_page
    end
  end
end