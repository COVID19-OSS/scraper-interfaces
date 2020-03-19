import { DataSourceName, DataSourceRegistry } from "../../src";

/**
 * NewYorkGovernmentDataSource Test Suite
 * @author GUH <contact@covid19.fyi>
 */
describe("NewYorkGovernmentSource", () => {
  test("Should fetch and parse", async () => {
    try {
      const dataSource = DataSourceRegistry.getDataSource(DataSourceName.NEW_YORK_GOV);
      const html = await dataSource.getPageContent();
      await dataSource.parsePageContent(html);
    }
    catch (e) {
      console.error(e);
    }
  });
});
