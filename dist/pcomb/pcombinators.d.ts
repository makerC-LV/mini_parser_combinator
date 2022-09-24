import { Token, TokenStream } from "./lexer";
interface ParseNode {
    rule: string;
    children: ParseNodeOrToken[];
    value?: any;
}
interface ParseNodeOrToken {
    node?: ParseNode;
    token?: Token;
}
declare function isToken(o: ParseNodeOrToken): boolean;
declare function isNode(o: ParseNodeOrToken): boolean;
declare function node(rule: string, children: ParseNodeOrToken[], value?: any): ParseNodeOrToken;
declare type PostProcFn = (o: ParseNodeOrToken) => ParseNodeOrToken;
declare type MatchFn = (ts: TokenStream) => ParseNodeOrToken[] | null;
declare class Rule {
    name: string;
    matchFn: MatchFn;
    trace: boolean;
    postProcess: PostProcFn | null;
    constructor(name: string, matchFn: MatchFn);
    match(ts: TokenStream): ParseNodeOrToken | null;
    process(obj: ParseNodeOrToken | null): ParseNodeOrToken | null;
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
export { ParseNode, ParseNodeOrToken, node, isNode, isToken, Rule, PostProcFn, MatchFn, $, ws, word, re, seq, alts, star, plus, notAnd, opt, eol, eof, lineComment, blockComment, anyType };
