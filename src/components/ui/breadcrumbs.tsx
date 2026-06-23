import React from "react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface PageBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PageBreadcrumbs({ items, className }: PageBreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm font-medium", className)} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isCurrent = item.current || isLast;

        return (
          <div key={index} className="flex items-center">
            {isCurrent ? (
              <span className="text-slate-800 dark:text-zinc-200" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href || "#"}
                className="text-slate-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 transition-colors"
              >
                {item.label}
              </Link>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 mx-1.5 text-slate-400 dark:text-zinc-600 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
