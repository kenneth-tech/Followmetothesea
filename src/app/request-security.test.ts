import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedSiteRequest } from "./request-security.ts";

const env = {
  NEXT_PUBLIC_SITE_URL: "https://www.followmetothesea.com",
};

test("isAllowedSiteRequest allows same-origin browser requests", () => {
  const request = new Request("https://www.followmetothesea.com/api/contact", {
    headers: {
      origin: "https://www.followmetothesea.com",
      "sec-fetch-site": "same-origin",
    },
  });

  assert.equal(isAllowedSiteRequest(request, env), true);
});

test("isAllowedSiteRequest blocks cross-site browser requests", () => {
  const request = new Request("https://www.followmetothesea.com/api/contact", {
    headers: {
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
    },
  });

  assert.equal(isAllowedSiteRequest(request, env), false);
});

test("isAllowedSiteRequest requires a configured site origin", () => {
  const request = new Request("https://www.followmetothesea.com/api/contact");

  assert.equal(isAllowedSiteRequest(request, {}), false);
});
