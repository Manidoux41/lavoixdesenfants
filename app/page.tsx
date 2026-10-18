import Link from "next/link";
import { Suspense } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Ear,
  HeartHandshake,
  Scale,
} from "lucide-react";
import { ArticleSlideshow } from "@/components/article-slideshow";
import { getLatestArticles } from "@/lib/articles";

const missions = [
  {
    number: "01",
    icon: Ear,
    title: "Écouter, sans juger",
    description:
      "Faire une place à la parole des parents et des enfants concernés, dans le respect de chaque histoire.",
  },
  {
    number: "02",
    icon: Scale,
    title: "Faciliter l’accès aux droits",
    description:
      "Encourager chacun à s’informer et à identifier les interlocuteurs et ressources adaptés à sa situation.",
  },
  {
    number: "03",
    icon: HeartHandshake,
    title: "Faire place au dialogue",
    description:
      "Promouvoir des échanges constructifs et la recherche de solutions centrées sur l’intérêt de l’enfant.",
  },
];

async function LatestArticles() {
  const articles = await getLatestArticles();

  return (
    <>
      {articles.length > 0 ? (
        <ArticleSlideshow
          articles={articles.map((article) => ({
            ...article,
            publishedAt: article.publishedAt?.toISOString() ?? null,
            isDemo: "isDemo" in article,
          }))}
        />
      ) : (
        <div className="empty-news">
          <span className="empty-news-index">LVE / JOURNAL</span>
          <p>Les actualités de l’association seront publiées ici.</p>
          <span>Pas d’article publié pour le moment.</span>
        </div>
      )}
    </>
  );
}

function LatestArticlesFallback() {
  return (
    <div className="empty-news" aria-label="Chargement des actualités">
      <span className="empty-news-index">LVE / JOURNAL</span>
      <p>Les actualités de l’association seront publiées ici.</p>
    </div>
  );
}

export default function Home() {
  return (
    <main id="contenu">
      <section className="hero">
        <div className="hero-grain" aria-hidden="true" />
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="eyebrow eyebrow-light"><span className="eyebrow-mark" />Association · Vienne, Isère</p>
            <h1>La parole d’un enfant <em>compte.</em></h1>
            <p className="hero-lede">
              Écouter les familles. Encourager le dialogue. Défendre l’accès aux droits et la recherche de solutions adaptées à l’intérêt de l’enfant.
            </p>
            <div className="hero-actions">
              <Link className="button button-red" href="/actions">
                Découvrir nos actions <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link className="button button-outline-light" href="/contact">
                Nous contacter
              </Link>
            </div>
            <div className="hero-caption">
              <span className="hero-caption-line" />
              <span>La Voix des Enfants Placés à Vienne (38200)</span>
            </div>
          </div>
          <div className="hero-art" aria-label="Illustration typographique de voix qui se répondent">
            <div className="hero-orbit orbit-one" aria-hidden="true" />
            <div className="hero-orbit orbit-two" aria-hidden="true" />
            <div className="hero-stamp">
              <span>ÉCOUTER</span><span className="stamp-dot" /><span>COMPRENDRE</span><span className="stamp-dot" /><span>AGIR</span>
            </div>
            <div className="hero-voice" aria-hidden="true">
              <span>UNE</span>
              <strong>VOIX</strong>
              <span>QUI COMPTE</span>
            </div>
            <span className="hero-art-index">V / 38 · ISÈRE</span>
          </div>
          <Link className="hero-scroll" href="#engagements">
            <span>Explorer</span><ArrowDown size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-side-note" aria-hidden="true">DROITS · ÉCOUTE · DIALOGUE</div>
      </section>

      <section className="intro-strip" id="engagements">
        <p className="eyebrow"><span className="eyebrow-mark" />Notre engagement</p>
        <p className="intro-statement">
          Une association engagée pour la parole des familles confrontées au placement.
        </p>
        <p className="intro-aside">
          L’association encourage le dialogue, l’accès aux droits et la recherche de solutions adaptées à l’intérêt de l’enfant.
        </p>
      </section>

      <section className="missions-section section-pad">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" />Ce qui nous guide</p>
            <h2>Faire entendre.<br /><em>Faire avancer.</em></h2>
          </div>
          <p className="section-intro">
            Une démarche humaine et engagée, attentive à la parole de chacun et à la complexité des situations.
          </p>
        </div>
        <div className="mission-grid">
          {missions.map(({ number, icon: Icon, title, description }) => (
            <article className="mission-card" key={number}>
              <div className="mission-card-top">
                <span className="mission-number">{number}</span>
                <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              <span className="mission-rule" />
            </article>
          ))}
        </div>
        <Link className="text-link section-link" href="/association">
          En savoir plus sur l’association <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="image-story section-pad" aria-labelledby="family-story-title">
        <div className="image-story-grid">
          <figure className="story-photo story-photo-family">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/family-silhouettes.jpg"
              alt="Silhouettes d’une famille vue de dos, réunie au bord de l’eau."
              width="900"
              height="600"
              loading="lazy"
            />
            <figcaption>Image d’illustration · Unsplash</figcaption>
          </figure>
          <div className="image-story-copy">
            <p className="eyebrow"><span className="eyebrow-mark" />Familles & parcours</p>
            <h2 id="family-story-title">Des liens à soutenir.<br /><em>Des repères à trouver.</em></h2>
            <p>
              Chaque situation est singulière. Écouter les familles et faciliter l’accès à une information fiable peut aider à ouvrir un dialogue.
            </p>
            <figure className="story-photo story-photo-papers">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/access-to-information.jpg"
                alt="Deux personnes consultent et annotent ensemble un document."
                width="900"
                height="600"
                loading="lazy"
              />
              <figcaption>Information & démarches · image d’illustration Unsplash</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="voice-section">
        <div className="voice-section-mark" aria-hidden="true">“</div>
        <div className="voice-section-copy">
          <p className="eyebrow eyebrow-light"><span className="eyebrow-mark" />Écouter avant de parler</p>
          <h2>Personne ne devrait parler <em>à la place</em> des enfants.</h2>
          <p>
            Leurs vécus sont singuliers. Les écouter avec attention et dignité, c’est reconnaître leur place dans les décisions qui les concernent.
          </p>
          <Link className="button button-outline-light" href="/temoignages">
            Notre approche des témoignages <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className="voice-vertical" aria-hidden="true">ÉCOUTE · RESPECT · DIGNITÉ</div>
      </section>

      <section className="news-section section-pad">
        <div className="section-heading news-heading">
          <div>
            <p className="eyebrow"><span className="eyebrow-mark" />Le fil de l’association</p>
            <h2>Actualités &<br /><em>repères.</em></h2>
          </div>
          <Link className="text-link" href="/actualites">
            Toutes les actualités <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <Suspense fallback={<LatestArticlesFallback />}>
          <LatestArticles />
        </Suspense>
      </section>

      <section className="resource-band">
        <div className="resource-band-inner">
          <div className="resource-band-index">01 — S’INFORMER</div>
          <div>
            <p className="eyebrow eyebrow-light"><span className="eyebrow-mark" />Des repères, pas des réponses toutes faites</p>
            <h2>Comprendre ses droits<br />est un premier pas.</h2>
          </div>
          <Link className="resource-band-link" href="/ressources" aria-label="Découvrir les ressources utiles">
            <ArrowUpRight size={23} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="join-section">
        <div className="join-copy">
          <p className="eyebrow"><span className="eyebrow-mark" />Ensemble, faisons une place à la parole</p>
          <h2>Vous souhaitez<br /><em>échanger ?</em></h2>
        </div>
        <div className="join-aside">
          <p>Pour une question, une information ou simplement pour prendre contact, écrivez à l’association.</p>
          <Link className="button button-dark" href="/contact">
            Prendre contact <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <Link className="text-link" href="/agir">Découvrir comment agir <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>
    </main>
  );
}
