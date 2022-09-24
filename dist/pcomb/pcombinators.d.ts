import { Token, TokenStream } from "./lexer";
interface ParseNode {
    rule: string;
    children: Array<ParseNode | Token>;
    value?: any;
}
declare type PostProcFn = (o: ParseNode | null) => ParseNode | null;
declare class Rule {
    name: string;
    matchFn: Function;
    trace: boolean;
    postProcess: PostProcFn | null;
    constructor(name: string, matchFn: Function);
    match(ts: TokenStream): ParseNode | null;
    process(obj: ParseNode): ParseNode | null;
}
declare function anyType(): Rule;
declare function eof(): Rule;
declare function eol(): Rule;
declare function ws(): Rule;
declare function word(): Rule;
declare function lineComment(): Rule;
declare function blockComment(): Rule;
declare function $(str: string, name?: string | null): Rule;
declare function re(reg: RegExp | string, name?: string | null): Rule;
declare function seq(rules: Rule[], name?: string | null): Rule;
declare function opt(rule: Rule, name?: string | null): Rule;
declare function alts(rules: Rule[], name?: string | null): Rule;
declare function star(rule: Rule, name?: string | null): Rule;
declare function plus(rule: Rule, name?: string | null): Rule;
declare function notAnd(notRule: Rule, rule: Rule, name?: string | null): Rule;
export { ParseNode, Rule, PostProcFn, $, ws, word, re, seq, alts, star, plus, notAnd, opt, eol, eof, lineComment, blockComment, anyType };
