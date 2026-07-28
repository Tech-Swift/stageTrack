import { TriangleAlert } from "lucide-react";

interface AppErrorProps {
  error: Error;
}

const AppError = ({
  error,
}: AppErrorProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="max-w-md text-center">

        <TriangleAlert className="mx-auto mb-4 h-12 w-12 text-destructive" />

        <h2 className="text-xl font-semibold">
          Unable to load StageTrack
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    </div>
  );
};

export default AppError;