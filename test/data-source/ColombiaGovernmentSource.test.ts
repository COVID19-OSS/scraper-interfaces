import { DataSourceName, DataSourceRegistry } from "../../src";

/**
 * ColombiaGovernmentDataSource Test Suite
 * @author Samuel Burbano <me@iosamuel.com>
 */
describe("ColombiaGovernmentSource", () => {
  test("Should fetch and parse", async () => {
    try {
      const dataSource = DataSourceRegistry.getDataSource(DataSourceName.COLOMBIA_GOV);
      await dataSource.loadSourceData();
    }
    catch (e) {
      console.error(e);
    }
  });
});
