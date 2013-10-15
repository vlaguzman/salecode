
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
							for (var i = 0; i < respuestaServer.registros.length; i++) {
								var elemento = respuestaServer.registros[i];	
								properties[elemento['id']] = elemento;
								getDetails(elemento['id']);
							};

						}else{
							document.getElementById("msj-error").innerHTML="No ha sido posible obtener la información. Verifique su conexión a internet e intenete abrir la aplicación nuevamente.";
						}
				}).done( setTimeout("createList()",5000) );
			});


function createList(){
    $("#loader-home").hide();
    $('.ui-listview-filter').removeClass('hide');
    $('#home .principal-content').addClass('no-background');
	$('#lista-inmuebles li').remove();
	$elmt_lidiv = $('<li data-role="list-divider">Ofertas</li>');
	$('#lista-inmuebles').append($elmt_lidiv);
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
	setTimeout("updteList()",500);

}

function updteList(){
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
		}else{
		  document.getElementById("msj-error").innerHTML="No ha sido posible obtener los detalles de los inmuebles. Verifique su conexión a internet e intente abrir la aplicación nuevamente.";
		}
	})

}

function getImageProperty(id_property){

	registros = property_details[id_property];
	for (var i = 0; i < registros.length; i++) {	
		var elemento = registros[i];			

 		if ( getTitle(elemento['key']) != "None" ) {
 			if ( getTitle(elemento['key']) == "Imagen" ) {
 				var array_images = getImageUrl(elemento['value']);
 				return array_images[0];	 
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

	$elmt_h = $('<h4> Descripción </h4>');
 	$('#datos-top article').append($elmt_h);
 	$elmt_p = $('<p>'+e['post_content']+'</p>');	
	$('#datos-top article').append($elmt_p);
 
 	$('#datos-top section .flexslider .slides li').empty();
        	
	$elmt_li = $('<li id="galery_li1">');
	$elmt_li2 = $('<li id="galery_li2">');
	$elmt_li3 = $('<li id="galery_li3">');

	$('#datos-top .slider .flexslider .slides').append($elmt_li);
	$('#datos-top .slider .flexslider .slides').append($elmt_li2);
	$('#datos-top .slider .flexslider .slides').append($elmt_li3);

	$elmt_img = $('<img id="img1">');
	$('#datos-top section ul li#galery_li1').append($elmt_img);	

	$elmt_img2 = $('<img id="img2">');
	$('#datos-top section ul li#galery_li2').append($elmt_img2);	

	$elmt_img3 = $('<img id="img3">');
	$('#datos-top section ul li#galery_li3').append($elmt_img3);	


	for (var i = 0; i < registros.length; i++) {	
		var elemento = registros[i];			

 		if ( getTitle(elemento['key']) != "None" ) {
 			if ( getTitle(elemento['key']) == "Imagen" ) {
 				var array_images = getImageUrl(elemento['value']);
 				$('#datos-top section img#img1').attr("src", array_images[0]);
 				$('#datos-top section img#img2').attr("src", array_images[1]);
 				$('#datos-top section img#img3').attr("src", array_images[2]);
 			}
 			else{
 				$elmt_hd = $('<h4>'+getTitle(elemento['key'])+'</h4>');
 			    $('#datos-top article').append($elmt_hd);

				$elmt_p1 = $('<p>'+elemento['value']+'</p>');	
			    $('#datos-top article').append($elmt_p1);	 
		    };			
 		};
	}



	loadSlider();

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

function loadSlider(){
      $('.flexslider').flexslider({
        animation: "slide",
        start: function(slider){
          $('body').removeClass('loading');
        }
      });
}

function getImageUrl(text){
  var url = new Array();
  
  var init = text.indexOf("http");
  var partial = text.substring(init);
  var fin = partial.indexOf("\"");
  url[0] = partial.substring(0, fin);

  var text2 = partial.substring(fin);
  var init2  = text2.indexOf("http");
  var partial2 = text2.substring(init2);
  var fin2 = partial2.indexOf("\"");
  url[1] = partial2.substring(0, fin2);

  var text3 = partial2.substring(fin2);
  var init3  = text3.indexOf("http");
  var partial3 = text3.substring(init3);
  var fin3 = partial3.indexOf("\"");
  url[2] = partial3.substring(0, fin3);

  return url;
}
