import assert from "node:assert/strict";
import test from "node:test";
import { createYouTubeEmbedUrl, extractYouTubeVideoId } from "../lib/youtube-video.ts";

test("extracts IDs from supported YouTube URL formats", () => {
  assert.equal(extractYouTubeVideoId("https://www.youtube.com/watch?v=LnIO5TXB2X0"), "LnIO5TXB2X0");
  assert.equal(extractYouTubeVideoId("https://youtu.be/LnIO5TXB2X0?t=5"), "LnIO5TXB2X0");
  assert.equal(extractYouTubeVideoId("https://www.youtube.com/embed/LnIO5TXB2X0"), "LnIO5TXB2X0");
  assert.equal(extractYouTubeVideoId("https://youtube.com/shorts/LnIO5TXB2X0"), "LnIO5TXB2X0");
});

test("rejects non-YouTube URLs and malformed video IDs", () => {
  assert.equal(extractYouTubeVideoId("https://example.com/watch?v=LnIO5TXB2X0"), null);
  assert.equal(extractYouTubeVideoId("http://youtube.com/watch?v=LnIO5TXB2X0"), null);
  assert.equal(extractYouTubeVideoId("https://youtube.com.evil.example/watch?v=LnIO5TXB2X0"), null);
  assert.equal(extractYouTubeVideoId("not-a-video-id"), null);
});

test("creates a muted looping embed URL in YouTube privacy-enhanced mode", () => {
  const url = new URL(createYouTubeEmbedUrl("LnIO5TXB2X0"));
  assert.equal(url.hostname, "www.youtube-nocookie.com");
  assert.equal(url.pathname, "/embed/LnIO5TXB2X0");
  assert.equal(url.searchParams.get("autoplay"), "1");
  assert.equal(url.searchParams.get("mute"), "1");
  assert.equal(url.searchParams.get("loop"), "1");
  assert.equal(url.searchParams.get("playlist"), "LnIO5TXB2X0");
});

test("refuses an invalid ID when creating an embed URL", () => {
  assert.throws(() => createYouTubeEmbedUrl("invalid"));
});
