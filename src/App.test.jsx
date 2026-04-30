import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import App from "./App";

test("renders login page when unauthenticated", async () => {
  const { getByText } = render(<App />);
  await expect.element(getByText("Log In")).toBeInTheDocument();
});
