import Link from "next/link";

export default function PrimaryBtn({ href, children }) {
  return (
    <Link
      className="inline-flex items-center justify-center gap-3 font-medium text-md text-text-secondary uppercase py-4 px-8 rounded border border-bg-accent transition-all duration-150 hover:bg-white/20"
      href={href}
    >
      {children}
    </Link>
  );
}
