import assert from "node:assert/strict";
import test from "node:test";
import { contactSchema } from "../lib/contact-schema.ts";
import { createPasswordHash, verifyPassword } from "../lib/password.ts";
import { publicationDate } from "../lib/publication.ts";

test("password hashes are salted and verify without storing plaintext", async () => {
  const password = "a-very-long-test-password";
  const firstHash = await createPasswordHash(password);
  const secondHash = await createPasswordHash(password);

  assert.notEqual(firstHash, secondHash);
  assert.equal(firstHash.includes(password), false);
  assert.equal(await verifyPassword(password, firstHash), true);
  assert.equal(await verifyPassword("incorrect-password", firstHash), false);
  assert.equal(await verifyPassword(password, "invalid"), false);
});

test("contact schema accepts minimal valid data and rejects invalid or overlong data", () => {
  const valid = {
    name: "Parent",
    email: "parent@example.org",
    subject: "Question",
    message: "Je souhaite prendre contact avec l’association.",
    website: "",
  };

  assert.equal(contactSchema.safeParse(valid).success, true);
  assert.equal(contactSchema.safeParse({ ...valid, email: "invalid" }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, website: "spam" }).success, false);
  assert.equal(contactSchema.safeParse({ ...valid, message: "short" }).success, false);
});

test("scheduled posts require a future date and future posts cannot be public", () => {
  const now = new Date("2026-10-18T00:00:00.000Z");

  assert.equal(
    publicationDate("SCHEDULED", "2026-10-19T00:00:00.000Z", now).error,
    null,
  );
  assert.notEqual(
    publicationDate("SCHEDULED", "2026-10-17T00:00:00.000Z", now).error,
    null,
  );
  assert.notEqual(
    publicationDate("PUBLISHED", "2026-10-19T00:00:00.000Z", now).error,
    null,
  );
  assert.equal(publicationDate("DRAFT", "", now).date, null);
});
