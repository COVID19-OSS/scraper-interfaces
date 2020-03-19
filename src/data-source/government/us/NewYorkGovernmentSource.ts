import cheerio from "cheerio";
import UserAgent from "user-agents";
import * as cloudscraper from "cloudscraper";

import { DataSource } from "../../DataSource";
import { SourceType } from "../../../definitions/sources/SourceType";
import { SourceData, SourceLocalityDataPoint } from "../../../definitions/sources/SourceData";
import { SourceFeatures } from "../../../definitions/sources/SourceFeatures";
import { NumericalUtilities } from "../../../utilities/NumericalUtilities";

const NEW_YORK_SOURCE_URL = "https://coronavirus.health.ny.gov/county-county-breakdown-positive-cases/";

const EXPECTED_HEADER = ["County", "Positive Cases"];

const NEW_YORK_FEATURES: SourceFeatures = {
  cases: true,
  deaths: false,
  serious: false,
  critical: false,
  recovered: false,
  unresolved: false,
  pui: false,
  tested: false,
  updateEpoch: true
};

/**
 * NewYorkGovernmentDataSource Suite
 * @author GUH <contact@covid19.fyi>
 */
export class NewYorkGovernmentSource extends DataSource {
  public constructor() {
    super(SourceType.GOVERNMENT, NEW_YORK_FEATURES);
  }

  protected async loadPageContent(): Promise<string> {
    return cloudscraper.get({
      url: NEW_YORK_SOURCE_URL,
      headers: {
        "Host": "coronavirus.health.ny.gov",
        "User-Agent": new UserAgent().toString(),
      }
    });
  }

  public async loadSourceData(): Promise<SourceData> {
    const pageContentHtml = await this.loadPageContent();
    const page = cheerio.load(pageContentHtml);

    const tableRows = page("tbody").children().get().map(row => cheerio(row).children().get());
    const targetTable = tableRows.map(row => row.map(column => cheerio(column).text()));

    const headerRow = targetTable.shift();
    if (headerRow?.join(",") !== EXPECTED_HEADER.join(",")) throw Error(`Unexpected header row [${headerRow?.join(",")}]`);

    const parsedCounties: Array<SourceLocalityDataPoint> = targetTable.reduce((countyData: any, tableRow) => {
      countyData.push({ localityName: tableRow[0], cases: NumericalUtilities.parseNumber(tableRow[1]) });
      return countyData;
    }, []);

    const totalRowIdx = parsedCounties.findIndex(dataPoint => dataPoint.localityName === "Total Positive Cases (Statewide)");
    const totalRow = parsedCounties.splice(totalRowIdx, 1)[0];

    return { total: { cases: totalRow.cases }, localities: parsedCounties };
  }
}
