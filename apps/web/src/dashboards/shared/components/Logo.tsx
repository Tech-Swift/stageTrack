import { Link } from "react-router-dom";

import { useAppShellContext } from "../context/AppShellContext";

const Logo = () => {
  const { branding, tenant } = useAppShellContext();

  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-3 px-6 py-5 border-b"
    >
      {branding?.logoUrl ? (
        <img
          src={branding.logoUrl}
          alt={tenant?.name ?? "StageTrack"}
          className="h-10 w-10 rounded-lg object-cover"
        />
      ) : (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white font-bold"
          style={{
            backgroundColor: branding?.primaryColor,
          }}
        >
          ST
        </div>
      )}

      <div>
        <h2 className="font-semibold">
          {tenant?.name ?? "StageTrack"}
        </h2>

        <p className="text-xs text-muted-foreground">
          Transport Management
        </p>
      </div>
    </Link>
  );
};

export default Logo;