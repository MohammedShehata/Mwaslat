class Search

  def searches(srcs, dsts)    # src , dest are arrays of nodes
    
    total_pathes = Array.new
    visited = Hash.new
 
    srcs.each do |src| 
      dsts.each do |dst|
        pathes = Array.new
        pathes[0] = Array.new
        puts src.class
        depth_ src,dst,visited,pathes
        pathes.delete_at pathes.size - 1
        pathes.each do |p|
          total_pathes << p
        end
      end
    end

    return total_pathes
  end

  def depth_ node, dst, visited, pathes
    puts node.name
    puts dst.name
    pathes_size = pathes.size
    path = pathes[pathes_size - 1]
    path_size = path.size
    if node != dst and visited[node.id] != true
      edges = node.sub_routes
      v=node
      edges.each do |e|
        if(e.src.id == node.id) 
          v = e.dest
        else
          v=e.src  
        end
        pathes_size = pathes.size
        path = pathes[pathes_size - 1]
        path_size = path.size
        visited[node.id]= true
        path[path_size]= e
        depth_ v,dst,visited,pathes
        pathes_size = pathes.size
        path = pathes[pathes_size - 1]
        path_size = path.size
        visited[node.id]=false
        path.delete_at(path_size-1)
      end
    else
      if(node == dst)
        pathes[pathes_size] = Array.new path
      end   
    end
  end
 

end