import NotificationBell from "./NotificationBell";
import UserMenu from "./UserMenu";

import { useAppShellContext } from "../context/AppShellContext";
import { usePageMetadata } from "../hooks/usePageMetadata";

const TopBar = () => {
  const { user, tenant } = useAppShellContext();

  const { title, description } = usePageMetadata();

  return (
    <header className="flex h-20 items-center justify-between border-b bg-background px-8">
      <div>
        <h1 className="text-2xl font-bold">
          {title}
        </h1>

        <p className="text-sm text-muted-foreground">
          {description}

          {tenant && (
            <>
              {" "}
              •{" "}
              <span className="font-medium">
                {tenant.name}
              </span>
            </>
          )}

          {user && (
            <>
              {" "}
              • Welcome back{" "}
              <span className="font-medium">
                {user.name}
              </span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-6">
        <NotificationBell />

        <UserMenu />
      </div>
    </header>
  );
};

export default TopBar;