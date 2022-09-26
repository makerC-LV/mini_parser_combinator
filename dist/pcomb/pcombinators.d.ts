import { Location, TokenStream } from "./lexer";
interface ParseNode {
    rule: string;
    children: ParseNode[];
    text: string | null;
    loc: Location | null;
    value: any;
}
declare function node(rule: string, children: ParseNode[]): ParseNode;
declare type PostProcFn = (o: ParseNode) => ParseNode;
declare type MatchFn = (ts: TokenStream) => ParseNode | ParseNode[] | null;
declare class Rule {
    name: string;
    matchFn: MatchFn;
    trace: boolean;
    postProcess: PostProcFn | null;
    constructor(name: string, matchFn: MatchFn);
    match(ts: TokenStream): ParseNode | null;
    process(obj: ParseNode | null): ParseNode | null;
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
declare type TRGen = () => Rule;
declare function seq(rules: (Rule | TRGen)[], name?: string | null): Rule;
declare function opt(rule: Rule, name?: string | null): Rule;
declare function alts(rules: (Rule | TRGen)[], name?: string | null): Rule;
declare function star(rule: Rule, name?: string | null): Rule;
declare function plus(rule: Rule, name?: string | null): Rule;
declare function notAnd(notRule: Rule, rule: Rule, name?: string | null): Rule;
export { ParseNode, node, Rule, PostProcFn, MatchFn, $, ws, word, re, seq, alts, star, plus, notAnd, opt, eol, eof, lineComment, blockComment, anyType };
