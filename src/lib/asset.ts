const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Prepends the basePath (e.g. for GitHub Pages /alaa-abuzaiter-portfolio)
 * to static public asset paths, avoiding double prefixing.
 */
export function assetPath(path?: string | null): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (basePath && clean.startsWith(basePath)) {
    return clean;
  }
  return `${basePath}${clean}`;
}
