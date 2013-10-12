[![build status](https://secure.travis-ci.org/avoidwork/filesize.js.png)](http://travis-ci.org/avoidwork/filesize.js)
# filesize.js

filesize.js provides a simple way to get a human readable file size string from a number (float or integer) or string.

## Optional settings

`filesize()` accepts an optional descriptor Object as a second argument, so you can customize the output.

#### bits
Enables `bit` sizes, default is `false`

#### unix
Enables unix style human readable output, e.g `ls -lh`, default is `false`

#### base
Number base, default is `10`

#### round
Decimal place, default is `2`

#### spacer
Character between the `result` and `suffix`, default is `" "`

## Examples

```javascript
filesize(500);                         // "500 B"
filesize(500, {bits: true});           // "4.00 kb"
filesize(265318);                      // "265.32 kB"
filesize(265318, {base: 2});           // "259.10 kB"
filesize(265318, {base: 2, round: 1}); // "259.1 kB"
```

## How can I load filesize.js?

filesize.js supports AMD loaders (require.js, curl.js, etc.), node.js & npm (npm install filesize), or using a script tag.

## Support

If you're having problems with using the project, use the support forum at CodersClan.

<a href="http://codersclan.net/forum/index.php?repo_id=11"><img src="http://www.codersclan.net/graphics/getSupport_blue_big.png" width="160"></a>

## License

filesize.js is licensed under BSD-3 https://raw.github.com/avoidwork/filesize.js/master/LICENSE

## Copyright

Copyright (c) 2013, Jason Mulligan <jason.mulligan@avoidwork.com>
