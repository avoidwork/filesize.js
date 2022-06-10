// This "test" is to validate the type inference, i.e. only to compile, but not to run.

import filesize from "../filesize";

//
// check functions for compilation time, no need to implement
//

function shouldBeString(x: string) {}
function shouldBeNumberUnitPair(x: [number, string]) {}
function shouldBeStringUnitPair(x: [string, string]) {}
function shouldBeNumber(x: number) {}

type FilesizeObject = {
    value: number,
    symbol: string,
    exponent: number,
    unit: string,
}
function shouldBeObject(x: FilesizeObject) {}

//
// single possibility (typical)
//

// direct call
shouldBeString(filesize(123));
shouldBeString(filesize(123, {}));
shouldBeString(filesize(123, { output: undefined }));
shouldBeString(filesize(123, { output: "string" }));
shouldBeNumberUnitPair(filesize(123, { output: "array" }));
shouldBeStringUnitPair(filesize(123, { precision: 2, output: "array" }));
shouldBeNumber(filesize(123, { output: "exponent" }));
shouldBeObject(filesize(123, { output: "object" }));

// partial
shouldBeString(filesize.partial({})(123))
shouldBeString(filesize.partial({ output: "string" })(123))
shouldBeNumberUnitPair(filesize.partial({ output: "array" })(123))
shouldBeNumber(filesize.partial({ output: "exponent" })(123))
shouldBeObject(filesize.partial({ output: "object" })(123))

//
// mutliple possibilities (tricky)
//

let opt1!: { output: "string" | "array" };
const result1 = filesize(123, opt1); // string | [number, string]
result1 as string
result1 as [number, string];

let opt2!: { output: "exponent" | "object" };
const result2 = filesize(123, opt2); // number | { ... }
result2 as number
result2 as FilesizeObject

// Note: strictNullChecks needs to be true to correctly handle this scenario.
// If false, the compiler cannot know the return type may be string.
let opt3!: { output?: "exponent" };
const result3 = filesize(123, opt3); // string | number
result3 as number
result3 as string
