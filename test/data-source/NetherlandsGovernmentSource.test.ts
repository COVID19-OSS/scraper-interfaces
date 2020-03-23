import { DataSourceName, DataSourceRegistry } from "../../src";

/**
 * NetherlandsGovernmentDataSource Test Suite
 * @author SliceofBytes <sliceofbytes@gmail.com>
 */
describe("NetherlandsGovernmentSource", () => {
  test("Should fetch and parse", async () => {
    try {
      const dataSource = DataSourceRegistry.getDataSource(DataSourceName.NETHERLANDS_GOV);
      await dataSource.loadSourceData();
    }
    catch (e) {
      console.error(e);
    }
  });
});
