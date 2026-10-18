import associationArticleData from "@/content/association-articles.json";

export type PreviewArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  coverImageAlt: string;
  publishedAt: Date | null;
  categories: { id: string; name: string; slug: string }[];
  isPreview: true;
};

export const previewArticles: PreviewArticle[] = associationArticleData.map((article) => ({
  id: `preview-${article.slug}`,
  title: article.title,
  slug: article.slug,
  excerpt: article.excerpt,
  content: article.content.join("\n\n"),
  coverImageUrl: article.coverImageUrl,
  coverImageAlt: article.coverImageAlt,
  publishedAt: null,
  categories: [{
    id: `preview-category-${article.categorySlug}`,
    name: article.category,
    slug: article.categorySlug,
  }],
  isPreview: true,
}));
