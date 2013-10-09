
const url_base = "http://www.salecode.co/app/json_files/";
const url_inmuebles = "demeinmuebles.php?jsoncallback=?";
const url_detalle_inmueble = "demedetalleinmueble.php?jsoncallback=?";

var title = "";
var inmuebles = new Array();

$('#loader-home').hide();
$(document).ready(
	function(event, ui ){
		 	$('#loader-home').show();
		 	archivoInmuebles = url_base + url_inmuebles;
		 
			 	$.getJSON( archivoInmuebles)
					.done(function(respuestaServer) {
						$("#loader-home").hide();
						if(respuestaServer.validacion == "ok"){
							$('#lista-inmuebles li').remove();
							$elmt_lidiv = $('<li data-role="list-divider">Inmuebles</li>');
							$('#lista-inmuebles').append($elmt_lidiv);
							for (var i = 0; i < respuestaServer.registros.length; i++) {
								
								var elemento = respuestaServer.registros[i];	
								inmuebles[elemento['id']] = elemento;
								$elmt_li = $('<li data-theme="a" data-icon="arrow-r"></li>');
								console.log(elemento['post_title']);
								$elmt_a = $('<a id="inmueble-a'+i+'" onclick="almaceneIdInmueble('+elemento['id']+')" href="#infoinmueble"></a>');
								$elmt_h4 = $('<h4>'+elemento['post_title']+'</h4>');
								$elmt_p = $('<p>'+elemento['post_content']+'</p>');		
								$elmt_a.append($elmt_h4);
								$elmt_a.append($elmt_p);
								$elmt_li.append($elmt_a);
								$('#lista-inmuebles').append($elmt_li);
							};

						}else{

						}
						$("#lista-inmuebles").listview('refresh');
				})	
		}
);



function almaceneIdInmueble(in_id){
	localStorage["id_inm"] = in_id;
}

$( "#infoinmueble" ).on( "pageshow", function( event, ui ) {
	// recolecta los valores que inserto el usuario
  	archivoDetalleInmueble = url_base + url_detalle_inmueble;
  	
  	var e = inmuebles[localStorage["id_inm"]];
	$.getJSON( archivoDetalleInmueble, { id_inmueble:localStorage["id_inm"]})
	.done(function(respuestaServer2) {
		
	    $('#datos-top article').empty();
		if(respuestaServer2.validacion == "ok"){
			$('#loader-inmueble').hide();
		 	/// si la validacion es correcta, muestra la pantalla "home"
 			
		 	$elmt_h = $('<h4> Titulo </h4>');
		 	$('#datos-top article').append($elmt_h);
		 	$elmt_p = $('<p>'+e['post_title']+'</p>');	
			$('#datos-top article').append($elmt_p);	
			
			$elmt_img = $('<img>');
			$('#datos-top article').append($elmt_img);	

		    for (var i = 0; i < respuestaServer2.registros.length; i++) {	
				var elemento = respuestaServer2.registros[i];			

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
		  
		}else{
		  document.getElementById("msj-error").innerHTML="Correo electrónico o contraseña incorrectos";
		}
	})
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