import Image from "next/image";

export function BrandSymbol({ className }: { className: string }) {
  return (
    <Image
      aria-hidden="true"
      alt=""
      className={className}
      height={768}
      src="/images/logo-association.jpeg"
      width={1408}
    />
  );
}
