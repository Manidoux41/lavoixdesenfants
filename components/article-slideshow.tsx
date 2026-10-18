"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

type SlideArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string | null;
  coverImageAlt: string | null;
  publishedAt: string | null;
  categories: { name: string; slug: string }[];
  isDemo?: boolean;
};

export function ArticleSlideshow({ articles }: { articles: SlideArticle[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const article = articles[activeIndex];

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    updatePreference();
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (articles.length < 2 || userPaused || hovered || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % articles.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [articles.length, userPaused, hovered, focused, reducedMotion]);

  if (!article) return null;

  const move = (direction: -1 | 1) => {
    setActiveIndex((index) => (index + direction + articles.length) % articles.length);
  };

  const publishedDate = article.publishedAt
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(article.publishedAt))
    : null;

  return (
    <div
      className="article-slideshow"
      role="region"
      aria-roledescription="diaporama"
      aria-label="Articles récents de l’association"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="slideshow-visual">
        {article.coverImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={article.id}
            className="slideshow-image"
            src={article.coverImageUrl}
            alt={article.coverImageAlt ?? ""}
          />
        )}
        <div className="slideshow-image-shade" aria-hidden="true" />
        <p className="slideshow-index" aria-hidden="true">
          LVE / JOURNAL <span>{String(activeIndex + 1).padStart(2, "0")} — {String(articles.length).padStart(2, "0")}</span>
        </p>
        {article.isDemo && <span className="slideshow-demo-label">ARTICLE DE DÉMONSTRATION</span>}
        <Link
          className="slideshow-open"
          href={`/actualites/${article.slug}`}
          aria-label={`Lire l’article : ${article.title}`}
        >
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>
        {article.coverImageUrl && <span className="slideshow-image-credit">Image d’illustration</span>}
      </div>

      <div className="slideshow-copy" aria-live="off">
        <div className="slideshow-meta">
          {article.isDemo && <span className="slideshow-demo-note">Exemple fictif</span>}
          {article.categories.map((category) => (
            <Link
              className="slideshow-category"
              href={`/actualites?categorie=${encodeURIComponent(category.slug)}`}
              key={category.slug}
            >
              {category.name}
            </Link>
          ))}
          {publishedDate && <span>{publishedDate}</span>}
        </div>
        <h3 aria-roledescription="diapositive">{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="slideshow-controls">
          <div className="slideshow-buttons">
            {articles.length > 1 && (
              <>
                <button type="button" onClick={() => move(-1)} aria-label="Article précédent">
                  <ArrowLeft size={17} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => move(1)} aria-label="Article suivant">
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
                {!reducedMotion && (
                  <button
                    type="button"
                    onClick={() => setUserPaused((value) => !value)}
                    aria-label={userPaused ? "Lancer le défilement automatique" : "Mettre le diaporama en pause"}
                  >
                    {userPaused
                      ? <Play size={15} aria-hidden="true" />
                      : <Pause size={15} aria-hidden="true" />}
                  </button>
                )}
              </>
            )}
          </div>
          <Link className="text-link" href={`/actualites/${article.slug}`}>
            Lire l’article <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        {articles.length > 1 && (
          <div className="slideshow-progress" role="group" aria-label="Choisir un article">
            {articles.map((item, index) => (
              <button
                aria-label={`Afficher l’article ${index + 1} : ${item.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={index === activeIndex ? "active" : ""}
                key={item.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
