import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-accent/30 text-primary">
        <FileQuestion className="size-12" />
      </div>
      <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
        Page Not Found
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        Oops! We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <ArrowLeft className="size-4" />
        Return Home
      </Link>
    </div>
  );
}
