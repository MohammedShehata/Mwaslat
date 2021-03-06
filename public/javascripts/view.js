var map;

function addStops() {
	map = new Map();
	map.initialize();
	map.addDrawingManager();
	map.addPlaceControl();
	map.addRightClick();
	
	map.showNodes();
	map.addSelectEventToNodes();
}
function editRoutes()
{
	map = new Map();
	map.initialize();
	map.addDrawingManager();
	map.addPlaceControl();
	map.addRightClick();
	map.showNodes();
	map.addSelectEventToNodes();
	map.showingRoute(true);
}
function showRoute()
{
    map = new Map();
    map.initialize();
    map.showingRoute(false);
}
function confirmRouteDeletion()
{
    map = new Map();
    map.initialize();
}
/*
 * "routes" is a global variable with all routes to be confirmed to delete
 * set a global variable "routeStops" with the wanted route to show 
 */
function showConfirmRouteDeletion(routeId)
{
    for(var i = 0; i < routes.length; i ++)
    {
        if(routes[i].route.id == routeId)
        {
            routeStops = routes[i].route.sub_routes
            break
        }
    }
    for(var i = 0; i < routeStops.length; i ++)
    {
        routeStops[i].sub_route = routeStops[i]         
    }
     map.showingRoute(false); // nnot edit route
}
function showingNodes()
{
	map = new Map();
    map.initialize();
    map.enableNodeMode();
    map.addDrawingManager();
    map.addPlaceControl();
    map.addRightClick();
}
function editNode()
{
    map = new Map();
    map.initialize();
    map.showNode(document.getElementById("node_name").value, document.getElementById("node_path").value, true);
} 
function showNode()
{
    map = new Map();
    map.initialize();

// $('#hasmap').equalHeights();
// $('#hasmap').equalWidths();
}
function search()
{
    map = new Map();
    map.initialize();
    map.showNodes();
    map.addRightClick();
    map.addSearchEventToNodes();
}