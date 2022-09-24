(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./pcomb/lexer", "./pcomb/pcombinators"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.anyType = exports.blockComment = exports.lineComment = exports.eof = exports.eol = exports.opt = exports.notAnd = exports.plus = exports.star = exports.alts = exports.seq = exports.re = exports.word = exports.ws = exports.$ = exports.Rule = exports.isToken = exports.isNode = exports.node = exports.TC = exports.LC = exports.TokenStream = exports.commentize = exports.lex = exports.nonsep = exports.sep = exports.match = void 0;
    var lexer_1 = require("./pcomb/lexer");
    Object.defineProperty(exports, "match", { enumerable: true, get: function () { return lexer_1.match; } });
    Object.defineProperty(exports, "sep", { enumerable: true, get: function () { return lexer_1.sep; } });
    Object.defineProperty(exports, "nonsep", { enumerable: true, get: function () { return lexer_1.nonsep; } });
    Object.defineProperty(exports, "lex", { enumerable: true, get: function () { return lexer_1.lex; } });
    Object.defineProperty(exports, "commentize", { enumerable: true, get: function () { return lexer_1.commentize; } });
    Object.defineProperty(exports, "TokenStream", { enumerable: true, get: function () { return lexer_1.TokenStream; } });
    Object.defineProperty(exports, "LC", { enumerable: true, get: function () { return lexer_1.LC; } });
    Object.defineProperty(exports, "TC", { enumerable: true, get: function () { return lexer_1.TC; } });
    var pcombinators_1 = require("./pcomb/pcombinators");
    Object.defineProperty(exports, "node", { enumerable: true, get: function () { return pcombinators_1.node; } });
    Object.defineProperty(exports, "isNode", { enumerable: true, get: function () { return pcombinators_1.isNode; } });
    Object.defineProperty(exports, "isToken", { enumerable: true, get: function () { return pcombinators_1.isToken; } });
    Object.defineProperty(exports, "Rule", { enumerable: true, get: function () { return pcombinators_1.Rule; } });
    Object.defineProperty(exports, "$", { enumerable: true, get: function () { return pcombinators_1.$; } });
    Object.defineProperty(exports, "ws", { enumerable: true, get: function () { return pcombinators_1.ws; } });
    Object.defineProperty(exports, "word", { enumerable: true, get: function () { return pcombinators_1.word; } });
    Object.defineProperty(exports, "re", { enumerable: true, get: function () { return pcombinators_1.re; } });
    Object.defineProperty(exports, "seq", { enumerable: true, get: function () { return pcombinators_1.seq; } });
    Object.defineProperty(exports, "alts", { enumerable: true, get: function () { return pcombinators_1.alts; } });
    Object.defineProperty(exports, "star", { enumerable: true, get: function () { return pcombinators_1.star; } });
    Object.defineProperty(exports, "plus", { enumerable: true, get: function () { return pcombinators_1.plus; } });
    Object.defineProperty(exports, "notAnd", { enumerable: true, get: function () { return pcombinators_1.notAnd; } });
    Object.defineProperty(exports, "opt", { enumerable: true, get: function () { return pcombinators_1.opt; } });
    Object.defineProperty(exports, "eol", { enumerable: true, get: function () { return pcombinators_1.eol; } });
    Object.defineProperty(exports, "eof", { enumerable: true, get: function () { return pcombinators_1.eof; } });
    Object.defineProperty(exports, "lineComment", { enumerable: true, get: function () { return pcombinators_1.lineComment; } });
    Object.defineProperty(exports, "blockComment", { enumerable: true, get: function () { return pcombinators_1.blockComment; } });
    Object.defineProperty(exports, "anyType", { enumerable: true, get: function () { return pcombinators_1.anyType; } });
});
