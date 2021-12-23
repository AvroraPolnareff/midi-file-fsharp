module Tests

open Fable.Core
open Fable.Jester
open MidiFile
open Fetch

Jest.test("header parses properly", promise {
    let! file = fetch "./example2.mid" []
    JS.console.log(file)
    ()
})