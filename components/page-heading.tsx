export function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-heading">
      <p className="eyebrow"><span className="eyebrow-mark" />{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-heading-description">{description}</p>
    </header>
  );
}
