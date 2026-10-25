export type AnthropicKeyType =
  | "oauth_token"
  | "oauth_refresh_token"
  | "admin_key"
  | "api_key"
  | "unknown";

/**
 * Classifies an Anthropic key or token based on its prefix according to OmniRoute rules:
 * - sk-ant-oat*   -> OAuth token ('oauth_token')
 * - sk-ant-ort*   -> OAuth refresh token ('oauth_refresh_token')
 * - sk-ant-admin* -> Admin key ('admin_key')
 * - sk-ant-*      -> API key ('api_key', e.g. api, usr, svc, and any future type; sent as x-api-key)
 * - other         -> Non-Anthropic / unknown key ('unknown')
 */
export function classifyAnthropicKey(key: string | null | undefined): AnthropicKeyType {
  if (typeof key !== "string" || !key.startsWith("sk-ant-")) {
    return "unknown";
  }
  if (key.startsWith("sk-ant-oat")) {
    return "oauth_token";
  }
  if (key.startsWith("sk-ant-ort")) {
    return "oauth_refresh_token";
  }
  if (key.startsWith("sk-ant-admin")) {
    return "admin_key";
  }
  return "api_key";
}

/**
 * Returns true if the key is an Anthropic API key (api, usr, svc, or future sk-ant-* types except oat, ort, admin).
 */
export function isAnthropicApiKey(key: string | null | undefined): boolean {
  return classifyAnthropicKey(key) === "api_key";
}

/**
 * Returns true if the key is an Anthropic OAuth token (sk-ant-oat*).
 */
export function isAnthropicOAuthToken(key: string | null | undefined): boolean {
  return classifyAnthropicKey(key) === "oauth_token";
}

/**
 * Returns true if the key is an Anthropic OAuth refresh token (sk-ant-ort*).
 */
export function isAnthropicOAuthRefreshToken(key: string | null | undefined): boolean {
  return classifyAnthropicKey(key) === "oauth_refresh_token";
}

/**
 * Returns true if the key is an Anthropic Admin key (sk-ant-admin*).
 */
export function isAnthropicAdminKey(key: string | null | undefined): boolean {
  return classifyAnthropicKey(key) === "admin_key";
}
