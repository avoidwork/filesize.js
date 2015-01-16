/**
 * filesize.js dashboard
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @version 1.5.0
 */
(function ( keigai ) {
	"use strict";

	var util = keigai.util,
		$ = util.$,
		array = util.array,
		element = util.element,
		delay = util.delay,
		render = util.render,
		stop = util.stop,
		string = util.string,
		observer = util.observer,
		result = $( "#result" )[ 0 ],
		input = $( "#filesize" )[ 0 ],
		demo = $( "#demo" )[ 0 ],
		input_observable = observer(),
		form_observable = observer();

	/**
	 * Input handler
	 *
	 * @return {Undefined} undefined
	 */
	function handler () {
		var val = element.val( input );

		if ( val !== undefined && !string.isEmpty( val.toString() ) ) {
			try {
				element.html( result, filesize( val, { unix: element.data( input, "unix" ), bits: element.data( input, "bits" ) } ) );
			}
			catch ( e ) {
				element.html( result, e );
			}
		}
		else {
			element.html( result, "&nbsp;" );
		}
	}

	// Demo filters
	array.each( element.find( demo, ".clickable" ), function ( i ) {
		var observable = observer();

		observable.hook( i, "click" );
		observable.on( "click", function ( e ) {
			var param = element.data( i, "param" );

			stop( e );
			render( function () {
				element.toggleClass( i, "icon-check-empty" );
				element.toggleClass( i, "icon-check" );
				element.data( input, param, !element.data( input, param ) );
				handler();
			} );
		}, "click" );
	} );

	// Capturing debounced input (125ms)
	input_observable.hook( input, "input" );
	input_observable.on( "input", function ( e ) {
		stop( e );
		delay( function () {
			handler();
		}, 125, "keyUp" );
	}, "input" );

	// Setting copyright year
	element.text( $( "#year" )[ 0 ], new Date().getFullYear() );
})( keigai );
