// import test from 'ava';
import {
    $, ws, eol, re, opt, seq, alts, star, plus, notAnd,
    lineComment, ParseNode
} from "../pcomb/pcombinators"

import { lex, Location, TokenStream, TC } from "../pcomb/lexer"

function testSuccess(r: ParseNode | null, name: string, childCount: number) {
    expect(r).not.toBe(null)
    if (r) {
        expect(r.rule).toBe(name)
        if (r.children) {
            expect(r.children.length).toBe(childCount)
            return
        }
    }
    fail()
}

describe("test combinator rules", () => {

    it('should test notAnd', () => {
        let ts = new TokenStream(lex("s"))
        let rule = notAnd($('a'), re(/./))
        let r = rule.match(ts)
        testSuccess(r, 'notAnd', 1)
        ts = new TokenStream(lex("a"))
        r = rule.match(ts)
        expect(r).toBe(null)

    })

    it('tests eol', () => {
        let ts = new TokenStream(lex("\n"))
        let rule = eol()
        let r = rule.match(ts)
        testSuccess(r, 'eol', 1)
        
    })

    it("lineComment", () => {
        let ts = new TokenStream(lex("//hello"), true)
        let r = lineComment().match(ts)
        testSuccess(r, TC.lineComment, 1)
        if (r && r.children) {
            const child = r.children[0]
            if (child.loc) {
                expect(child.loc).toMatchObject({ start: 0, end: 7, row: 0, col: 0 })
                return
            } 
        }
        fail()
    })

    it('plus', () => {
        let ts = new TokenStream(lex("b"))
        let rule = plus($("a"), "testPlus")
        let r = rule.match(ts)
        expect(r).toBe(null)
        ts = new TokenStream(lex("a"))
        r = rule.match(ts)
        testSuccess(r, 'testPlus', 1)
    })

    it('star', () => {
        let ts = new TokenStream(lex("b"))
        let r = star($("a"), "testStar").match(ts)
        testSuccess(r, 'testStar', 0)
        
    })

    it('any', () => {
        let ts = new TokenStream(lex("b"))
        let r = alts([$("a"), ws(), $("b")], 'testAny').match(ts)
        testSuccess(r, 'testAny', 1)
        
    })

    it('all', () => {
        let ts = new TokenStream(lex("a b"))
        let r = seq([$("a"), ws(), $("b")], "testAll").match(ts) // needs non-anonymous name
        testSuccess(r, 'testAll', 3)
    })

    it('opt', () => {
        let ts = new TokenStream(lex("bye"))
        let r = opt($("hello"), "testOpt").match(ts) // needs non-anonymous name
        testSuccess(r, 'testOpt', 0)

        ts = new TokenStream(lex("hello"))
        r = opt($("hello"), "testOpt").match(ts)
        testSuccess(r, 'testOpt', 1)
        if (r && r.children) {
            const sub = r.children[0]
            testSuccess(sub, 'hello', 1)
            if (sub && sub.children) {
                expect(sub.children[0]).toMatchObject({ rule: "word", text: "hello" })
                return
            }
        }
        fail()

    })

    it('literal', () => {
        let ts = new TokenStream(lex("hello"))
        let r = $("hello").match(ts)
        testSuccess(r, 'hello', 1)
        if (r && r.children) {
            expect(r.children[0]).toMatchObject({ rule: "word", text: "hello" })
            return
        }
        fail()
    })

})


