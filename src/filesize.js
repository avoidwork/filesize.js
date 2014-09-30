/**
 * filesize
 *
 * @method filesize
 * @param  {Mixed}   arg        String, Int or Float to transform
 * @param  {Object}  descriptor [Optional] Flags
 * @return {String}             Readable file size String
 */
function filesize ( arg, descriptor ) {
	var result = "0",
	    e, base, bits, ceil, neg, num, round, unix, spacer, suffix, z, suffixes, output;

	if ( isNaN( arg ) ) {
		throw new Error( "Invalid arguments" );
	}

	descriptor = descriptor || {};
	bits       = ( descriptor.bits === true );
	unix       = ( descriptor.unix === true );
	base       = descriptor.base     !== undefined ? descriptor.base     : unix ? 2  : 10;
	round      = descriptor.round    !== undefined ? descriptor.round    : unix ? 1  : 2;
	spacer     = descriptor.spacer   !== undefined ? descriptor.spacer   : unix ? "" : " ";
	suffixes   = descriptor.suffixes !== undefined ? descriptor.suffixes : {};
	output     = descriptor.output   !== undefined ? descriptor.output   : String;
	num        = Number( arg );
	neg        = ( num < 0 );
	ceil       = base > 2 ? 1000 : 1024;

	// Flipping a negative number to determine the size
	if ( neg ) {
		num = -num;
	}

	// Zero is now a special case because bytes divide by 1
	if ( num === 0 ) {
		suffix = "B";
	}
	else {
		e = Math.floor( Math.log( num ) / Math.log( 1000 ) );

		// Exceeding supported length, time to reduce & multiply
		if ( e > 8 ) {
			result = result * ( 1000 * ( e - 8 ) );
			e      = 8;
		}

		if ( base === 2 ) {
			result = num / Math.pow( 2, ( e * 10 ) );
		}
		else {
			result = num / Math.pow( 1000, e );
		}

		if ( bits ) {
			result = ( result * 8 );

			if ( result > ceil ) {
				result = result / ceil;
				e++;
			}
		}

		result = result.toFixed( e > 0 ? round : 0 );
		suffix = si[bits ? "bits" : "bytes"][e];

		if ( unix ) {
			if ( bits && bit.test( suffix ) ) {
				suffix = suffix.toLowerCase();
			}

			suffix = suffix.charAt( 0 );
			z      = result.replace( left, "" );

			if ( suffix === "B" ) {
				suffix = "";
			}
			else if ( !bits && suffix === "k" ) {
				suffix = "K";
			}

			if ( zero.test( z ) ) {
				result = parseInt( result, radix );
			}
		}
		
		// Decorating a 'diff'
		if ( neg ) {
			result = "-" + result;
		}
	}
	
	if ( output == Object ) {
		result = {
			value: result,
			suffix: suffixes[suffix] || suffix
		};
	}
	else if ( num !== 0 || !unix ) {
		result += spacer + ( suffixes[suffix] || suffix );
	}

	return result;
}
