import {TiCpiCountryIndex, TiCpiIndex, TiCpiParams, TiCpiScore} from "./domain";
import cpiIndexData from "./data2023.json";
import {countryIso2ToIso3} from "./countryIsoMapping";

export function tiCpiIndex(): TiCpiIndex {
    return cpiIndexData;
}

function assertTiCiParams(params: TiCpiParams) {
    if(!params.iso2CountryCode && !params.iso3CountryCode) {
        throw new Error("Either iso2CountryCode or iso3CountryCode must be provided");
    }
    if(params.iso2CountryCode && params.iso3CountryCode) {
        throw new Error("Only one of iso2CountryCode or iso3CountryCode can be provided");
    }
    if(params.iso2CountryCode) {
        params.iso3CountryCode = countryIso2ToIso3(params.iso2CountryCode.toUpperCase());
        if(!params.iso3CountryCode) {
            throw new Error(`Could not find Transparency International Corruption Perception Index for country ${params.iso2CountryCode}`);
        }
    }
    params.iso3CountryCode = params.iso3CountryCode.toUpperCase();
}

export function tiCpi(params: TiCpiParams): TiCpiCountryIndex {
    assertTiCiParams(params);
    const countryIndex = cpiIndexData[params.iso3CountryCode];
    if(countryIndex) {
        return countryIndex;
    }
    throw new Error(`Could not find Transparency International Corruption Perception Index for country ${params.iso3CountryCode}`);
}

export function tiCpiForYear(params: TiCpiParams, year?: number): TiCpiScore {
    const index = tiCpi(params);
    if(!year) {
        year = 2022;
    }
    const score = index.scores[year];
    if(score) {
        return score;
    }
    throw new Error(`Could not find Transparency International Corruption Perception Index for year ${year} in country ${index.country} (${index.iso2CountryCode}) data available from 2012 through 2023`);
}

export function tiCpiUrl(params: TiCpiParams, year?: number): string {
    const score = tiCpiForYear(params, year);
    return `https://www.transparency.org/en/cpi/${score.year}/table/${params.iso3CountryCode.toLowerCase()}`;
}