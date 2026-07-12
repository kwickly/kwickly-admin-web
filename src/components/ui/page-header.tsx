import React from "react";
import { useLocation } from "react-router-dom";
import { PageBreadcrumbs, type BreadcrumbItem } from "./breadcrumbs";

export interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  breadcrumbs?: BreadcrumbItem[];
  children?: React.ReactNode;
}

export function PageHeader({ title, description, icon: Icon, breadcrumbs, children }: PageHeaderProps) {
  const location = useLocation();

  let activeBreadcrumbs = breadcrumbs;
  
  if (!activeBreadcrumbs) {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    activeBreadcrumbs = pathSegments.map((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const segmentTitle = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { label: segmentTitle, href: url };
    });

    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      activeBreadcrumbs.push({
        label: tab.charAt(0).toUpperCase() + tab.slice(1).replace(/-/g, ' '),
        href: location.pathname + location.search
      });
    }
  }

  return (
    <div className="flex flex-col gap-4 mb-6">
      {activeBreadcrumbs && activeBreadcrumbs.length > 0 && (
        <PageBreadcrumbs items={activeBreadcrumbs} className="opacity-70 hover:opacity-100 transition-opacity" />
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            {Icon && <Icon className="h-6 w-6 text-primary" />}
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
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
