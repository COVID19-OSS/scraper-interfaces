import axios from "axios";

import { DataSource } from "../../DataSource";
import { SourceType } from "../../../definitions/sources/SourceType";
import { SourceData, SourceLocalityDataPoint } from "../../../definitions/sources/SourceData";
import { SourceFeatures } from "../../../definitions/sources/SourceFeatures";
import { NumericalUtilities } from "../../../utilities/NumericalUtilities";

const COL_SOURCE_URL = "https://e.infogram.com/api/live/flex/a2e70c7d-0e70-46ca-a79a-f7e5a243828a/dfee1a5c-5cc8-4e90-8efb-d5bdf2803bf6";

const COL_FEATURES: SourceFeatures = {
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

interface ColombiaType {
  data: Array<string[]>;
}

/**
 * ColombiaGovernmentDataSource Suite
 * @author Samuel Burbano <me@iosamuel.com>
 */
export class ColombiaGovernmentSource extends DataSource {
  public constructor() {
    super(SourceType.GOVERNMENT, COL_FEATURES);
  }

  protected async loadPageContent(): Promise<ColombiaType> {
    const response = await axios.get(COL_SOURCE_URL);
    return response.data;
  }

  public async loadSourceData(): Promise<SourceData> {
    const content = await this.loadPageContent();
    const cases = content.data[0];
    const casesHeader = cases.shift();
    const cityLocation = casesHeader?.indexOf("Ciudad de ubicación") || 2;

    const states: Record<string, any> = {};
    cases.forEach((caseData) => {
      const cityName = caseData[cityLocation];
      const cityCases = states[cityName];
      states[cityName] = cityCases ? cityCases + 1 : 1;
    });

    const parsedCounties: Array<SourceLocalityDataPoint> = Object.entries(states).reduce((countyData: any, state) => {
      countyData.push({ localityName: state[0], cases: NumericalUtilities.parseNumber(state[1]) });
      return countyData;
    }, []);

    return { total: { cases: cases.length }, localities: parsedCounties };
  }
}
