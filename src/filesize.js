/**
 * filesize
 *
 * @method filesize
 * @param  {Mixed}   arg        String, Int or Float to transform
 * @param  {Object}  descriptor [Optional] Flags
 * @return {String}             Readable file size String
 */
function filesize ( arg, descriptor ) {
	var result = "",
	    skip   = false,
	    i      = 6,
	    base, bits, pos, neg, num, size, sizes, shrt, spacer, suffix, z;

	if ( isNaN( arg ) ) {
		throw new Error( "Invalid arguments" );
	}

	descriptor = descriptor || {};
	bits       = ( descriptor.bits     === true );
	shrt       = ( descriptor["short"] === true );
	base       = descriptor.base   !== undefined ? descriptor.base   : 10;
	pos        = descriptor.pos    !== undefined ? descriptor.pos    : shrt ? 0  : 2;
	spacer     = descriptor.spacer !== undefined ? descriptor.spacer : shrt ? "" : " ";
	num        = Number( arg );
	neg        = ( num < 0 );

	// Flipping a negative number to determine the size
	if ( neg ) {
		num = -num;
	}

	// Zero is now a special case because bytes divide by 1
	if ( num === 0 ) {
		if ( shrt ) {
			result = "0";
		}
		else {
			result = "0 B";
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
					skip = true;
					pos  = 0;
				}

				result = ( num / size ).toFixed( pos );

				if ( !skip && shrt ) {
					if ( bits && bit.test( suffix ) ) {
						suffix = suffix.toLowerCase();
					}

					suffix = suffix.charAt( 0 );
					z      = right.exec( result );

					if ( suffix === "k" ) {
						suffix = "K";
					}

					if ( z !== null && z[1] !== undefined && zero.test( z[1] ) ) {
						result = parseInt( result, radix );
					}
				}

				result += spacer + suffix;
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
