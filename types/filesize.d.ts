export interface FileSizeOptions {
    bits?: boolean;
    pad?: boolean;
    base?: number;
    round?: number;
    locale?: string;
    localeOptions?: {};
    separator?: string;
    spacer?: string;
    symbols?: {};
    standard?: 'iec' | 'jedec';
    output?: 'array' | 'exponent' | 'object' | 'string';
    fullform?: boolean;
    fullforms?: any[];
    exponent?: number;
    roundingMethod?: 'round' | 'floor' | 'ceil';
    precision?: number;
}

export function filesize(arg: any, { bits, pad, base, round, locale, localeOptions, separator, spacer, symbols, standard, output, fullform, fullforms, exponent, roundingMethod, precision }?: FileSizeOptions): string | number | any[] | {
    value: any;
    symbol: any;
    exponent: number;
    unit: string;
};

export function partial({ bits, pad, base, round, locale, localeOptions, separator, spacer, symbols, standard, output, fullform, fullforms, exponent, roundingMethod, precision }?: FileSizeOptions): (arg: any) => string | number | any[] | {
    value: any;
    symbol: any;
    exponent: number;
    unit: string;
};
