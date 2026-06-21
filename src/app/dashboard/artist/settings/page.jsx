import { Settings, Wrench } from "lucide-react";

const ArtistSettingsPage = () => {
  return (
    <div className="flex h-full min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="absolute -inset-4 animate-pulse rounded-full bg-primary/20 blur-xl"></div>
        <div className="relative flex size-24 items-center justify-center rounded-3xl border border-separator/60 bg-background/50 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-none">
          <Settings className="size-10 text-primary animate-[spin_6s_linear_infinite]" />
          <Wrench className="absolute -bottom-2 -right-2 size-8 text-muted-foreground bg-background rounded-full p-1.5 border border-separator" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Settings Coming Soon
      </h1>
      
      <p className="mx-auto mt-4 max-w-md text-base text-muted-foreground">
        We are currently building out the settings dashboard. Check back later for account preferences, notifications, and security controls.
      </p>

      <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-separator bg-accent/30 px-4 py-2 text-sm font-medium text-muted-foreground">
        <div className="size-2 rounded-full bg-amber-500 animate-pulse"></div>
        Under Construction
      </div>
    </div>
  );
}

export default ArtistSettingsPage;
