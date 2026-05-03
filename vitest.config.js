import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom", // Use a DOM-like environment for Angular components
    mockReset: true, //Restore/reset all mocks between tests
    reporters: process.env.GITHUB_ACTIONS ? ["dot", "github-actions"] : ["dot"], //When running on github, use a reporters that hooks into it
    coverage: {
      enabled: true,
      clean: true,
      exclude: ["test/**/*.ts"],
    },
    globals: true, // Enable globals API (describe/it/expect as globals)
  },
});
