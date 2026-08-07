export const VOERBOTEN_SLUGS = ["voerbooten", "feed-boats"];

export function isVoerbotenProduct(categories) {
  return !!categories?.some((c) => VOERBOTEN_SLUGS.includes(c?.slug));
}
