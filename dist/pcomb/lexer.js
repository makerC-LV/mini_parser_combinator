(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TC = exports.LC = exports.TokenStream = exports.commentize = exports.lex = exports.nonsep = exports.sep = exports.match = void 0;
    // returns an array of tokens: each token is either a separator, a word (i.e. contiguous non-whitespace)
    // or contiguous whitespace
    function lex(str, separators = LSEP) {
        const ps = { pos: 0, row: 0, col: 0 };
        const t = [];
        while (ps.pos < str.length) {
            let s = sep(ps, separators, str);
            if (s) {
                t.push(s);
                continue;
            }
            let c = nonsep(ps, separators, str);
            t.push(c);
        }
        // const loc = intv(ps.pos, ps.pos, ps.row, ps.col)
        // t.push({type: TC.eof, loc: loc})
        return t;
    }
    exports.lex = lex;
    // collect either whitespace or non-whitespace but no separators
    function nonsep(ps, separators, str) {
        const is_ws = (c) => { return WS.includes(c); };
        if (is_ws(str[ps.pos])) {
            return collate(ps, separators, is_ws, str, "ws");
        }
        else {
            return collate(ps, separators, (c) => { return !is_ws(c); }, str, "word");
        }
    }
    exports.nonsep = nonsep;
    // precondition: will collect at least one character
    function collate(ps, separators, test, str, type) {
        let ms = "";
        const loc = intv(ps.pos, ps.pos, ps.row, ps.col);
        while (ps.pos < str.length && !match(separators, ps.pos, str) && test(str[ps.pos])) {
            ms += str[ps.pos];
            ps.pos++;
            ps.col++;
        }
        loc.end = ps.pos;
        return { type: type, text: ms, loc: loc };
    }
    // matches a separator at the current position
    function sep(ps, separators, str) {
        const loc = intv(ps.pos, ps.pos, ps.row, ps.col);
        let s = match(separators, ps.pos, str);
        if (s) {
            ps.pos = loc.start + s.length;
            ps.col += s.length;
            if (s == LC.eol) {
                ps.col = 0;
                ps.row++;
            }
            loc.end = ps.pos;
            return { type: s, text: s, loc: loc };
        }
        return null;
    }
    exports.sep = sep;
    // pat can be an array of patterns or a single pattern
    function match(pat, pos, str) {
        if (Array.isArray(pat)) {
            for (const p of pat) {
                const r = matchOne(p, pos, str);
                if (r) {
                    return r;
                }
            }
            return null;
        }
        else {
            return matchOne(pat, pos, str);
        }
    }
    exports.match = match;
    // if matches, return [last
    function matchOne(pat, pos, str) {
        let p = pos;
        for (const c of pat) {
            if (p >= str.length || str[p] != c)
                return null;
            p++;
        }
        return pat;
    }
    // Interval
    function intv(start, end, row, col) {
        return { start: start, end: end, row: row, col: col };
    }
    // span intervals
    function span(...ia) {
        if (!ia || ia.length == 0)
            throw new Error("Cannot span empty set of locations");
        const [f, l] = [ia[0], ia[ia.length - 1]];
        return { start: f.start, end: l.end, row: f.row, col: f.col };
    }
    // Gathers c-style comments into single tokens.
    function commentize(ta) {
        const r = [];
        let blockC = null;
        let lineC = null;
        for (const t of ta) {
            if (lineC) {
                if (t.type == LC.eol) {
                    lineC.push(t);
                    r.push(spanComment(lineC, TC.lineComment));
                    // const text = lineC.map(o => o.text).join("")
                    // r.push({type: TC.lineComment, text: text, loc: span(...lineC.map(e => { return e.loc}))})
                    lineC = null;
                }
                else {
                    lineC.push(t);
                }
            }
            else if (blockC) {
                if (t.type == LC.bce) {
                    blockC.push(t);
                    r.push(spanComment(blockC, TC.blockComment));
                    // const text = blockC.map(o => o.text).join("")
                    // r.push({type: TC.blockComment, text: text, loc: span(...blockC.map(e => { return e.loc}))})
                    blockC = null;
                }
                else {
                    blockC.push(t);
                }
            }
            else {
                if (t.type == LC.bcs) {
                    blockC = [t];
                }
                else if (t.type == LC.lcs) {
                    lineC = [t];
                }
                else {
                    r.push(t);
                }
            }
        }
        if (blockC) {
            // This is slightly inaccurate, an incomplete block comment is treated as a block comment
            r.push(spanComment(blockC, TC.blockComment));
        }
        else if (lineC) {
            r.push(spanComment(lineC, TC.lineComment));
        }
        return r;
    }
    exports.commentize = commentize;
    function spanComment(ca, type) {
        const text = ca.map(o => o.text).join("");
        const locs = ca.map(e => { return e.loc; });
        return { type: type, text: text, loc: span(...locs) };
    }
    class TokenStream {
        constructor(ta, collectComments = false) {
            this.stack = [];
            this.index = 0;
            this.ta = [];
            if (collectComments) {
                this.ta = commentize(ta);
            }
            else {
                this.ta = ta;
            }
        }
        next() {
            return this.ta[this.index++];
        }
        push() {
            this.stack.push(this.index);
        }
        pop() {
            const pval = this.stack.pop();
            if (pval !== undefined) {
                this.index = pval;
            }
        }
        unstack() {
            this.stack.pop();
        }
    }
    exports.TokenStream = TokenStream;
    // Lexer constants
    var LC;
    (function (LC) {
        LC["lpar"] = "(";
        LC["rpar"] = ")";
        LC["lbrac"] = "[";
        LC["rbrac"] = "]";
        LC["eq"] = "=";
        LC["eol"] = "\n";
        LC["bcs"] = "/*";
        LC["bce"] = "*/";
        LC["lcs"] = "//";
        LC["bar"] = "|";
        LC["slash"] = "/";
    })(LC || (LC = {}));
    exports.LC = LC;
    const WS = " \t\r".split("");
    const LSEP = [...Object.values(LC)];
    var TC;
    (function (TC) {
        TC["eof"] = "eof";
        TC["ws"] = "ws";
        TC["word"] = "word";
        TC["blockComment"] = "comment:Block";
        TC["lineComment"] = "comment:Line";
    })(TC || (TC = {}));
    exports.TC = TC;
});
