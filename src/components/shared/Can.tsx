import React from "react";
import { useHasPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";

interface CanProps {
  perform: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ perform, children, fallback = null }) => {
  const canPerform = useHasPermission(perform);

  if (!canPerform) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
