

interface ParseLoc {
    pos: number,
    row: number,
    col: number
}

interface Location {
    start: number
    end: number
    row: number
    col: number
}

interface Token {
    type: string;
    loc: Location
    text: string;

}

// returns an array of tokens: each token is either a separator, a word (i.e. contiguous non-whitespace)
// or contiguous whitespace
function lex(str: string, separators = LSEP): Token[] {
    const ps : ParseLoc = {pos: 0, row: 0, col: 0}
    const t = []
    while (ps.pos < str.length) {
        let s = sep(ps, separators, str)
        if (s) { t.push(s); continue }
        let c = nonsep(ps, separators, str)
        t.push(c)
    }
    // const loc = intv(ps.pos, ps.pos, ps.row, ps.col)
    // t.push({type: TC.eof, loc: loc})
    return t
}

// collect either whitespace or non-whitespace but no separators
function nonsep(ps: ParseLoc, separators: string[], str: string) {
    const is_ws = (c: string) => { return WS.includes(c)}
    if (is_ws(str[ps.pos])) {
        return collate(ps, separators, is_ws, str, "ws")
    } else {
        return collate(ps, separators, (c: string) => { return !is_ws(c)}, str, "word")
    }
}

// precondition: will collect at least one character
function collate(ps: ParseLoc, separators: string[], test: Function, str: string, type: string) {
    let ms = ""
    const loc = intv(ps.pos, ps.pos, ps.row, ps.col)
    while (ps.pos < str.length && !match(separators, ps.pos, str) && test(str[ps.pos])) {
        ms += str[ps.pos]
        ps.pos++
        ps.col++
    }
    loc.end = ps.pos
    return {type: type, text: ms, loc: loc}
}

// matches a separator at the current position
function sep(ps: ParseLoc, separators: string[], str: string) : Token | null {
    const loc = intv(ps.pos, ps.pos, ps.row, ps.col)
    let s = match(separators, ps.pos, str)
    if (s) {
        ps.pos = loc.start + s.length
        ps.col += s.length
        if (s == LC.eol) {
            ps.col = 0
            ps.row++
        }
        loc.end = ps.pos
        return {type: s, text: s, loc: loc}
    }
    return null
}

// pat can be an array of patterns or a single pattern
function match(pat: string | string[], pos: number, str: string) : string | null {
    if (Array.isArray(pat)) {
        for (const p of pat) {
            const r = matchOne(p, pos, str)
            if (r) {
                return r
            }
        }
        return null
    } else {
        return matchOne(pat, pos, str)
    }
}

// if matches, return [last
function matchOne(pat: string, pos: number, str: string): string | null {
    let p = pos
    for (const c of pat) {
        if (p >= str.length || str[p] != c) return null
        p++
    }
    return pat
}

// Interval
function intv(start: number, end: number, row: number, col: number): Location {
    return { start: start, end: end, row: row, col: col }
}

// span intervals
function span(...ia: Location[]): Location {
    if (!ia || ia.length == 0) throw new Error("Cannot span empty set of locations")
    const [f, l] = [ia[0], ia[ia.length - 1]]
    return { start: f.start, end: l.end, row: f.row, col: f.col }
}

// Gathers c-style comments into single tokens.
function commentize(ta: Token[]): Token[] {
    const r: Token[] = []
    let blockC = null
    let lineC = null
    for (const t of ta) {
        if (lineC) {
            if (t.type == LC.eol) {
                lineC.push(t)
                r.push(spanComment(lineC, TC.lineComment))
                // const text = lineC.map(o => o.text).join("")
                // r.push({type: TC.lineComment, text: text, loc: span(...lineC.map(e => { return e.loc}))})
                lineC = null
            } else {
                lineC.push(t)
            }
        } else if (blockC) {
            if (t.type == LC.bce) {
                blockC.push(t)
                r.push(spanComment(blockC, TC.blockComment))
                // const text = blockC.map(o => o.text).join("")
                // r.push({type: TC.blockComment, text: text, loc: span(...blockC.map(e => { return e.loc}))})
                blockC = null
            } else {
                blockC.push(t)
            }
        } else {
            if (t.type == LC.bcs) {
                blockC = [t]
            } else if (t.type == LC.lcs) {
                lineC = [t]
            } else {
                r.push(t)
            }

        }
    }
    if (blockC) {
        // This is slightly inaccurate, an incomplete block comment is treated as a block comment
        r.push(spanComment(blockC, TC.blockComment))
    } else if (lineC) {
        r.push(spanComment(lineC, TC.lineComment))
    }
    return r
    
}

function spanComment(ca: Token[], type: LC | TC): Token {
    const text: string = ca.map(o => o.text).join("")
    const locs: Array<Location> = ca.map(e => {return e.loc})
    return {type: type, text: text, loc: span(...locs)}
}



class TokenStream {
    stack: number[] = []
    index = 0
    ta: Token[] = []
    constructor(ta: Token[], collectComments = false) {
        if (collectComments) {
            this.ta = commentize(ta)
        } else {
            this.ta = ta
        }
    }
    next() {
        return this.ta[this.index++]
    }
    push() {
        this.stack.push(this.index)
    }
    pop() {
        const pval = this.stack.pop()
        if (pval !== undefined) {
            this.index = pval
        }

    }
    
    unstack() {   // doesn't change index
        this.stack.pop()
    }
}

// Lexer constants
enum LC  {
    lpar = '(',
    rpar = ')',
    lbrac = '[',
    rbrac = ']',
    eq = '=',
    eol = '\n',
    bcs = '/*',  // block comment start
    bce = '*/',
    lcs = '//',   // line comment start
    bar = '|',
    slash = '/'
}
const WS: string[] = " \t\r".split("")
const LSEP: string[] = [...Object.values(LC)]

enum TC {    //Token types
    eof = "eof",
    ws = 'ws',
    word = 'word',
    blockComment = 'comment:Block',
    lineComment = 'comment:Line',

}

export { match, sep, nonsep, lex, commentize, Location, Token, TokenStream, LC, TC }

