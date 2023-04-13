export interface TiCpiParams {
    iso2CountryCode?: string;
    iso3CountryCode?: string;
}

export interface TiCpiScore {
    year: number;
    score: number;
    rank: number;
    sources: number;
    standardError: number;
}

export interface TiCpiScores {
    [year: string]: TiCpiScore;
}

export interface TiCpiCountryIndex {
    country: string;
    region: string;
    iso2CountryCode: string;
    iso3CountryCode: string;
    scores: TiCpiScores;
}

export interface TiCpiIndex {
    [iso3CountryCode: string]: TiCpiCountryIndex;
}