
import { match, sep, nonsep, lex, commentize, TC, LC } from "../pcomb/lexer"

describe("lexer tests", () => {
    it('commentize', () => {
        let s = ` a//b /* a */
/* a */`
        let ta = lex(s)
        const ca = commentize(ta)
        expect(ca.length).toBe(4)
        expect(ca[2].type).toBe(TC.lineComment)
        expect(ca[2].loc).toEqual({ start: 2, end: 14, row: 0, col: 2 })
    })

    it(' should test lex', () => {
        let str = " a  /*"
        let ps = {pos: 0, row:0, col: 0}
        let r = lex(str)
        let types = r.map(e => e.type)
        expect(r.length).toBe(4)
        expect(types).toEqual(["ws", "word", "ws", LC.bcs])
    })

    it('nonsep', () => {
        let separators = [LC.bcs]
        let str = " a  /*"
        let ps = {pos: 0, row:0, col: 0}
        let tok = nonsep(ps, separators, str)
        expect(tok.type).toBe("ws")
        expect(tok.loc.end).toBe( 1)
        expect(tok.text).toBe(" ")
    
        tok = nonsep(ps, separators, str)
        expect(tok.type).toBe("word")
        expect(tok.loc.end).toBe(2)
        expect(tok.text).toBe("a")
    })

    it('match sep at pos', () => {
        let ps = {pos: 2, row:0, col: 2}
        let str = "01/*"
        let s = sep(ps, [LC.bcs], str)
        expect(s).not.toBe(null)
        if (s) {
            expect(s.type).toBe(LC.bcs)
            expect(ps).toMatchObject({pos:4, col:4})
        }
        
        ps.pos = 0
        s = sep(ps,[LC.bcs], str)
        expect(s).toBe(null)
    });
    
    it('matching alternates in string', () => {
        let mr = match(["ab", "x"], 2, "bax")
        expect(mr).toBe("x")
    });
    
    it('matching in string', () => {
        let mr = match("ab", 1, "bab")
        expect(mr).toBe("ab")
    });
})






