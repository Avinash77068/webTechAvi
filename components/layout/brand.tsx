import Image from "next/image";
import Link from "next/link";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="TechSutra home"
      className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}
    >
      <Image
        src="/logo.png"
        alt=""
        width={32}
        height={32}
        className="size-8 rounded-lg"
      />
      <span className="brand-word">
        Tech<span>Sutra</span>
      </span>
    </Link>
  );
}
