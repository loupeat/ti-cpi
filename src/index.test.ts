import {tiCpi, tiCpiForYear, tiCpiUrl} from "./index";
import {MOST_CURRENT_YEAR} from "./const";

describe('Validate lookups throughout the Transparency International Corruption Perception Index', () => {

    test('Austria should be found via ISO2 code', () => {
        const index = tiCpi({iso2CountryCode: "AT"});
        expect(index.country).toBe("Austria");
    });

    test('Austria should be found via ISO3 code', () => {
        const index = tiCpi({iso3CountryCode: "AUT"});
        expect(index.country).toBe("Austria");
    });

    test('There should not be a country with ISO2 code "XX"', () => {
        expect(() => tiCpi({iso2CountryCode: "XX"})).toThrowError("Country code XX not valid");
    });

    test('There should not be a country with ISO3 code "XXX"', () => {
        expect(() => tiCpi({iso3CountryCode: "XXX"})).toThrowError("Could not find Transparency International Corruption Perception Index for country XX");
    });

    test('Austria has a 2022 CPI score of 71 and a rank of 22', () => {
        const score = tiCpiForYear({iso2CountryCode: "AT"}, 2022);
        expect(score.score).toBe(71);
        expect(score.rank).toBe(22);
    });

    test('If we do not provide a year for the tiCpiForYear lookup for Austria, we expect the year 2022', () => {
        const score = tiCpiForYear({iso2CountryCode: "AT"}, 2022);
        expect(score.year).toBe(2022);
        expect(score.score).toBe(71);
        expect(score.rank).toBe(22);
    });

    test(`The CPI started with 2012 and is available until ${MOST_CURRENT_YEAR}, so 2011 and 2025 should not provide a valid result`, () => {
        expect(() => tiCpiForYear({iso2CountryCode: "AT"}, 2011)).toThrowError(`Could not find Transparency International Corruption Perception Index for year 2011 in country Austria (AT) data available from 2012 through ${MOST_CURRENT_YEAR}`);
        expect(() => tiCpiForYear({iso2CountryCode: "AT"}, 2025)).toThrowError(`Could not find Transparency International Corruption Perception Index for year 2025 in country Austria (AT) data available from 2012 through ${MOST_CURRENT_YEAR}`);
    });

    test(`We should be able to get the URL for the ${MOST_CURRENT_YEAR} CPI score for Austria`, () => {
        const url = tiCpiUrl({iso2CountryCode: "AT"});
        expect(url).toBe(`https://www.transparency.org/en/cpi/${MOST_CURRENT_YEAR}/table/aut`);
    });

    test('Kosovo should be found via ISO2 code in lower case', () => {
        const index = tiCpi({iso2CountryCode: "xk"});
        expect(index.country).toBe("Kosovo");
    });

    test('Kosovo should be found via ISO3 code', () => {
        const index = tiCpi({iso3CountryCode: "ksv"});
        expect(index.country).toBe("Kosovo");
    });

});