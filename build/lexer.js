"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TC = exports.LC = exports.TokenStream = exports.commentize = exports.lex = exports.nonsep = exports.sep = exports.match = void 0;
// returns an array of tokens: each token is either a separator, a word (i.e. contiguous non-whitespace)
// or contiguous whitespace
function lex(str, separators) {
    if (separators === void 0) { separators = LSEP; }
    var ps = { pos: 0, row: 0, col: 0 };
    var t = [];
    while (ps.pos < str.length) {
        var s = sep(ps, separators, str);
        if (s) {
            t.push(s);
            continue;
        }
        var c = nonsep(ps, separators, str);
        t.push(c);
    }
    // const loc = intv(ps.pos, ps.pos, ps.row, ps.col)
    // t.push({type: TC.eof, loc: loc})
    return t;
}
exports.lex = lex;
// collect either whitespace or non-whitespace but no separators
function nonsep(ps, separators, str) {
    var is_ws = function (c) { return WS.includes(c); };
    if (is_ws(str[ps.pos])) {
        return collate(ps, separators, is_ws, str, "ws");
    }
    else {
        return collate(ps, separators, function (c) { return !is_ws(c); }, str, "word");
    }
}
exports.nonsep = nonsep;
// precondition: will collect at least one character
function collate(ps, separators, test, str, type) {
    var ms = "";
    var loc = intv(ps.pos, ps.pos, ps.row, ps.col);
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
    var loc = intv(ps.pos, ps.pos, ps.row, ps.col);
    var s = match(separators, ps.pos, str);
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
        for (var _i = 0, pat_1 = pat; _i < pat_1.length; _i++) {
            var p = pat_1[_i];
            var r = matchOne(p, pos, str);
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
    var p = pos;
    for (var _i = 0, pat_2 = pat; _i < pat_2.length; _i++) {
        var c = pat_2[_i];
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
function span() {
    var ia = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ia[_i] = arguments[_i];
    }
    if (!ia || ia.length == 0)
        throw new Error("Cannot span empty set of locations");
    var _a = [ia[0], ia[ia.length - 1]], f = _a[0], l = _a[1];
    return { start: f.start, end: l.end, row: f.row, col: f.col };
}
// Gathers c-style comments into single tokens.
function commentize(ta) {
    var r = [];
    var blockC = null;
    var lineC = null;
    for (var _i = 0, ta_1 = ta; _i < ta_1.length; _i++) {
        var t = ta_1[_i];
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
    var text = ca.map(function (o) { return o.text; }).join("");
    var locs = ca.map(function (e) { return e.loc; });
    return { type: type, text: text, loc: span.apply(void 0, locs) };
}
var TokenStream = /** @class */ (function () {
    function TokenStream(ta, collectComments) {
        if (collectComments === void 0) { collectComments = false; }
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
    TokenStream.prototype.next = function () {
        return this.ta[this.index++];
    };
    TokenStream.prototype.push = function () {
        this.stack.push(this.index);
    };
    TokenStream.prototype.pop = function () {
        var pval = this.stack.pop();
        if (pval)
            this.index = pval;
    };
    TokenStream.prototype.unstack = function () {
        this.stack.pop();
    };
    return TokenStream;
}());
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
var WS = " \t\r".split("");
var LSEP = __spreadArray([], Object.values(LC), true);
var TC;
(function (TC) {
    TC["eof"] = "eof";
    TC["ws"] = "ws";
    TC["word"] = "word";
    TC["blockComment"] = "comment:Block";
    TC["lineComment"] = "comment:Line";
})(TC || (TC = {}));
exports.TC = TC;
