"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test('notAnd', t => {
//     let ts = new TokenStream(lex("s"))
//     let rule = notAnd($('a'), re(/./))
//     let r = rule.match(ts)
//     t.truthy(r)
//     ts = new TokenStream(lex("a"))
//     r = rule.match(ts)
//     t.is(r, null)
// })
// test('eol', t => {
//     let ts = new TokenStream(lex("\n"))
//     let rule = eol()
//     let r = rule.match(ts)
//     t.not(r, null)
//     !r || t.is(r.rule, 'eol')
// })
// test("lineComment", t => {
//     let ts = new TokenStream(lex("//hello"), true)
//     let r = lineComment().match(ts)
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, TC.lineComment)
//         t.like((r.children[0] as Token).loc, { start: 0, end: 7, row: 0, col: 0 })
//     }
// })
// test('plus', t => {
//     let ts = new TokenStream(lex("b"))
//     let rule = plus($("a"), "testPlus")
//     let r = rule.match(ts)
//     t.is(r, null)
//     ts = new TokenStream(lex("a"))
//     r = rule.match(ts)
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "testPlus")
//         t.is(r.children.length, 1)
//     }
// })
// test('star', t => {
//     let ts = new TokenStream(lex("b"))
//     let r = star($("a"), "testStar").match(ts)
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "testStar")
//         t.is(r.children.length, 0)
//     }
// })
// test('any', t => {
//     let ts = new TokenStream(lex("b"))
//     let r = alts([$("a"), ws(), $("b")], 'testAny').match(ts)
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "testAny")
//         t.is(r.children.length, 1)
//     }
// })
// test('all', t => {
//     let ts = new TokenStream(lex("a b"))
//     let r = seq([$("a"), ws(), $("b")], "testAll").match(ts) // needs non-anonymous name
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "testAll")
//         t.is(r.children.length, 3)
//     }
// })
// test('opt', t => {
//     let ts = new TokenStream(lex("bye"))
//     let r = opt($("hello"), "testOpt").match(ts) // needs non-anonymous name
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "testOpt")
//         t.deepEqual(r.children, [])
//     }
//     ts = new TokenStream(lex("hello"))
//     r = opt($("hello"), "testOpt").match(ts)
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "testOpt")
//         const sub = r.children[0] as ParseNode
//         t.not(sub, null)
//         if (sub) {
//             t.is(sub.rule, "hello")
//             t.like(sub.children[0], { type: "word", text: "hello" })
//         }
//     }
// })
// test('literal', t => {
//     let ts = new TokenStream(lex("hello"))
//     let r = $("hello").match(ts)
//     t.not(r, null)
//     if (r) {
//         t.is(r.rule, "hello")
//         t.like(r.children[0], { type: "word", text: "hello" })
//     }
// })
