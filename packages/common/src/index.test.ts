import assert from "node:assert/strict";
import test from "node:test";
import {
  IncomingMessageSchema,
  MonitorCreateSchema,
  WebsiteStatusSchema,
} from "./index.js";

test("accepts canonical monitor statuses", () => {
  assert.equal(WebsiteStatusSchema.parse("up"), "up");
  assert.throws(() => WebsiteStatusSchema.parse("Good"));
});

test("rejects malformed validator messages", () => {
  const result = IncomingMessageSchema.safeParse({
    type: "validate",
    data: { callbackId: "not-a-uuid", status: "Good" },
  });
  assert.equal(result.success, false);
});

test("requires complete monitor URLs", () => {
  assert.equal(
    MonitorCreateSchema.safeParse({ url: "https://example.com" }).success,
    true,
  );
  assert.equal(
    MonitorCreateSchema.safeParse({ url: "example.com" }).success,
    false,
  );
});
