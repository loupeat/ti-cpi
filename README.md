# Transparency International - Corruption Perception Index

This small library wraps up the data collected by Transparency International in their Corruption Perception Index. The
data is available in CSV/Excel format on their [website](https://www.transparency.org/en/cpi/2022). This library
provides a simple interface to the data. The original data is licensed under the
[Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)](https://creativecommons.org/licenses/by-nd/4.0/)
license. The data converted from Excel to CSV is hosted in this directory in the file
[CPI2023_GlobalResultsTrends.csv](CPI2023_GlobalResultsTrends.csv)
and is licensed under the same license. The code itself is licensed under the [MIT License](LICENSE).

## How to use

You can install this library using NPM:

```bash
npm i --save ti-cpi
```

Then you can use it in your (TypeScript) code like this:

```typescript
import {tiCpi, tiCpiForYear, tiCpiUrl} from "ti-cpi";
import {testPathPatternToRegExp} from "jest-util";

const iso2CountryCode = "AT";

// Fetch all the data for a specific country
const austria = tiCpi({iso2CountryCode})

const austria2020 = tiCpiForYear({iso2CountryCode}, 2020);

// Fetch the URL of a countries CPI page
const url = tiCpiUrl({iso2CountryCode});
```

## Data updates

Transparency international releases the update data annually in January. We are on relevant news-letters and update
this library as soon as possible after receiving the update information.

## Developers

### Updating

To update the data do the following:

 - Run `npm install` to install the required dependencies
 - Change the const MOST_CURRENT_YEAR in `const.ts` the the year with the most recent data (the last year)
 - Download the latest data from the Transparency International website (Excel format, Results and Trends)
 - Export the Excel tab "Results and trends" to CSV
 - Open CSV file and replace `,` with `;` (semicolon) in the whole file
 - Move the CSV file to the root of this repository and rename it to `CPI<year>_GlobalResultsTrends.csv`
 - Run `npm run convert` to convert the CSV file to JSON (this will create a new file `src/data<year>.json`)
 - Ensure that the new files are added to GIT
 - Run the tests and follow the instructions below to publish the new version

### Building

To build this library you can run:

```bash
npm run build
```
A version published to NPM can be created by following the following checklist:

 - Bump the version in `package.json`
 - Run `npm run build` locally to verify the build is working
 - Run `npm run test` locally to verify none of the tests are failing
 - Commit and push the changes to the main branch
 - Create a new release on GitHub with the version number as the tag
 - The CI configuration in `.github/workflows/release.yml` will automatically publish the new version to NPM