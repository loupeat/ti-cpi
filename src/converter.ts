/**
 * Converts the raw data from https://www.transparency.org/ to JSON.
 * The converters input and output files are hard coded for each year's version.
 */
import * as path from "path";
import * as fs from "fs";
import {parse} from "csv-parse";
import {TiCpiCountryIndex, TiCpiIndex} from "./domain";
import {countryIso3ToIso2} from "./countryIsoMapping";

const csvFilePath = path.resolve(__dirname, "../CPI2023_GlobalResultsTrends.csv");
const csvFileContent = fs.readFileSync(csvFilePath, {encoding: "utf-8"});
parse(csvFileContent, {
    delimiter: ";",
}, (error, result) => {
    if(error) {
        console.error(error);
        return;
    }

    let skipLines = 4;

    const index: TiCpiIndex = {};

    for (const row of result) {
        if(skipLines > 0) {
            skipLines --;
            continue;
        }

        const country = row[0];
        const iso3CountryCode = row[1];
        const region = row[2];

        let year = 2023;
        let currentColumn = 3;

        let currentCountry: TiCpiCountryIndex = {
            country: country,
            region: region,
            iso2CountryCode: countryIso3ToIso2(iso3CountryCode),
            iso3CountryCode: iso3CountryCode,
            scores: {}
        };

        while(currentColumn < row.length) {
            const score = row[currentColumn];
            const rank = row[currentColumn + 1];
            const sources = row[currentColumn + 2];
            const standardError = row[currentColumn + 3];

            if(score && rank && sources && standardError) {
                currentCountry.scores[year] = {
                    year,
                    score: parseInt(score),
                    rank: parseInt(rank),
                    sources: parseInt(sources),
                    standardError: parseFloat(standardError)
                };
            }

            year --;
            currentColumn += 4;
        }

        console.log(`Found ${Object.keys(currentCountry.scores).length} scores for ${currentCountry.country} (${currentCountry.iso2CountryCode})`);
        index[currentCountry.iso3CountryCode] = currentCountry;
    }

    const jsonFilePath = path.resolve(__dirname, "../src/data2023.json");
    fs.writeFileSync(jsonFilePath, JSON.stringify(index, null, 2), {encoding: "utf-8"});
});

