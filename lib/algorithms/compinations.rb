class Compinations
  def get_comp routes, src
    
    modify_dir routes, src
    
    result = []
    flags = []
    parents = []
    routes.each do |route|
      comp = route.map(&:routes)
      comp = comp.first.product(*comp[1..-1])  # all the compinations
      
      comp.each do |c|
        if !un_wanted c
          flags.push(get_flags(c))
          parents.push c
          result.push route
        end
      end
    end
    result.push parents
    result.push flags
    
    return result
  end
  
  def modify_dir routes, src
    routes.each do |route|
      sub_src = src
      route.each do |sub|
        if !sub_src.index(sub.src)    # swapping
          temp = sub.src
          sub.src = sub.dest
          sub.dest = temp
        end
        sub_src = [sub.dest]
      end
    end
  end
    # prevent some one from leave a some route then take another then take the first again
  def un_wanted comp
    flag = false
    i = 0
    while i < comp.length and !flag
      counter = 0
      for j in (i + 1)..comp.length-1
        if counter == 0
          counter = 1 if comp[i] != comp[j]
        else
          if comp[i] == comp[j]
            flag = true 
            break
          end
        end
      end
      i += 1
    end
    return flag
  end
  
  def get_flags c
    arr = []
    arr[0] = [true, true]
    for j in 1..(c.length-1)
      if c[j] == c[j - 1]
        arr[j - 1][1] = false
      end
      arr[j] = [false, true]
    end
    return arr
  end
  
end  # end of class