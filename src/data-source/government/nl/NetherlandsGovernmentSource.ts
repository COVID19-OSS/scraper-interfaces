import cheerio from "cheerio";
import UserAgent from "user-agents";
import * as cloudscraper from "cloudscraper";
import { DataSource } from "../../DataSource";
import { SourceType } from "../../../definitions/sources/SourceType";
import { SourceData, SourceLocalityDataPoint } from "../../../definitions/sources/SourceData";
import { SourceFeatures } from "../../../definitions/sources/SourceFeatures";
import { NumericalUtilities } from "../../../utilities/NumericalUtilities";

const NL_SOURCE_URL = "https://www.rivm.nl/coronavirus-kaart-van-nederland-per-gemeente";

const NL_FEATURES: SourceFeatures = {
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
 * NetherlandsDataSource Suite
 * @author Eric Solari <sliceofbytes@gmail.com>
 */
export class NetherlandsGovernmentSource extends DataSource {
  public constructor() {
    super(SourceType.GOVERNMENT, NL_FEATURES);
  }

  protected async loadPageContent(): Promise<string> {
    return cloudscraper.get({
      url: NL_SOURCE_URL,
      headers: {
        "Host": "rivm.nl",
        "User-Agent": new UserAgent().toString(),
      }
    });
  }


  public async loadSourceData(): Promise<SourceData> {
    const pageContentHtml = await this.loadPageContent();
    const page = cheerio.load(pageContentHtml);
    const pageText = page("#csvData").text();
    const data = pageText.split("\n");
    const parsedCounties = new Array<SourceLocalityDataPoint>();
    let totalCases = 0;
    for(let i = 3; i < data.length-1; i++) {
        let lineData = data[i].split(";");
        let localCases = NumericalUtilities.parseNumber(lineData[2]);
        totalCases += localCases
        parsedCounties.push({localityName: lineData[1], cases: localCases})
     }

    return { total: { cases: totalCases }, localities: parsedCounties };
  }
}
