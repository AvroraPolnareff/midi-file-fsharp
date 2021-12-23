import { Union, Record } from "../tests/fable_modules/fable-library.3.4.7/Types.js";
import { list_type, union_type, array_type, class_type, record_type, int32_type } from "../tests/fable_modules/fable-library.3.4.7/Reflection.js";
import { ofArray } from "../tests/fable_modules/fable-library.3.4.7/List.js";
import { map } from "../tests/fable_modules/fable-library.3.4.7/Array.js";
import { parseMidi } from "midi-file";

export class Header extends Record {
    constructor(format, ticksPerBeat, numTracks) {
        super();
        this.format = (format | 0);
        this.ticksPerBeat = (ticksPerBeat | 0);
        this.numTracks = (numTracks | 0);
    }
}

export function Header$reflection() {
    return record_type("MidiFile.Header", [], Header, () => [["format", int32_type], ["ticksPerBeat", int32_type], ["numTracks", int32_type]]);
}

class _MidiData extends Record {
    constructor(header, tracks) {
        super();
        this.header = header;
        this.tracks = tracks;
    }
}

function _MidiData$reflection() {
    return record_type("MidiFile._MidiData", [], _MidiData, () => [["header", Header$reflection()], ["tracks", array_type(array_type(class_type("MidiFile.MidiEvent")))]]);
}

export function MidiFile_op_Concatenate(f, n) {
    return f(n);
}

export class MidiFile_Event extends Union {
    constructor(tag, ...fields) {
        super();
        this.tag = (tag | 0);
        this.fields = fields;
    }
    cases() {
        return ["MidiNoteOn", "MidiNoteOff", "MidiController", "MidiInstrument", "MidiPitchBend", "MidiTimeSignature", "MidiTempo", "MidiTrackName", "MidiEndOfTrack", "MidiCopyright", "MidiText", "MidiKeySignature"];
    }
}

export function MidiFile_Event$reflection() {
    return union_type("MidiFile.MidiFile.Event", [], MidiFile_Event, () => [[["Item", class_type("MidiFile.MidiNoteEvent")]], [["Item", class_type("MidiFile.MidiNoteEvent")]], [["Item", class_type("MidiFile.MidiControllerEvent")]], [["Item", class_type("MidiFile.MidiInstrumentEvent")]], [["Item", class_type("MidiFile.MidiPitchBendEvent")]], [["Item", class_type("MidiFile.MidiTimeSignatureEvent")]], [["Item", class_type("MidiFile.MidiTempoEvent")]], [["Item", class_type("MidiFile.MidiTrackNameEvent")]], [["Item", class_type("MidiFile.MidiEndOfTrackEvent")]], [["Item", class_type("MidiFile.MidiCopyrightEvent")]], [["Item", class_type("MidiFile.MidiTextEvent")]], [["Item", class_type("MidiFile.MidiKeySignatureEvent")]]]);
}

export class MidiFile_MidiData extends Record {
    constructor(header, tracks) {
        super();
        this.header = header;
        this.tracks = tracks;
    }
}

export function MidiFile_MidiData$reflection() {
    return record_type("MidiFile.MidiFile.MidiData", [], MidiFile_MidiData, () => [["header", Header$reflection()], ["tracks", array_type(list_type(MidiFile_Event$reflection()))]]);
}

export function MidiFile_parseMidi(midiFile) {
    const convertTrack = (midiTrack) => ofArray(MidiFile_op_Concatenate((mapping) => ((array) => map(mapping, array)), (midiEvent) => {
        const matchValue = midiEvent.type;
        switch (matchValue) {
            case "noteOn": {
                return new MidiFile_Event(0, midiEvent);
            }
            case "noteOff": {
                return new MidiFile_Event(1, midiEvent);
            }
            case "controller": {
                return new MidiFile_Event(2, midiEvent);
            }
            case "programChange": {
                return new MidiFile_Event(3, midiEvent);
            }
            case "pitchBend": {
                return new MidiFile_Event(4, midiEvent);
            }
            case "timeSignature": {
                return new MidiFile_Event(5, midiEvent);
            }
            case "setTempo": {
                return new MidiFile_Event(6, midiEvent);
            }
            case "trackName": {
                return new MidiFile_Event(7, midiEvent);
            }
            case "endOfTrack": {
                return new MidiFile_Event(8, midiEvent);
            }
            case "copyrightNotice": {
                return new MidiFile_Event(9, midiEvent);
            }
            case "text":
            case "marker":
            case "lyrics":
            case "cuePoint": {
                return new MidiFile_Event(10, midiEvent);
            }
            case "keySignature": {
                return new MidiFile_Event(11, midiEvent);
            }
            default: {
                throw (new Error("Unknown midi event type."));
            }
        }
    })(midiTrack));
    const parsedMidiJs = parseMidi(midiFile);
    return new MidiFile_MidiData(parsedMidiJs.header, map(convertTrack, parsedMidiJs.tracks));
}

