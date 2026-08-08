import type { ReactNode } from "react";

interface DashboardPageProps {
  children: ReactNode;
  className?: string;
}

const DashboardPage = ({
  children,
  className,
}: DashboardPageProps) => {
  return (
    <main
      className={[
        "w-full space-y-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </main>
  );
};

export default DashboardPage;