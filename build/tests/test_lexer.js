"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var lexer_js_1 = require("../pcomb/lexer.js");
(0, ava_1.default)('commentize', function (t) {
    var s = " a//b /* a */\n/* a */";
    var ta = (0, lexer_js_1.lex)(s);
    var ca = (0, lexer_js_1.commentize)(ta);
    t.is(ca.length, 4);
    t.is(ca[2].type, lexer_js_1.TC.lineComment);
    t.like(ca[2].loc, { start: 2, end: 14, row: 0, col: 2 });
});
(0, ava_1.default)('lex', function (t) {
    var str = " a  /*";
    var ps = { pos: 0, row: 0, col: 0 };
    var r = (0, lexer_js_1.lex)(str);
    var types = r.map(function (e) { return e.type; });
    t.is(r.length, 4);
    t.deepEqual(types, ["ws", "word", "ws", lexer_js_1.LC.bcs]);
});
(0, ava_1.default)('nonsep', function (t) {
    var separators = [lexer_js_1.LC.bcs];
    var str = " a  /*";
    var ps = { pos: 0, row: 0, col: 0 };
    var tok = (0, lexer_js_1.nonsep)(ps, separators, str);
    t.is(tok.type, "ws");
    t.is(tok.loc.end, 1);
    t.is(tok.text, " ");
    tok = (0, lexer_js_1.nonsep)(ps, separators, str);
    t.is(tok.type, "word");
    t.is(tok.loc.end, 2);
    t.is(tok.text, "a");
});
(0, ava_1.default)('match sep at pos', function (t) {
    var ps = { pos: 2, row: 0, col: 2 };
    var str = "01/*";
    var s = (0, lexer_js_1.sep)(ps, [lexer_js_1.LC.bcs], str);
    t.not(s, null);
    if (s) {
        t.is(s.type, lexer_js_1.LC.bcs);
        t.like(ps, { pos: 4, col: 4 });
    }
    ps.pos = 0;
    s = (0, lexer_js_1.sep)(ps, [lexer_js_1.LC.bcs], str);
    t.is(s, null);
});
(0, ava_1.default)('matching alternates in string', function (t) {
    var mr = (0, lexer_js_1.match)(["ab", "x"], 2, "bax");
    t.is(mr, "x");
});
(0, ava_1.default)('matching in string', function (t) {
    var mr = (0, lexer_js_1.match)("ab", 1, "bab");
    t.is(mr, "ab");
});
