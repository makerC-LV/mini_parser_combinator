
import { TC, LC, Token, TokenStream} from "./lexer"

interface ParseNode {
    rule: string
    children: Array<ParseNode|Token>
    value?: any  // For client code to add specific data
}

type PostProcFn = (o: ParseNode|null) => ParseNode|null;
class Rule {
    name: string
    matchFn: Function
    trace: boolean
    postProcess: PostProcFn | null
    constructor(name: string, matchFn: Function) {
        this.name = name
        this.matchFn = matchFn
        this.postProcess = null
        this.trace = false
    }

    match(ts: TokenStream): ParseNode|null {
        ts.push()
        !this.trace || console.log("--", this.name, "match")
        const r = this.matchFn(ts)
        if (r !== null) {
            ts.unstack()
            !this.trace || console.log("--", this.name, "success")
            return this.process({rule: this.name, children: r})
        } else {
            ts.pop()
            !this.trace || console.log("--", this.name, "fail")
            return null
        }
    }

    process(obj: ParseNode): ParseNode| null {
        if (this.postProcess !== null) {
            return this.postProcess(obj)
        }
        return obj
    }
}

// matches token based on token type
function typeFn(name: string, type: string|null): Rule  {
    return new Rule(name, (ts: TokenStream) => {
        const tok = ts.next()
        if (tok && (type === null || tok.type == type)) {
            return [tok]
        } else {
            return null
        }
    })
}

function anyType() {
    return typeFn("anyType", null)
}

function eof() {
    return typeFn("eof", TC.eof)
}

function eol() {
    return typeFn("eol", LC.eol)
}

function ws() {
    return typeFn("ws", TC.ws)
}

function word() {
    return typeFn(TC.word, TC.word)
}

function lineComment() {
    return typeFn(TC.lineComment, TC.lineComment)
}

function blockComment() {
    return typeFn(TC.blockComment, TC.blockComment)
}

// literal rule: matches token based on token string
function $(str: string, name: string|null =null) {
    if (!name) name = str
    return new Rule(str, (ts: TokenStream) => {
        const tok = ts.next()
        if (tok && tok.text == str) {
            return [tok]
        } else {
            return null
        }
    })
}
// Note: must match complete text
function re(reg: RegExp | string, name: string|null =null) {
    if (!name) name = "re"
    return new Rule(name, (ts: TokenStream) => {
        const tok = ts.next()
        if (tok) {
            const m = tok.text.match(reg)
            if (m) {
                return [{match: m, children: [tok]}]
            }
        } 
        return null
    })
}

function seq(rules: Rule[],  name: string|null =null) {
    if (!name) name = "seq"
    return new Rule(name,  (ts: TokenStream) => {
        ts.push()
        const ra = []
        for (const rule of rules) {
            const r = rule.match (ts)
            if (r !== null) {
                ra.push(r)
            } else {
                ts.pop()
                return null
            }
        }
        ts.unstack()
        return ra
    })
}

function opt(rule: Rule,  name: string|null =null) {
    if (!name) name = "opt"
    return new Rule(name,  (ts: TokenStream) => {
        const r = rule.match(ts)
        if (r !== null) {
            return [r]
        } else {
            return []
        }
    })
}


function alts(rules: Rule[],  name: string|null =null) {
    if (!name) name = "alts"
    return new Rule(name,  (ts: TokenStream) => {
        for (const rule of rules) {
            ts.push()
            const r = rule.match(ts)
            if (r !== null) {
                ts.unstack()
                return [r]
            } else {
                ts.pop()
            }
        }
        return null
    })
}

function star(rule: Rule,  name: string|null =null) { 
    if (!name) name = "star"
    return reps(rule, 0, name)
}

function plus(rule: Rule,  name: string|null =null) { 
    if (!name) name = "plus"
    return reps(rule, 1, name)
}

function reps(rule: Rule, minReps: number,  name: string|null =null) {
    if (!name) name = "reps"
    return new Rule(name,  (ts: TokenStream) => {
        ts.push()
        let count = 0
        let ra = []
        let r = rule.match(ts)
        while (r !== null) {
            ra.push(r)
            count++
            r = rule.match(ts)
        } 
        if (count >= minReps) {
            ts.unstack()
            return ra
        } else {
            ts.pop()
            return null
        }
    })
}

// fails without consuming input if notRule matches
// succeeds if notRule doesn't match and rule matches
function notAnd(notRule: Rule, rule: Rule,  name: string|null =null) {
    if (!name) name = "notAnd"
    return new Rule(name,  (ts: TokenStream) => {
        ts.push()
        const n = notRule.match(ts)
        if (n !== null) {  // notRule matched, so fail
            ts.unstack()
            return null
        }
        ts.pop()
        const r = rule.match(ts)
        if (r !== null) {
            return [r]
        } else {
            return null
        }
    })
}


export {  ParseNode, Rule, PostProcFn, $,  ws, word, re, seq, alts, star, plus, notAnd, opt, 
    eol, eof, lineComment, blockComment, anyType }