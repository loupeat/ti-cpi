import {countryIso2ToIso3, countryIso3ToIso2} from "./countryIsoMapping";

describe('Validate lookups in the country code indices are valid', () => {

    test('Some well known ISO 2 to 3 code mappings should work', () => {
        expect(countryIso2ToIso3("AT")).toBe("AUT");
    });

    test('Some well known ISO 3 to 2 code mappings should work', () => {
        expect(countryIso3ToIso2("AUT")).toBe("AT");
    });

    test('None existing mappings should raise an Exception', () => {
        expect(() => countryIso2ToIso3("XX")).toThrowError("Country code XX not valid");
        expect(() => countryIso3ToIso2("XXX")).toThrowError("Country code XXX not valid");
    });

});