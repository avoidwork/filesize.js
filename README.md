# filesize.js
filesize.js provides a simple way to get a human readable file size string from a number (float or integer) or another string.

An optional second parameter is the decimal place to round to.

## Sample
filesize(1500); // "1.46MB"
filesize("1500000000"); // "1.40TB"
filesize("1500000000", 0); // "1TB"

## Information
#### License
filesize.js is licensed under BSD-3 http://www.opensource.org/licenses/BSD-3-Clause

#### Copyright
Copyright (c) 2012, Jason Mulligan <jason.mulligan@avoidwork.com>