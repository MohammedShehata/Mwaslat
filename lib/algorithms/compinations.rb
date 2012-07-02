class Compinations
  def get_comp routes
    result = []
    flags = []
    parents = []
    routes.each do |route|
      comp = route.map(&:routes)
      comp = comp.first.product(*comp[1..-1])  # all the compinations
      
      comp.each do |c|
        flags.push(get_flags(c))
        parents.push c
        result.push route
      end
      
    end
    result.push parents
    result.push flags
    return result
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