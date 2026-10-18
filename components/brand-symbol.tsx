import Image from "next/image";

export function BrandSymbol({ className }: { className: string }) {
  return (
    <Image
      aria-hidden="true"
      alt=""
      className={className}
      height={200}
      src="/images/ai-logo-66f1e7893932-standard.webp"
      width={208}
    />
  );
}
