import assert from "node:assert/strict";
import test from "node:test";
import { contactSchema } from "../lib/contact-schema.ts";
import { createPasswordHash, verifyPassword } from "../lib/password.ts";
import { publicationDate } from "../lib/publication.ts";
import { isValidImageUpload, MAX_MEDIA_UPLOAD_BYTES } from "../lib/media-validation.ts";

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

test("media uploads accept supported image signatures and reject spoofed or oversized files", () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0x00]);
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50]);

  assert.equal(isValidImageUpload("image/jpeg", jpeg.length, jpeg), true);
  assert.equal(isValidImageUpload("image/png", png.length, png), true);
  assert.equal(isValidImageUpload("image/webp", webp.length, webp), true);
  assert.equal(isValidImageUpload("image/png", jpeg.length, jpeg), false);
  assert.equal(isValidImageUpload("image/svg+xml", jpeg.length, jpeg), false);
  assert.equal(isValidImageUpload("image/jpeg", 0, new Uint8Array()), false);
  assert.equal(isValidImageUpload("image/jpeg", MAX_MEDIA_UPLOAD_BYTES + 1, jpeg), false);
});
