
const url_base = "http://www.salecode.co/api/json_files/";
const url_inmuebles = "demeinmuebles.php?jsoncallback=?";
const url_detalle_inmueble = "demedetalleinmueble.php?jsoncallback=?";

var title = "";
var properties = new Array();
var property_details = new Array();
var temp_reg = new Array();

$('#loader-home').hide();
$(document).ready(
	function(event, ui ){
		    $('.ui-listview-filter').addClass('hide');
		 	$('#loader-home').show();
		 	archivoInmuebles = url_base + url_inmuebles;
			 	$.getJSON( archivoInmuebles)
					.done(function(respuestaServer) {
						if(respuestaServer.validacion == "ok"){
							temp_reg = respuestaServer.registros;
							console.log("Temp: "+temp_reg);
							for (var i = 0; i < respuestaServer.registros.length; i++) {
								var elemento = respuestaServer.registros[i];	
								properties[elemento['id']] = elemento;
								getDetails(elemento['id']);
							};

						}else{
							document.getElementById("msj-error").innerHTML="Correo electrónico o contraseña incorrectos";
						}
				}).done( setTimeout("createList()",3500) );
			});


function createList(){
    $("#loader-home").hide();
    $('.ui-listview-filter').removeClass('hide');
	$('#lista-inmuebles li').remove();
	$elmt_lidiv = $('<li data-role="list-divider">Inmuebles</li>');
	$('#lista-inmuebles').append($elmt_lidiv);
	console.log("Temp size: "+temp_reg.length);
	for (var i = 0; i < temp_reg.length; i++) {
		var elemento = temp_reg[i];	
		$elmt_li = $('<li data-theme="a" data-icon="arrow-r"></li>');
		$elmt_a = $('<a id="inmueble-a'+i+'" onclick="almaceneIdInmueble('+elemento['id']+')" href="#infoinmueble"></a>');
		$elmt_i = $('<img src='+ getImageProperty(elemento['id'])+'>');
		$elmt_h4 = $('<h4>'+elemento['post_title']+'</h4>');
		$elmt_p = $('<p>'+elemento['post_content']+'</p>');		
		$elmt_a.append($elmt_i);
		$elmt_a.append($elmt_h4);
		$elmt_a.append($elmt_p);
		$elmt_li.append($elmt_a);
		$('#lista-inmuebles').append($elmt_li);
	};
	$("#lista-inmuebles").listview('refresh');
}

function almaceneIdInmueble(in_id){
	localStorage["id_inm"] = in_id;
}

function getDetails(id_property){
	// recolecta los valores que inserto el usuario
  	archivoDetalleInmueble = url_base + url_detalle_inmueble;
	$.getJSON( archivoDetalleInmueble, { id_inmueble:id_property})
	.done(function(respuestaServer2) {
		if(respuestaServer2.validacion == "ok"){
		    property_details[id_property] = respuestaServer2.registros; 

		    console.log("listo id: "+id_property+" details: "+ property_details[id_property]);	  
		}else{
		  document.getElementById("msj-error").innerHTML="Correo electrónico o contraseña incorrectos";
		}
	})

}

function getImageProperty(id_property){

	registros = property_details[id_property];

	console.log("id: "+id_property+" registros: "+ registros);
	for (var i = 0; i < registros.length; i++) {	
		var elemento = registros[i];			

 		if ( getTitle(elemento['key']) != "None" ) {
 			if ( getTitle(elemento['key']) == "Imagen" ) {
 				return getImageUrl(elemento['value']);	 
 			};		
 		};
	}
}


$( "#infoinmueble" ).on( "pageshow", function( event, ui ) {
	// recolecta los valores que inserto el usuario
  	archivoDetalleInmueble = url_base + url_detalle_inmueble;  	
  	var e = properties[localStorage["id_inm"]];
	registros = property_details[localStorage["id_inm"]];
    $('#datos-top article').empty();
	$('#loader-inmueble').hide();
	$elmt_h = $('<h4> Titulo </h4>');
	$('#datos-top article').append($elmt_h);
	$elmt_p = $('<p>'+e['post_title']+'</p>');	
	$('#datos-top article').append($elmt_p);	
		
	$elmt_img = $('<img>');
	$('#datos-top article').append($elmt_img);	

	for (var i = 0; i < registros.length; i++) {	
		var elemento = registros[i];			

 		if ( getTitle(elemento['key']) != "None" ) {
 			if ( getTitle(elemento['key']) == "Imagen" ) {
 				$('#datos-top article img').attr("src", getImageUrl(elemento['value']));	 
 			}
 			else{
 				$elmt_hd = $('<h4>'+getTitle(elemento['key'])+'</h4>');
 			    $('#datos-top article').append($elmt_hd);

				$elmt_p1 = $('<p>'+elemento['value']+'</p>');	
			    $('#datos-top article').append($elmt_p1);	 
		    };			
 		};
	}

	$elmt_h = $('<h4> Descripción </h4>');
 	$('#datos-top article').append($elmt_h);

 	$elmt_p = $('<p>'+e['post_content']+'</p>');	
	$('#datos-top article').append($elmt_p);

	return false;
})

function getTitle(tag){
	title = "None";
	switch(tag)
	{
		case "_property_slides":
		  title = "Imagen";
		  break;
		case "_property_bathrooms":
		  title = "Baños";
		  break;
		case "_property_bedrooms":
		  title = "Camas";
		  break;
		case "_property_area":
		  title = "Area";
		  break;
		case "_property_price":
		  title = "Precio";
		  break;
		default:
		  title = "None";
	}
	return title;
}

function getImageUrl(text){
  url = "";
  var n = text.indexOf("http");
  var porcion = text.substring(n);
  var n = porcion.indexOf("\"");
  var url = porcion.substring(0, n);
  return url;
}