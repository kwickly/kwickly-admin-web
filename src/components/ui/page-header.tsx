import React from "react";
import { PageBreadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, breadcrumbs, children }: PageHeaderProps) {

  return (
    <div className="flex flex-col gap-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <PageBreadcrumbs items={breadcrumbs} className="opacity-70 hover:opacity-100 transition-opacity" />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
            {Icon && (
              <div className="p-1.5 bg-secondary/10 rounded-md border border-secondary/20 mr-1">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
            )}
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex-shrink-0 flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
