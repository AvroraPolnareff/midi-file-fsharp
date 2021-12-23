
namespace MidiFile
open Fable.Core



// ////////////////////////////////////////////////////////
// THE EVENT TYPES
// ////////////////////////////////////////////////////////

type MidiEvent =
    abstract ``type``: string
    abstract DeltaTime: int
    abstract AbsoluteTime: int

type MidiChannelEvent =
    inherit MidiEvent
    abstract Channel: int

type MidiNoteEvent =
    inherit MidiChannelEvent
    abstract Velocity: int
    abstract NoteNumber: int
    abstract Running: bool option
    
type MidiControllerEvent =
    inherit MidiChannelEvent
    abstract ControllerType: int
    abstract Value: int

type MidiInstrumentEvent =
    inherit MidiChannelEvent
    abstract ProgramNumber: int
    
type MidiPitchBendEvent =
    inherit MidiChannelEvent
    abstract Value: int
    

// ////////////////////////////////////////////////////////
// META EVENTS
// ////////////////////////////////////////////////////////

type MidiMetaEvent =
    inherit MidiEvent
    abstract Meta: bool

type MidiTimeSignatureEvent =
    inherit MidiMetaEvent
    abstract Numerator: int
    abstract Denominator: int
    abstract Thirtyseconds: int
    abstract Metronome: int
    
type MidiTempoEvent =
    inherit MidiMetaEvent
    abstract MicrosecondsPerBeat: int
    
type MidiTrackNameEvent =
    inherit MidiMetaEvent
    abstract Text: string
    
type MidiEndOfTrackEvent =
    inherit MidiMetaEvent
    
type MidiCopyrightEvent =
    inherit MidiMetaEvent
    abstract Text: string
    
type MidiTextEvent =
    inherit MidiMetaEvent
    abstract Text: string
    
type MidiKeySignatureEvent =
    inherit MidiMetaEvent
    abstract Key: int
    abstract Scale: int
   
type private _MidiTrack = MidiEvent array
   
type Header =
    { format: int
      ticksPerBeat: int
      numTracks: int }

type private _MidiData =
    { header: Header
      tracks: _MidiTrack array }
    
module MidiFile =
    let (^) f n = f n
    [<Import("parseMidi", from="midi-file")>]
    let private _parseMidi(midiFile: JS.ArrayBuffer): _MidiData = jsNative 

    type Event =
        | MidiNoteOn of MidiNoteEvent
        | MidiNoteOff of MidiNoteEvent
        | MidiController of MidiControllerEvent
        | MidiInstrument of MidiInstrumentEvent
        | MidiPitchBend of MidiPitchBendEvent
        | MidiTimeSignature of MidiTimeSignatureEvent
        | MidiTempo of MidiTempoEvent
        | MidiTrackName of MidiTrackNameEvent
        | MidiEndOfTrack of MidiEndOfTrackEvent
        | MidiCopyright of MidiCopyrightEvent
        | MidiText of MidiTextEvent
        | MidiKeySignature of MidiKeySignatureEvent
        
    type MidiTrack = Event list
        
    type MidiData =
        { header: Header
          tracks: MidiTrack array }
          
    let parseMidi (midiFile: JS.ArrayBuffer): MidiData =
        let convertTrack (midiTrack: _MidiTrack) =
            midiTrack
            |> Array.map ^fun midiEvent ->
                match midiEvent.``type`` with
                | "noteOn" -> MidiNoteOn(midiEvent :?> MidiNoteEvent)
                | "noteOff" -> MidiNoteOff(midiEvent :?> MidiNoteEvent)
                | "controller" -> MidiController(midiEvent :?> MidiControllerEvent)
                | "programChange" -> MidiInstrument(midiEvent :?> MidiInstrumentEvent)
                | "pitchBend" -> MidiPitchBend(midiEvent :?> MidiPitchBendEvent)
                | "timeSignature" -> MidiTimeSignature(midiEvent :?> MidiTimeSignatureEvent)
                | "setTempo" -> MidiTempo(midiEvent :?> MidiTempoEvent)
                | "trackName" -> MidiTrackName(midiEvent :?> MidiTrackNameEvent)
                | "endOfTrack" -> MidiEndOfTrack(midiEvent :?> MidiEndOfTrackEvent)
                | "copyrightNotice" -> MidiCopyright(midiEvent :?> MidiCopyrightEvent)
                | "text" | "marker" | "lyrics" | "cuePoint" -> MidiText(midiEvent :?> MidiTextEvent)
                | "keySignature" -> MidiKeySignature(midiEvent :?> MidiKeySignatureEvent)
                | _ -> failwith "Unknown midi event type."
            |> Array.toList
            
        let parsedMidiJs = _parseMidi midiFile

        { header = parsedMidiJs.header
          tracks = Array.map convertTrack parsedMidiJs.tracks }