import { PromiseBuilder__Zero, PromiseBuilder__Bind_Z38CC18ED, PromiseBuilder__Delay_62FBFDE1, PromiseBuilder__Run_62FBFDE1 } from "./fable_modules/Fable.Promise.3.1.2/Promise.fs.js";
import { fetch$ } from "./fable_modules/Fable.Fetch.2.4.0/Fetch.fs.js";
import { empty } from "./fable_modules/fable-library.3.4.7/List.js";
import { some } from "./fable_modules/fable-library.3.4.7/Option.js";
import { promise } from "./fable_modules/Fable.Promise.3.1.2/PromiseImpl.fs.js";

test("header parses properly", async () => { await PromiseBuilder__Run_62FBFDE1(promise, PromiseBuilder__Delay_62FBFDE1(promise, () => PromiseBuilder__Bind_Z38CC18ED(promise, fetch$("./example2.mid", empty()), (_arg1) => {
    const file = _arg1;
    console.log(some(file));
    return PromiseBuilder__Zero(promise);
}))) }, undefined);

