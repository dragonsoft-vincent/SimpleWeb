$(document).ready(function() {
    $('#example').dataTable( {
    	"info": false,
    	"searching": false,
        "serverSide": true,
        "scrollY": "200px",
        "dom": "rtiS",
        "deferRender": true,
        "scroller": {
            "loadingIndicator": true
        },
        "ajax": {
        	"url": "/datatables/getData",
        	"type": "POST"
        }
    } ).fnMultipleRowspan(0, 1);
} );