
const url_base = "http://www.salecode.co/api/json_files/";
const url_inmuebles = "demeinmuebles.php?jsoncallback=?";
const url_detalle_inmueble = "demedetalleinmueble.php?jsoncallback=?";

var title = "";
var properties = new Array();
var property_agency = new Array();
var property_details = new Array();
var agency_details = new Array();
var property_agency_numbers = new Array(); 

var temp_reg = new Array();
var first_error = true;

$(document).ready(
	function (event, ui ){
		loadList();
	}
);

$("#btn-reload").click(function() {
  $('#error-wrap').empty();
  loadList();
});

function loadList(){
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
							setTimeout("getAgency("+elemento['id']+")",3000);
						};

					}else{
						$elmt_p= $('<p id="msj-error">No ha sido posible obtener la información. Verifique su conexión a internet e intenete abrir la aplicación nuevamente.</p>');
						$('#error-wrap').append($elmt_p);
					}
			}).done( setTimeout("createList()",2000) )
			.fail(function() {
				$elmt_p= $('<p id="msj-error">No ha sido posible obtener la información. Verifique su conexión a internet.</p>');
				$('#error-wrap').append($elmt_p);
  			});

  		

		}

function getAgency(id_property){
	var id_agency = 0;
	try{
		registros = property_details[id_property];
		for (var i = 0; i < registros.length; i++) {
			var elemento = registros[i];
	 			if (getTitle(elemento['key']) == "Agencia"){
	 				text = elemento['value'];
		        	var init = text.indexOf("\"");
					var partial = text.substring(init+1);
					var fin = partial.indexOf("\;");
					agency = partial.substring(0, fin-1);
					id_agency = parseInt(agency);
					property_agency[id_property] = id_agency;
					loadDetailsAgency(id_agency);
		        };
		}
	}catch(err){
	    if (first_error) {
			  $elmt_p= $('<p id="msj-error">No ha sido posible obtener toda la información de las agencias. Verifique su conexión a internet y haga click en recargar.</p>');
			  $('#error-wrap').append($elmt_p);
	     };
	    first_error = false;
	}
}


function createList(){
  try{	
    $("#loader-home").hide();
    $('.ui-listview-filter').removeClass('hide');
    $('#home .principal-content').addClass('no-background');
	$('#lista-inmuebles li').remove();
	$elmt_lidiv = $('<li id="title-list" data-role="list-divider">Ofertas</li>');
	$('#lista-inmuebles').append($elmt_lidiv);
	 if (temp_reg.length == 0) {
      $elmt_p= $('<p id="msj-error">No ha sido posible obtener la información. Verifique su conexión a internet y haga click en recargar.</p>');
	  $('#error-wrap').append($elmt_p);
     };
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
	setTimeout("updteList()",2500);
  }
  catch(err){
    if (first_error) {
      $elmt_p= $('<p id="msj-error">No ha sido posible obtener la información. Verifique su conexión a internet y haga click en recargar.</p>');
	  $('#error-wrap').append($elmt_p);
     };
     first_error = false;
  }

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
		  if (first_error) {
		    $elmt_p= $('<p id="msj-error">No ha sido posible obtener los detalles de los inmuebles. Verifique su conexión a internet e intente abrir la aplicación nuevamente.</p>');
		    $('#error-wrap').append($elmt_p);
           };
          first_error = false;
		}
	})

}

function loadDetailsAgency(id_agency){
	// recolecta los valores que inserto el usuario
  	archivoDetalleInmueble = url_base + url_detalle_inmueble;
	$.getJSON( archivoDetalleInmueble, { id_inmueble:id_agency})
	.done(function(respuestaServer2) {
		if(respuestaServer2.validacion == "ok"){
		    agency_details[id_agency] = respuestaServer2.registros;   
		}else{
		  if (first_error) {
		    $elmt_p= $('<p id="msj-error">No ha sido posible obtener los detalles de las agencias. Verifique su conexión a internet e intente abrir la aplicación nuevamente.</p>');
		    $('#error-wrap').append($elmt_p);
           };
          first_error = false;
		}
	});
}

function getImageProperty(id_property){
	try{
		registros = property_details[id_property];
		for (var i = 0; i < registros.length; i++) {
			var elemento = registros[i];

	 		if ( getTitle(elemento['key']) != "None" ) {
	 			if ( getTitle(elemento['key']) == "Imagen" ) {
	 				var array_images = getImageUrl(elemento['value']);
	 				return array_images[0];
	 			}
	 		};
		}
	}catch(err){
	    if (first_error) {
			  $elmt_p= $('<p id="msj-error">No ha sido posible obtener todas las imagenes. Verifique su conexión a internet y haga click en recargar.</p>');
			  $('#error-wrap').append($elmt_p);
	     };
	    first_error = false;
	}
}


$( "#infoinmueble" ).on( "pageshow", function( event, ui ) {
	// recolecta los valores que inserto el usuario

	archivoDetalleInmueble = url_base + url_detalle_inmueble;  	
	var e = properties[localStorage["id_inm"]];
	registros = property_details[localStorage["id_inm"]];
	var agency_id = property_agency[localStorage["id_inm"]];
	
	var agency_number = 1;
	agengy_registers = agency_details[agency_id];
	for (var i = 0; i < agengy_registers.length; i++) {
		var elemento = agengy_registers[i];
		if ( elemento['key'] == "_agency_phone" ) {
		 	agency_number =  elemento['value'];
		 }
	}

	$('#call').attr("href", "tel:"+agency_number);

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
 			else if( getTitle(elemento['key']) == "Agencia" ){
 				//agencia = agency_details[];
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
		case "_property_agencies":
		  title = "Agencia";
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
