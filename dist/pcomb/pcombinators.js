(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./lexer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.anyType = exports.blockComment = exports.lineComment = exports.eof = exports.eol = exports.opt = exports.notAnd = exports.plus = exports.star = exports.alts = exports.seq = exports.re = exports.word = exports.ws = exports.$ = exports.Rule = exports.isToken = exports.isNode = exports.node = void 0;
    const lexer_1 = require("./lexer");
    function isToken(o) {
        return (!!o.token);
    }
    exports.isToken = isToken;
    function isNode(o) {
        return (!!o.node);
    }
    exports.isNode = isNode;
    function node(rule, children, value = null) {
        return { node: { rule: rule, children: children, value: value } };
    }
    exports.node = node;
    function token(t) {
        return { token: t };
    }
    class Rule {
        constructor(name, matchFn) {
            this.name = name;
            this.matchFn = matchFn;
            this.postProcess = null;
            this.trace = false;
        }
        match(ts) {
            ts.push();
            !this.trace || console.log("--", this.name, "match");
            const r = this.matchFn(ts);
            if (r !== null) {
                ts.unstack();
                !this.trace || console.log("--", this.name, "success");
                return this.process(node(this.name, r));
            }
            else {
                ts.pop();
                !this.trace || console.log("--", this.name, "fail");
                return null;
            }
        }
        process(obj) {
            if (this.postProcess !== null && obj != null) {
                return this.postProcess(obj);
            }
            return obj;
        }
    }
    exports.Rule = Rule;
    // matches token based on token type
    function typeFn(name, type) {
        return new Rule(name, (ts) => {
            const tok = ts.next();
            if (tok && (type === null || tok.type == type)) {
                return [token(tok)];
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
        return typeFn("eof", lexer_1.TC.eof);
    }
    exports.eof = eof;
    function eol() {
        return typeFn("eol", lexer_1.LC.eol);
    }
    exports.eol = eol;
    function ws() {
        return typeFn("ws", lexer_1.TC.ws);
    }
    exports.ws = ws;
    function word() {
        return typeFn(lexer_1.TC.word, lexer_1.TC.word);
    }
    exports.word = word;
    function lineComment() {
        return typeFn(lexer_1.TC.lineComment, lexer_1.TC.lineComment);
    }
    exports.lineComment = lineComment;
    function blockComment() {
        return typeFn(lexer_1.TC.blockComment, lexer_1.TC.blockComment);
    }
    exports.blockComment = blockComment;
    // literal rule: matches token based on token string
    function $(str, name = null) {
        if (!name)
            name = str;
        return new Rule(str, (ts) => {
            const tok = ts.next();
            if (tok && tok.text == str) {
                return [token(tok)];
            }
            else {
                return null;
            }
        });
    }
    exports.$ = $;
    // Note: must match complete text
    function re(reg, name = null) {
        if (name === null)
            name = "re";
        return new Rule(name, (ts) => {
            const tok = ts.next();
            if (tok) {
                const m = tok.text.match(reg);
                if (m) {
                    return [node(name, [token(tok)], m)];
                    // return [{match: m, children: [tok]}]
                }
            }
            return null;
        });
    }
    exports.re = re;
    function seq(rules, name = null) {
        if (!name)
            name = "seq";
        return new Rule(name, (ts) => {
            ts.push();
            const ra = [];
            for (const rule of rules) {
                const r = rule.match(ts);
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
    function opt(rule, name = null) {
        if (!name)
            name = "opt";
        return new Rule(name, (ts) => {
            const r = rule.match(ts);
            if (r !== null) {
                return [r];
            }
            else {
                return [];
            }
        });
    }
    exports.opt = opt;
    function alts(rules, name = null) {
        if (!name)
            name = "alts";
        return new Rule(name, (ts) => {
            for (const rule of rules) {
                ts.push();
                const r = rule.match(ts);
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
    function star(rule, name = null) {
        if (!name)
            name = "star";
        return reps(rule, 0, name);
    }
    exports.star = star;
    function plus(rule, name = null) {
        if (!name)
            name = "plus";
        return reps(rule, 1, name);
    }
    exports.plus = plus;
    function reps(rule, minReps, name = null) {
        if (!name)
            name = "reps";
        return new Rule(name, (ts) => {
            ts.push();
            let count = 0;
            let ra = [];
            let r = rule.match(ts);
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
    function notAnd(notRule, rule, name = null) {
        if (!name)
            name = "notAnd";
        return new Rule(name, (ts) => {
            ts.push();
            const n = notRule.match(ts);
            if (n !== null) { // notRule matched, so fail
                ts.unstack();
                return null;
            }
            ts.pop();
            const r = rule.match(ts);
            if (r !== null) {
                return [r];
            }
            else {
                return null;
            }
        });
    }
    exports.notAnd = notAnd;
});
