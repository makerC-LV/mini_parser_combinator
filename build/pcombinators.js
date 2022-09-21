"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.anyType = exports.blockComment = exports.lineComment = exports.eof = exports.eol = exports.opt = exports.notAnd = exports.plus = exports.star = exports.alts = exports.seq = exports.re = exports.word = exports.ws = exports.$ = void 0;
var lexer_js_1 = require("./lexer.js");
var Rule = /** @class */ (function () {
    function Rule(name, matchFn) {
        this.postProcess = null;
        this.name = name;
        this.matchFn = matchFn;
        this.trace = false;
    }
    Rule.prototype.match = function (ts) {
        ts.push();
        !this.trace || console.log("--", this.name, "match");
        var r = this.matchFn(ts);
        if (r !== null) {
            ts.unstack();
            !this.trace || console.log("--", this.name, "success");
            return this.process({ rule: this.name, children: r });
        }
        else {
            ts.pop();
            !this.trace || console.log("--", this.name, "fail");
            return null;
        }
    };
    Rule.prototype.process = function (obj) {
        if (this.postProcess) {
            return this.postProcess(obj);
        }
        return obj;
    };
    return Rule;
}());
// matches token based on token type
function typeFn(name, type) {
    return new Rule(name, function (ts) {
        var tok = ts.next();
        if (tok && (type === null || tok.type == type)) {
            return [tok];
        }
        else {
            return null;
        }
    });
}
function anyType() {
    return typeFn("anyType", null);
}
exports.anyType = anyType;
function eof() {
    return typeFn("eof", lexer_js_1.TC.eof);
}
exports.eof = eof;
function eol() {
    return typeFn("eol", lexer_js_1.LC.eol);
}
exports.eol = eol;
function ws() {
    return typeFn("ws", lexer_js_1.TC.ws);
}
exports.ws = ws;
function word() {
    return typeFn(lexer_js_1.TC.word, lexer_js_1.TC.word);
}
exports.word = word;
function lineComment() {
    return typeFn(lexer_js_1.TC.lineComment, lexer_js_1.TC.lineComment);
}
exports.lineComment = lineComment;
function blockComment() {
    return typeFn(lexer_js_1.TC.blockComment, lexer_js_1.TC.blockComment);
}
exports.blockComment = blockComment;
// literal rule: matches token based on token string
function $(str, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = str;
    return new Rule(str, function (ts) {
        var tok = ts.next();
        if (tok && tok.text == str) {
            return [tok];
        }
        else {
            return null;
        }
    });
}
exports.$ = $;
// Note: must match complete text
function re(reg, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "re";
    return new Rule(name, function (ts) {
        var tok = ts.next();
        if (tok) {
            var m = tok.text.match(reg);
            if (m) {
                return [{ match: m, children: [tok] }];
            }
        }
        return null;
    });
}
exports.re = re;
function seq(rules, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "seq";
    return new Rule(name, function (ts) {
        ts.push();
        var ra = [];
        for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
            var rule = rules_1[_i];
            var r = rule.match(ts);
            if (r !== null) {
                ra.push(r);
            }
            else {
                ts.pop();
                return null;
            }
        }
        ts.unstack();
        return ra;
    });
}
exports.seq = seq;
function opt(rule, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "opt";
    return new Rule(name, function (ts) {
        var r = rule.match(ts);
        if (r !== null) {
            return [r];
        }
        else {
            return [];
        }
    });
}
exports.opt = opt;
function alts(rules, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "alts";
    return new Rule(name, function (ts) {
        for (var _i = 0, rules_2 = rules; _i < rules_2.length; _i++) {
            var rule = rules_2[_i];
            ts.push();
            var r = rule.match(ts);
            if (r !== null) {
                ts.unstack();
                return [r];
            }
            else {
                ts.pop();
            }
        }
        return null;
    });
}
exports.alts = alts;
function star(rule, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "star";
    return reps(rule, 0, name);
}
exports.star = star;
function plus(rule, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "plus";
    return reps(rule, 1, name);
}
exports.plus = plus;
function reps(rule, minReps, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "reps";
    return new Rule(name, function (ts) {
        ts.push();
        var count = 0;
        var ra = [];
        var r = rule.match(ts);
        while (r !== null) {
            ra.push(r);
            count++;
            r = rule.match(ts);
        }
        if (count >= minReps) {
            ts.unstack();
            return ra;
        }
        else {
            ts.pop();
            return null;
        }
    });
}
// fails without consuming input if notRule matches
// succeeds if notRule doesn't match and rule matches
function notAnd(notRule, rule, name) {
    if (name === void 0) { name = null; }
    if (!name)
        name = "notAnd";
    return new Rule(name, function (ts) {
        ts.push();
        var n = notRule.match(ts);
        if (n !== null) { // notRule matched, so fail
            ts.unstack();
            return null;
        }
        ts.pop();
        var r = rule.match(ts);
        if (r !== null) {
            return [r];
        }
        else {
            return null;
        }
    });
}
exports.notAnd = notAnd;
