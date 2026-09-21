/** Keep current pg SSL behavior without the sslmode=require deprecation warning. */
export function withVerifyFullSsl(connectionString: string) {
  if (!/[?&]sslmode=/i.test(connectionString)) {
    const separator = connectionString.includes("?") ? "&" : "?";
    return `${connectionString}${separator}sslmode=verify-full`;
  }

  return connectionString.replace(
    /([?&]sslmode=)(prefer|require|verify-ca)\b/i,
    "$1verify-full",
  );
}
