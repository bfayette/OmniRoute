import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyAnthropicKey,
  isAnthropicApiKey,
  isAnthropicOAuthToken,
  isAnthropicOAuthRefreshToken,
  isAnthropicAdminKey,
  type AnthropicKeyType,
} from "../../src/lib/providers/anthropicKeyClassifier.ts";
import { DefaultExecutor } from "../../open-sse/executors/default.ts";

test("table-driven tests for classifyAnthropicKey and helper functions", () => {
  const cases: Array<{
    input: string | null | undefined;
    expectedType: AnthropicKeyType;
    isApi: boolean;
    isOauth: boolean;
    isRefresh: boolean;
    isAdmin: boolean;
  }> = [
    {
      input: "sk-ant-api03-test-key-12345",
      expectedType: "api_key",
      isApi: true,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "sk-ant-usr-test-user-key-67890",
      expectedType: "api_key",
      isApi: true,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "sk-ant-svc-test-service-account-key-11223",
      expectedType: "api_key",
      isApi: true,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "sk-ant-futuretype01-test-key-44556",
      expectedType: "api_key",
      isApi: true,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "sk-ant-oat01-test-oauth-token-99887",
      expectedType: "oauth_token",
      isApi: false,
      isOauth: true,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "sk-ant-ort01-test-refresh-token-55443",
      expectedType: "oauth_refresh_token",
      isApi: false,
      isOauth: false,
      isRefresh: true,
      isAdmin: false,
    },
    {
      input: "sk-ant-admin01-test-admin-key-33221",
      expectedType: "admin_key",
      isApi: false,
      isOauth: false,
      isRefresh: false,
      isAdmin: true,
    },
    {
      input: "sk-proj-openai-api-key-12345",
      expectedType: "unknown",
      isApi: false,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "gsk_groq_key_1234567890",
      expectedType: "unknown",
      isApi: false,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: "",
      expectedType: "unknown",
      isApi: false,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: null,
      expectedType: "unknown",
      isApi: false,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
    {
      input: undefined,
      expectedType: "unknown",
      isApi: false,
      isOauth: false,
      isRefresh: false,
      isAdmin: false,
    },
  ];

  for (const c of cases) {
    assert.equal(classifyAnthropicKey(c.input), c.expectedType);
    assert.equal(isAnthropicApiKey(c.input), c.isApi);
    assert.equal(isAnthropicOAuthToken(c.input), c.isOauth);
    assert.equal(isAnthropicOAuthRefreshToken(c.input), c.isRefresh);
    assert.equal(isAnthropicAdminKey(c.input), c.isAdmin);
  }
});

test("DefaultExecutor buildHeaders with Anthropic API key types sends x-api-key and never Authorization: Bearer on official URL", () => {
  const executor = new DefaultExecutor("anthropic");

  const apiKeyCases = [
    "sk-ant-api03-test-key-sample",
    "sk-ant-usr-test-user-sample",
    "sk-ant-svc-test-service-sample",
    "sk-ant-newprefix-test-sample",
  ];

  for (const key of apiKeyCases) {
    const headers = executor.buildHeaders({ apiKey: key }, false);
    assert.equal(headers["x-api-key"], key);
    assert.equal(headers["Authorization"], undefined);
  }
});

test("DefaultExecutor buildHeaders with Anthropic OAuth token sends Authorization: Bearer", () => {
  const executor = new DefaultExecutor("claude");
  const oauthToken = "sk-ant-oat01-test-oauth-token-sample";

  const headers = executor.buildHeaders({ accessToken: oauthToken }, false);
  assert.equal(headers["Authorization"], `Bearer ${oauthToken}`);
  assert.equal(headers["x-api-key"], undefined);
});

test("DefaultExecutor buildHeaders with non-Anthropic key retains normal provider auth behavior", () => {
  const executor = new DefaultExecutor("openai");
  const openAiKey = "sk-proj-test-openai-key-sample";

  const headers = executor.buildHeaders({ apiKey: openAiKey }, false);
  assert.equal(headers["Authorization"], `Bearer ${openAiKey}`);
  assert.equal(headers["x-api-key"], undefined);
});
