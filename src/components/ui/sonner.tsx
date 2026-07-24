import { Icons } from '@/components/shared/icons';
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"


const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <Icons.CircleCheckIcon className="size-4" />
        ),
        info: (
          <Icons.InfoIcon className="size-4" />
        ),
        warning: (
          <Icons.TriangleAlertIcon className="size-4" />
        ),
        error: (
          <Icons.OctagonXIcon className="size-4" />
        ),
        loading: (
          <Icons.Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
