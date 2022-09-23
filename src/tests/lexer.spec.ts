
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
    });
})





// test('nonsep', t => {
//     let separators = [LC.bcs]
//     let str = " a  /*"
//     let ps = {pos: 0, row:0, col: 0}
// 	let tok = nonsep(ps, separators, str)
//     t.is(tok.type, "ws")
//     t.is(tok.loc.end, 1)
//     t.is(tok.text, " ")

//     tok = nonsep(ps, separators, str)
//     t.is(tok.type, "word")
//     t.is(tok.loc.end, 2)
//     t.is(tok.text, "a")

   

// });


// test('match sep at pos', t => {
//     let ps = {pos: 2, row:0, col: 2}
//     let str = "01/*"
// 	let s = sep(ps, [LC.bcs], str)
//     t.not(s, null)
//     if (s) {
//         t.is(s.type, LC.bcs)
//         t.like(ps, {pos:4, col:4})
//     }
    
//     ps.pos = 0
//     s = sep(ps,[LC.bcs], str)
//     t.is(s, null)
// });

// test('matching alternates in string', t => {
// 	let mr = match(["ab", "x"], 2, "bax")
//     t.is(mr, "x")
// });

// test('matching in string', t => {
// 	let mr = match("ab", 1, "bab")
//     t.is(mr, "ab")
// });