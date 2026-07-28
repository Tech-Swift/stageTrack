import { Loader2 } from "lucide-react";

const AppLoader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />

        <div className="text-center">
          <h2 className="text-lg font-semibold">
            Loading StageTrack
          </h2>

          <p className="text-sm text-muted-foreground">
            Preparing your workspace...
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;