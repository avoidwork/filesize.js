# filesize.js
filesize.js provides a simple way to get a human readable file size string from a number (float or integer) or another string. An optional second parameter is the decimal place to round to. The maximum supported size is a terabyte. When hard drives get bigger, I'll add support for petabytes.

## Examples
``` js
filesize(1500);                   // "1.46KB"
filesize("1500000000");           // "1.40GB"
filesize("1500000000", 0);        // "1GB"
filesize(1212312421412412);       // "1102.59TB"
filesize(1212312421412412, true); // "1102.6T" - shorthand output, similar to *nix "ls -lh"
```

## Information
#### License
filesize.js is licensed under BSD-3 http://www.opensource.org/licenses/BSD-3-Clause

#### Copyright
Copyright (c) 2012, Jason Mulligan <jason.mulligan@avoidwork.com>