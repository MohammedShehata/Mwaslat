// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var sub_routes_ids = [];
var used_ids = [];
var remove_counter = -10;
var template_1 = "route_sub_routes_attributes_index_";
var template_2 = "route_sub_routes_attributes_index_dest_attributes_";
var to_replace = new RegExp("index", "g");
var sub_route_element = "<div id='sub_route_index'>" + "<fieldset>" + "<div class='control-group'>" +
"<label class='control-label' for='route_sub_routes_attributes_sub_route_index_duration'>Time to next stop</label>" + "<div class='controls'>" +
"<select id='route_sub_routes_attributes_sub_route_index_duration_hours' name='route[sub_routes_attributes][sub_route_index][duration_hours]'>" +
"<option value='0 hours' selected='selected'>0 hours</option>" + "<option value='1 hours'>1 hours</option>" +
"<option value='2 hours'>2 hours</option>" + "<option value='3 hours'>3 hours</option></select> :" +
"<select id='route_sub_routes_attributes_sub_route_index_duration_minutes' name='route[sub_routes_attributes][sub_route_index][duration_minutes]'>" +
"<option value='0 minutes' selected='selected'>0 minutes</option>" +
"<option value='10 minutes'>10 minutes</option>" + "<option value='20 minutes'>20 minutes</option>" +
"<option value='30 minutes'>30 minutes</option>" + "<option value='40 minutes'>40 minutes</option>" +
"<option value='50 minutes'>50 minutes</option></select>" + "</div>" + "</div>" + "<p>" + "<fieldset>" + "<div class='control-group'>" +
"<label class='control-label' for='route_sub_routes_attributes_sub_route_index_dest_attributes_name'>Name</label>" + "<div class='controls'>" +

"<input class='text_field' id='route_sub_routes_attributes_sub_route_index_dest_attributes_name' name='route[sub_routes_attributes][sub_route_index][dest_attributes][name]' size='30' type='text' />" + "</div>" + "</div>" +
"<div class='control-group'>" +
"<label class='control-label' for='route_sub_routes_attributes_sub_route_index_dest_attributes_stop_name'>Name</label>"+
"<div class='controls'>" +
"<input class='text_field' id='route_sub_routes_attributes_sub_route_index_dest_attributes_stop_name' name='route[sub_routes_attributes][sub_route_index][dest_attributes][stop_name]' size='30' type='text' />" +
"</div>" +
"<input id='route_sub_routes_attributes_sub_route_index_dest_attributes_stop_lon' name='route[sub_routes_attributes][sub_route_index][dest_attributes][stop_lon]' type='hidden' />" +
"<input id='route_sub_routes_attributes_sub_route_index_dest_attributes_stop_lat' name='route[sub_routes_attributes][sub_route_index][dest_attributes][stop_lat]' type='hidden' />" +
"<input id='route_sub_routes_attributes_sub_route_index_dest_attributes_stop_id' name='route[sub_routes_attributes][sub_route_index][dest_attributes][stop_id]' type='hidden' />" +
"</div>" +
"<input id='route_sub_routes_attributes_sub_route_index_dest_attributes_path' name='route[sub_routes_attributes][sub_route_index][dest_attributes][path]' type='hidden' />" +
"<input id='route_sub_routes_attributes_sub_route_index_dest_attributes_id' name='route[sub_routes_attributes][sub_route_index][dest_attributes][id]' type='hidden' />" +
"</fieldset>" + "</p>" + "<input id='route_sub_routes_attributes_sub_route_index__destroy' name='route[sub_routes_attributes][sub_route_index][_destroy]' type='hidden' value='false' />" +
"<input id='route_sub_routes_attributes_sub_route_index_id' name='route[sub_routes_attributes][sub_route_index][id]' type='hidden' />" + "</fieldset>" + "</div>";

$(document).ready(function() {
	$("#registerGuideData").hide();
	$("#addNodeGuideData").hide();
	$("#addRouteGuideData").hide();
	$("#searchGuideData").hide();
	$('.dropdown-toggle').dropdown();
	$("#admin_routes_table").dataTable({
		"sDom" : "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType" : "bootstrap",
		"oLanguage" : {
			"sLengthMenu" : "_MENU_ records per page"
		},
		"bSort" : false,
		"aoColumnDefs" : [{
			"bSearchable" : false,
			"aTargets" : [5, 7]
		}],
		"bPaginate" : false,
		"bInfo" : false
	});

	$("#user_routes_table").dataTable({
		"sDom" : "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType" : "bootstrap",
		"oLanguage" : {
			"sLengthMenu" : "_MENU_ records per page"
		},
		"aoColumnDefs" : [{
			"bSortable" : false,
			"aTargets" : [5, 6]
		}, {
			"bSearchable" : false,
			"aTargets" : [5, 6]
		}],
		"bPaginate" : false,
		"bInfo" : false
	});

	$("#admin_nodes_table").dataTable({
		"sDom" : "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType" : "bootstrap",
		"oLanguage" : {
			"sLengthMenu" : "_MENU_ records per page"
		},
		"bSort" : false,
		"aoColumnDefs" : [{
			"bSearchable" : false,
			"aTargets" : [3]
		}],
		"bPaginate" : false,
		"bInfo" : false
	});

	$("#user_nodes_table").dataTable({
		"sDom" : "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType" : "bootstrap",
		"oLanguage" : {
			"sLengthMenu" : "_MENU_ records per page"
		},
		"aoColumnDefs" : [{
			"bSortable" : false,
			"aTargets" : [2]
		}, {
			"bSearchable" : false,
			"aTargets" : [2]
		}],
		"bPaginate" : false,
		"bInfo" : false
	});

});

function show_category_description() {
	var category = $("#node_category").val();
	var description = $("#category_description");
	switch(category) {
		case "District":
			description.html("other users can this place in their routes");
			break;
		case "Automotive":
			description.html("e.g Parking, Repair service, Gas station");
			break;
		case "Business":
			description.html("e.g Bank, ATM, Manufacturing business, Service business");
			break;
		case "Education":
			description.html("e.g ");
			break;
		case "Emergency":
			description.html("ewqs");
			break;
		case "Entertainment":
			description.html("ewqs");
			break;
		case "Food & Drink":
			description.html("ewqs");
			break;
		case "Government":
			description.html("ewqs");
			break;
		case "Lodging":
			description.html("ewqs");
			break;
		case "Public Services":
			description.html("ewqs");
			break;
		case "Shops":
			description.html("ewqs");
			break;
		case "Tourist Attraction":
			description.html("ewqs");
			break;
		case "Travel":
			description.html("ewqs");
			break;
		case "Recreation":
			description.html("ewqs");
			break;
		case "Other":
			description.html("ewqs");
			break;
		default:
			description.html("ewqs");
	}
}

// 0. 1. 2. 3. ...
function remove_child(sub_route_index) {
	if(sub_route_index < sub_routes_ids.length && (sub_route_index >= 0)) {
		var div_index = sub_routes_ids[sub_route_index];
		var div = $("#" + div_index.toString().replace(".", "\\."));
		div.hide();
		$("#" + template_1.replace(to_replace, div_index).replace(".", "\\.") + "_destroy").val("1");
		if(sub_route_index == 0) {// if first node, then hide next duration field
			sub_routes_ids.shift();
			hide_time_fields(sub_routes_ids[0]);
		} else {
			sub_routes_ids.splice(sub_route_index, 1);
		}
	} else {
		// alert("Problem");
	}
	rename_stops(sub_route_index);
}

function clear_name_field(sub_route_index) {
	var node_id_template = "#" + template_2.replace(to_replace, sub_routes_ids[1]).replace(".", "\\.");
	if(sub_route_index == 0){
		var name = $(node_id_template + "name").val();
		var path = $(node_id_template + "path").val();
		var id = $(node_id_template + "id").val();
		var node_id_template_1 = "#" + template_2.replace(to_replace, sub_routes_ids[0]).replace(".", "\\.");
		if(name != ""){
			$(node_id_template_1 + "name").val(name);
			$(node_id_template_1 + "name").removeAttr("disabled");
			if(id != ""){
				$(node_id_template_1 + "name").attr("disabled", "disabled");
				$(node_id_template_1 + "path").val(path);
				$(node_id_template_1 + "id").val(id);
			}
		}
		else{
			$(node_id_template_1 + "name").val("");
			$(node_id_template_1 + "name").removeAttr("disabled");
			$(node_id_template_1 + "path").val("");
			$(node_id_template_1 + "id").val("");
		}
	}
	$(node_id_template + "name").val("");
	$(node_id_template + "name").removeAttr("disabled");
	$(node_id_template + "path").val("");
	$(node_id_template + "id").val("");
}

// 0. 1. 2. 3. .....
function add_child(sub_route_index) {
	// "sub_route_element" is a variable set using the form builder in the .html.erb file
	var sub_route_instance = sub_route_element.toString();
	var regexp = new RegExp("sub_route_index", "g");
	var new_sub_route_id;
	var sub_route_before;
	if(sub_route_index == 0) {// adds a new source stop
		new_sub_route_id = get_new_id(0);
		show_time_fields(sub_routes_ids[0]);
		sub_route_before = $(("#" + sub_routes_ids[0]).replace(".", "\\."));
		sub_route_before.before(sub_route_instance.replace(regexp, new_sub_route_id));
		sub_routes_ids.unshift(new_sub_route_id);
		hide_time_fields(sub_routes_ids[0]);
	} else {
		if(sub_route_index == sub_routes_ids.length) {// adds a new destination stop
			new_sub_route_id = get_dest_id();
			sub_route_before = $(("#" + sub_routes_ids[sub_route_index - 1]).replace(".", "\\."));
			sub_route_before.after(sub_route_instance.replace(regexp, new_sub_route_id));
			sub_routes_ids.push(new_sub_route_id);
		} else if(sub_route_index < sub_routes_ids.length && (sub_route_index > 0)) {// adds a new intermediate stop
			new_sub_route_id = get_new_id(sub_route_index);
			sub_route_before = $(("#" + sub_routes_ids[sub_route_index - 1]).replace(".", "\\."));
			sub_route_before.after(sub_route_instance.replace(regexp, new_sub_route_id));
			sub_routes_ids.splice(sub_route_index, 0, new_sub_route_id);
		} else {
			// alert("Problem");
		}
	}
	rename_stops(sub_route_index);
}

function rename_stops(start) {
	for(var i = start; i < sub_routes_ids.length; i++) {
		$("label[for=" + template_2.replace(to_replace, sub_routes_ids[i]).replace(".", "\\.") + "name]").html("Stop " + (i + 1));
	}
}

// it makes three actions =>
// first : set numbered names of initial stops
// second : changes ids of the initial children divs
// third : hides first time field of first child
function prepare_form() {
	// changes ids of sub_routes divs
	var sub_routes = $("#sub_routes #sub_route_index");
	for(var i = 0; i < sub_routes.length; i++) {
		sub_routes.eq(i).attr("id", i);
		sub_routes_ids.push(i);
		// add the index to array of ids
		used_ids.push(i);
	}
	// assigns numbered names of stops
	rename_stops(0);
	// hides first time field
	hide_time_fields(0)
}

// shows the time fields of the div of specified id
function show_time_fields(id) {
	var minutes_key = template_1.replace(to_replace, id).replace(".", "\\.") + "duration_minutes";
	$("#" + minutes_key).parent().parent().show();
}

// hides the time fields of the div of specified id
function hide_time_fields(id) {
	var minutes_key = template_1.replace(to_replace, id).replace(".", "\\.") + "duration_minutes";
	$("#" + minutes_key).parent().parent().hide();
}

/*
 * "isFirst" is set to true when the added node is the first or second node
 * "sub_route_index" represents the ordering of the node
 * other attrs are for node's data
 */
function add_selected_node(name, path, id, sub_route_index, isFirst) {
	if(!isFirst) {
		add_child(sub_route_index);
	}
	var node_id_template = "#" + template_2.replace(to_replace, sub_routes_ids[sub_route_index]).replace(".", "\\.");
	$(node_id_template + "name").val(name);
	$(node_id_template + "path").val(path);
	$(node_id_template + "id").val(id);
	$(node_id_template + "name").attr("disabled", "disabled");
}

function add_selected_stop(name, lat, lon, id, sub_route_index) {
	var node_id_template = "#" + template_2.replace(to_replace, sub_routes_ids[sub_route_index]).replace(".", "\\.");
	$(node_id_template + "stop_name").val(name);
	$(node_id_template + "stop_lat").val(lat);
	$(node_id_template + "stop_lon").val(lon);
	$(node_id_template + "stop_id").val(id);
	$(node_id_template + "stop_name").attr("disabled", "disabled");
}

function fillPaths() {
	var overlays = map.getOverlays();
	for(var i = 0; i < sub_routes_ids.length; i++) {
		var hidden_path_id = "#" + template_2.replace(to_replace, sub_routes_ids[i]).replace(".", "\\.") + "path";
		var hidden_stop_lat_id = "#" + template_2.replace(to_replace, sub_routes_ids[i]).replace(".", "\\.") + "stop_lat";
		var hidden_stop_lon_id = "#" + template_2.replace(to_replace, sub_routes_ids[i]).replace(".", "\\.") + "stop_lon";
		$(hidden_path_id).val(overlays[i].getPointString());
		$(hidden_stop_lat_id).val(overlays[i].marker.getPosition().lat());
		$(hidden_stop_lon_id).val(overlays[i].marker.getPosition().lng());
	}
}

function get_dest_id() {
	var new_sub_route_id = sub_routes_ids[sub_routes_ids.length - 1] + 1;
	while(is_used(new_sub_route_id)) {
		new_sub_route_id++;
	}
	used_ids.push(new_sub_route_id);
	return new_sub_route_id;
}

function get_new_id(sub_route_index) {
	var x, y, new_sub_route_id;
	var divisor = 2;
	if(sub_route_index == 0) {
		x = sub_routes_ids[0];
		y = -1;
	} else {
		x = sub_routes_ids[sub_route_index];
		y = sub_routes_ids[sub_route_index - 1];
	}
	if((x + y) == 0) {
		new_sub_route_id = (Math.abs(x) + Math.abs(y)) / divisor - Math.abs(x);
		while(is_used(new_sub_route_id)) {
			divisor++;
			new_sub_route_id = (Math.abs(x) + Math.abs(y)) / divisor - Math.abs(x);
		}
	} else {
		new_sub_route_id = (x + y) / divisor;
		while(is_used(new_sub_route_id)) {
			divisor++;
			new_sub_route_id = (x + y) / divisor;
		}
	}
	used_ids.push(new_sub_route_id);
	return new_sub_route_id;
}

function is_used(id) {
	for(var i = 0; i < used_ids.length; i++) {
		if(used_ids[i] == id)
			return true;
	}
	return false;
}

function fillNodePath() {
	var overlays = map.getOverlays();
	document.getElementById("node_path").value = overlays[0].getPointString();
}

$(function() {
	$(".auto").autocomplete({
		source : function(request, response) {
			var term = request.term;
			lastXhr = $.getJSON("/routes/nodes/districts.json", request, function(data, status, xhr) {
				response(data);
			});
		}
	});
});
function activeLi(element) {
	liArray = document.getElementById("navlist").childNodes;
	i = 0;
	while(liArray[i]) {
		liArray[i].id = "";
		i++;

	}
	element.id = "active";
}

function openGuideData(index) {
	if(index == 1) {
		$("#registerGuideData").show();
		$("#addNodeGuideData").hide();
		$("#addRouteGuideData").hide();
		$("#searchGuideData").hide();
	} else if(index == 2) {
		$("#registerGuideData").hide();
		$("#addNodeGuideData").show();
		$("#addRouteGuideData").hide();
		$("#searchGuideData").hide();
	} else if(index == 3) {
		$("#registerGuideData").hide();
		$("#addNodeGuideData").hide();
		$("#addRouteGuideData").show();
		$("#searchGuideData").hide();
	} else {
		$("#registerGuideData").hide();
		$("#addNodeGuideData").hide();
		$("#addRouteGuideData").hide();
		$("#searchGuideData").show();

	}
}