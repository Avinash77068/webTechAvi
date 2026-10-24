import Image from "next/image";
import Link from "next/link";

export function Brand({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="TechSutra home" className={`inline-flex shrink-0 items-center gap-2.5 ${className}`}>
      <span className="brand-mark" aria-hidden="true">
       <Link href="/" className="flex shrink-0 items-center gap-2 font-semibold tracking-tight">
          <Image src="/logo.png" alt="" width={32} height={32} className="size-8 rounded-lg" priority />
        </Link>
      </span>
      <span className="brand-word">
        Tech<span>Sutra</span>
      </span>
    </Link>
  );
}
