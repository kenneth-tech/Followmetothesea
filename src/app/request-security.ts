type HeaderReadable = {
  headers: Headers;
};

type SecurityEnv = Record<string, string | undefined>;

function getConfiguredSiteOrigin(env: SecurityEnv): string | null {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL?.trim();

  if (!siteUrl) {
    return null;
  }

  try {
    const parsedSiteUrl = new URL(siteUrl);

    if (!["http:", "https:"].includes(parsedSiteUrl.protocol)) {
      return null;
    }

    return parsedSiteUrl.origin;
  } catch {
    return null;
  }
}

function getHeaderOrigin(value: string | null): string | null {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isAllowedSiteRequest(
  request: HeaderReadable,
  env: SecurityEnv = process.env,
): boolean {
  const allowedOrigin = getConfiguredSiteOrigin(env);

  if (!allowedOrigin) {
    return false;
  }

  const fetchSite = request.headers.get("sec-fetch-site");

  if (fetchSite === "cross-site") {
    return false;
  }

  const origin = getHeaderOrigin(request.headers.get("origin"));

  if (origin && origin !== allowedOrigin) {
    return false;
  }

  const referer = getHeaderOrigin(request.headers.get("referer"));

  if (!origin && referer && referer !== allowedOrigin) {
    return false;
  }

  return true;
}
