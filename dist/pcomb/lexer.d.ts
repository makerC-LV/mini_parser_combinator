interface ParseLoc {
    pos: number;
    row: number;
    col: number;
}
interface Location {
    start: number;
    end: number;
    row: number;
    col: number;
}
interface Token {
    type: string;
    loc: Location;
    text: string;
}
declare function lex(str: string, separators?: string[]): Token[];
declare function nonsep(ps: ParseLoc, separators: string[], str: string): {
    type: string;
    text: string;
    loc: Location;
};
declare function sep(ps: ParseLoc, separators: string[], str: string): Token | null;
declare function match(pat: string | string[], pos: number, str: string): string | null;
declare function commentize(ta: Token[]): Token[];
declare class TokenStream {
    stack: number[];
    index: number;
    ta: Token[];
    constructor(ta: Token[], collectComments?: boolean);
    next(): Token;
    push(): void;
    pop(): void;
    unstack(): void;
}
declare enum LC {
    lpar = "(",
    rpar = ")",
    lbrac = "[",
    rbrac = "]",
    eq = "=",
    eol = "\n",
    bcs = "/*",
    bce = "*/",
    lcs = "//",
    bar = "|",
    slash = "/"
}
declare enum TC {
    eof = "eof",
    ws = "ws",
    word = "word",
    blockComment = "comment:Block",
    lineComment = "comment:Line"
}
export { match, sep, nonsep, lex, commentize, Location, Token, TokenStream, LC, TC };
