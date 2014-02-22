/**
 * filesize
 *
 * @method filesize
 * @param  {Mixed}   arg        String, Int or Float to transform
 * @param  {Object}  descriptor [Optional] Flags
 * @param  {Object}  options    [Optional] Overrides default size options
 * @return {String}             Readable file size String
 */
function filesize ( arg, descriptor, options ) {
	var result = "",
	    skip   = false,
	    i      = 6,
	    base, bits, neg, num, round, size, sizes, unix, spacer, suffix, z;

	if ( isNaN( arg ) ) {
		throw new Error( "Invalid arguments" );
	}

	descriptor = descriptor || {};
	bits       = ( descriptor.bits === true );
	unix       = ( descriptor.unix === true );
	base       = descriptor.base   !== undefined ? descriptor.base   : unix ? 2  : 10;
	round      = descriptor.round  !== undefined ? descriptor.round  : unix ? 1  : 2;
	spacer     = descriptor.spacer !== undefined ? descriptor.spacer : unix ? "" : " ";
	num        = Number( arg );
	neg        = ( num < 0 );

	// Flipping a negative number to determine the size
	if ( neg ) {
		num = -num;
	}

  options = options || defaultOptions;

	// Zero is now a special case because bytes divide by 1
	if ( num === 0 ) {
		if ( unix ) {
			result = "0";
		}
		else {
			result = "0" + spacer + "B";
		}
	}
	else {
		sizes = options[base][bits ? "bits" : "bytes"];

		while ( i-- ) {
			size   = sizes[i][1];
			suffix = sizes[i][0];

			if ( num >= size ) {
				// Treating bytes as cardinal
				if ( bite.test( suffix ) ) {
					skip  = true;
					round = 0;
				}

				result = ( num / size ).toFixed( round );

				if ( !skip && unix ) {
					if ( bits && bit.test( suffix ) ) {
						suffix = suffix.toLowerCase();
					}

					suffix = suffix.charAt( 0 );
					z      = right.exec( result );

					if ( !bits && suffix === "k" ) {
						suffix = "K";
					}

					if ( z !== null && z[1] !== undefined && zero.test( z[1] ) ) {
						result = parseInt( result, radix );
					}

					result += spacer + suffix;
				}
				else if ( !unix ) {
					result += spacer + suffix;
				}

				break;
			}
		}
	}

	// Decorating a 'diff'
	if ( neg ) {
		result = "-" + result;
	}

	return result;
}
