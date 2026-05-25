/**
 * Canonical public URL for a profile (share, QR, JSON-LD).
 * Prefers custom domain, then this deployment's URL, then openbio.app.
 */
export function getProfilePublicUrl(profile: {
  link: string;
  customDomain?: string | null;
}): string {
  const slug = profile.link;
  const rawDomain = profile.customDomain?.trim();

  if (rawDomain) {
    const host = rawDomain
      .replace(/^https?:\/\//, '')
      .replace(/\/+$/, '')
      .split('/')[0];
    return `https://${host}`;
  }

  const siteUrl = process.env.NEXT_PUBLIC_URL;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'openbio.app';

  if (siteUrl) {
    try {
      const base = new URL(
        siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`
      );
      const { origin, hostname } = base;
      const isOpenBioHost =
        hostname === rootDomain ||
        hostname === `www.${rootDomain}` ||
        hostname.endsWith(`.${rootDomain}`);

      if (!isOpenBioHost) {
        return `${origin}/${slug}`;
      }
    } catch {
      // fall through to default
    }
  }

  return `https://${rootDomain}/${slug}`;
}
