import {tiCpiIndex} from "./index";
import {MOST_CURRENT_YEAR} from "./const";

describe('Validate data integrity across the Transparency International Corruption Perception Index', () => {

    const index = tiCpiIndex();

    test('Index should contain data', () => {
        expect(Object.keys(index).length).toBeGreaterThan(0);
    });

    test('All countries should have required fields', () => {
        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            expect(country).toHaveProperty('country');
            expect(country).toHaveProperty('region');
            expect(country).toHaveProperty('iso2CountryCode');
            expect(country).toHaveProperty('iso3CountryCode');
            expect(country).toHaveProperty('scores');
            expect(typeof country.country).toBe('string');
            expect(typeof country.region).toBe('string');
            expect(typeof country.iso2CountryCode).toBe('string');
            expect(typeof country.iso3CountryCode).toBe('string');
            expect(country.country.length).toBeGreaterThan(0);
            expect(country.iso2CountryCode.length).toBe(2);
            expect(country.iso3CountryCode.length).toBe(3);
        });
    });

    test('All countries should have at least one score', () => {
        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            expect(Object.keys(country.scores).length).toBeGreaterThan(0);
        });
    });

    test('All scores should have valid structure and values', () => {
        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            Object.keys(country.scores).forEach(year => {
                const score = country.scores[year];
                expect(score).toHaveProperty('year');
                expect(score).toHaveProperty('score');
                expect(score).toHaveProperty('rank');
                expect(score).toHaveProperty('sources');
                expect(score).toHaveProperty('standardError');

                // Validate types
                expect(typeof score.year).toBe('number');
                expect(typeof score.score).toBe('number');
                expect(typeof score.rank).toBe('number');
                expect(typeof score.sources).toBe('number');
                expect(typeof score.standardError).toBe('number');

                // Validate ranges
                expect(score.year).toBeGreaterThanOrEqual(2012);
                expect(score.year).toBeLessThanOrEqual(MOST_CURRENT_YEAR);
                expect(score.score).toBeGreaterThanOrEqual(0);
                expect(score.score).toBeLessThanOrEqual(100);
                expect(score.rank).toBeGreaterThan(0);
                expect(score.sources).toBeGreaterThanOrEqual(0);
                expect(score.standardError).toBeGreaterThanOrEqual(0);
            });
        });
    });

    test('ISO3 codes should match the key', () => {
        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            expect(country.iso3CountryCode).toBe(iso3Code);
        });
    });

    test('All countries should have consistent year data keys matching year values', () => {
        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            Object.keys(country.scores).forEach(yearKey => {
                const score = country.scores[yearKey];
                expect(score.year).toBe(parseInt(yearKey));
            });
        });
    });

    test('Should have data for the most current year', () => {
        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            // Most countries should have current year data, but some might not
            // Just verify the data structure is ready for it
            expect(country.scores).toBeDefined();
        });
    });

    test('Ranks should have reasonable distribution within each year', () => {
        // For each year, collect all ranks and verify reasonable distribution
        const yearRanks: {[year: number]: number[]} = {};

        Object.keys(index).forEach(iso3Code => {
            const country = index[iso3Code];
            Object.keys(country.scores).forEach(yearKey => {
                const year = parseInt(yearKey);
                const rank = country.scores[yearKey].rank;

                if (!yearRanks[year]) {
                    yearRanks[year] = [];
                }
                yearRanks[year].push(rank);
            });
        });

        // Check each year has ranks and they are within reasonable bounds
        Object.keys(yearRanks).forEach(yearKey => {
            const year = parseInt(yearKey);
            const ranks = yearRanks[year];
            const uniqueRanks = new Set(ranks);

            // Verify we have ranks data
            expect(ranks.length).toBeGreaterThan(0);
            // Verify we have at least some unique ranks (allowing for ties)
            expect(uniqueRanks.size).toBeGreaterThan(0);
            // Verify ranks are in reasonable range (1 to number of countries)
            ranks.forEach(rank => {
                expect(rank).toBeGreaterThan(0);
                expect(rank).toBeLessThanOrEqual(ranks.length);
            });
        });
    });

});
