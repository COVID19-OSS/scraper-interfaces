import axios from "axios";
import querystring from "querystring";

import { DataSource } from "../DataSource";

import { SourceType } from "../../definitions/sources/SourceType";
import { SourceData, SourceDataPoint, SourceLocalityDataPoint } from "../../definitions/sources/SourceData";
import { SourceFeatures } from "../../definitions/sources/SourceFeatures";

const HOPKINS_FEATURES: SourceFeatures = {
  cases: true,
  deaths: true,
  serious: false,
  critical: false,
  recovered: true,
  unresolved: true,
  pui: false,
  tested: false,
  updateEpoch: true
};

const HOPKINS_FIELD_REMAPPER = {
  "Last_Update": "updateEpoch",
  "Confirmed": "cases",
  "Deaths": "deaths",
  "Recovered": "recovered",
  "Active": "unresolved",
  "Country_Region": "localityName"
};

const HOPKINS_METADATA_URL = "https://www.arcgis.com/sharing/rest/content/items/c0b356e20b30490c8b8b4c7bb9554e7c?f=json";

export class HopkinsAggregatorSource extends DataSource {
  public constructor() {
    super(SourceType.AGGREGATOR, HOPKINS_FEATURES);
  }

  protected async loadPageContent(): Promise<Array<object>> {
    const metadataResponse = await axios.get(HOPKINS_METADATA_URL, {
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!metadataResponse.data.url) throw Error("No feature server URL provided!");
    const featureQueryString = querystring.encode({
      f: "json",
      where: "1=1",
      returnGeometry: false,
      outFields: "*",
      resultOffset: 0,
      resultRecordCount: 1000
    });
    const featureServerResponse = await axios.get(`${metadataResponse.data.url}/2/query?${featureQueryString}`);
    return featureServerResponse.data.features;
  }

  public async loadSourceData(): Promise<SourceData> {
    const pageContent = await this.loadPageContent();
    const localities = pageContent.reduce((localities: any, { attributes }: any) => {
      const locationDataPoint: any = {};
      Object.entries(HOPKINS_FIELD_REMAPPER).forEach(entry => {
        if (attributes[entry[0]]) {
          locationDataPoint[entry[1]] = attributes[entry[0]];
        }
      });
      localities.push(locationDataPoint);
      return localities;
    }, []);

    const total = localities.reduce((total: SourceDataPoint, locality: SourceLocalityDataPoint) => {
      if (locality.cases !== undefined) total.cases! += locality.cases;
      if (locality.deaths !== undefined) total.deaths! += locality.deaths;
      if (locality.unresolved !== undefined) total.unresolved! += locality.unresolved;
      if (locality.recovered !== undefined) total.recovered! += locality.recovered;
      return total;
    }, { cases: 0, deaths: 0, unresolved: 0, recovered: 0 });

    return { total: total , localities: localities };
  }
}
