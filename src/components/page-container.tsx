import { ReactNode } from "react";

interface PageContainerProps {
  background: ReactNode;
  title: ReactNode;
  children: ReactNode;
}

export function PageContainer({
  background,
  title,
  children,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] p-8 relative overflow-hidden">
      {background}

      <div className="relative z-10">
        <div className="mb-8">{title}</div>
        {children}
      </div>
    </div>
  );
}
