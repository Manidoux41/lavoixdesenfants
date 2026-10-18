import { createYouTubeEmbedUrl } from "@/lib/youtube-video";

export function HeroBackgroundVideo({ videoId }: { videoId: string }) {
  return (
    <>
      <div className="hero-video-backdrop" aria-hidden="true">
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          src={createYouTubeEmbedUrl(videoId)}
          tabIndex={-1}
          title="Vidéo d’ambiance YouTube"
        />
      </div>
      <a
        className="hero-video-source"
        href={`https://www.youtube.com/watch?v=${videoId}`}
        rel="noreferrer"
        target="_blank"
      >
        Voir la vidéo sur YouTube
      </a>
    </>
  );
}
