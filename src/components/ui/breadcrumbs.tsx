
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
              <span className="text-foreground" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href || "#"}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )}

            {!isLast && (
              <ChevronRight className="h-4 w-4 mx-1.5 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
