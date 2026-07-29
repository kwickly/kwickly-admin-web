export function generateOklchTheme(hue: number, baseChroma: number) {
  // Clamp baseChroma between 0 and 0.3
  const c = Math.max(0, Math.min(0.3, baseChroma));
  const h = hue;

  // We subtly tint neutral surfaces with a fraction of the primary chroma
  const tintC = c * 0.15;
  const mutedC = c * 0.25;

  return {
    light: {
      '--background': `oklch(0.99 ${tintC} ${h})`,
      '--foreground': `oklch(0.14 ${tintC} ${h})`,
      '--card': `oklch(0.99 ${tintC} ${h})`,
      '--card-foreground': `oklch(0.14 ${tintC} ${h})`,
      '--popover': `oklch(1.00 0 0)`,
      '--popover-foreground': `oklch(0.14 ${tintC} ${h})`,
      '--primary': `oklch(0.55 ${c} ${h})`,
      '--primary-foreground': `oklch(0.98 0 0)`,
      '--secondary': `oklch(0.56 0.153 257.4)`, /* Kwickly Blue */
      '--secondary-foreground': `oklch(0.98 0 0)`,
      '--muted': `oklch(0.96 ${mutedC} ${h})`,
      '--muted-foreground': `oklch(0.55 ${mutedC} ${h})`,
      '--accent': `oklch(0.96 ${mutedC} ${h})`,
      '--accent-foreground': `oklch(0.20 ${mutedC} ${h})`,
      '--destructive': `oklch(0.45 0.18 15)`, /* Deeper crimson to contrast with brand red */
      '--destructive-foreground': `oklch(0.98 0 0)`,
      '--border': `oklch(0.90 ${tintC} ${h})`,
      '--input': `oklch(0.90 ${tintC} ${h})`,
      '--ring': `oklch(0.55 ${c} ${h})`,
      
      // Charts: Pulled back to the Red/Blue brand pair
      '--chart-1': `oklch(0.56 0.153 257.4)`, /* Kwickly Blue */
      '--chart-2': `oklch(0.551 0.203 26.6)`, /* Kwickly Red */
      '--chart-3': `oklch(0.85 0.08 257.4)`, /* Light Blue */
      '--chart-4': `oklch(0.85 0.10 26.6)`, /* Light Red/Coral */
      '--chart-5': `oklch(0.25 0.06 252.0)`, /* Deep Navy */

      // Sidebar
      '--sidebar': `oklch(0.98 ${tintC} ${h})`,
      '--sidebar-foreground': `oklch(0.14 ${tintC} ${h})`,
      '--sidebar-primary': `oklch(0.55 ${c} ${h})`,
      '--sidebar-primary-foreground': `oklch(0.98 0 0)`,
      '--sidebar-accent': `oklch(0.95 ${mutedC} ${h})`,
      '--sidebar-accent-foreground': `oklch(0.20 ${mutedC} ${h})`,
      '--sidebar-border': `oklch(0.90 ${tintC} ${h})`,
      '--sidebar-ring': `oklch(0.55 ${c} ${h})`,
    },
    dark: {
      '--background': `oklch(0.14 ${tintC} ${h})`,
      '--foreground': `oklch(0.98 ${tintC} ${h})`,
      '--card': `oklch(0.16 ${tintC} ${h})`,
      '--card-foreground': `oklch(0.98 ${tintC} ${h})`,
      '--popover': `oklch(0.14 ${tintC} ${h})`,
      '--popover-foreground': `oklch(0.98 ${tintC} ${h})`,
      '--primary': `oklch(0.65 ${c} ${h})`,
      '--primary-foreground': `oklch(0.14 ${tintC} ${h})`,
      '--secondary': `oklch(0.56 0.153 257.4)`,
      '--secondary-foreground': `oklch(0.98 0 0)`,
      '--muted': `oklch(0.22 ${mutedC} ${h})`,
      '--muted-foreground': `oklch(0.70 ${mutedC} ${h})`,
      '--accent': `oklch(0.22 ${mutedC} ${h})`,
      '--accent-foreground': `oklch(0.98 ${mutedC} ${h})`,
      '--destructive': `oklch(0.45 0.18 15)`, /* Deeper crimson to contrast with brand red */
      '--destructive-foreground': `oklch(0.98 0 0)`,
      '--border': `oklch(0.25 ${tintC} ${h})`,
      '--input': `oklch(0.25 ${tintC} ${h})`,
      '--ring': `oklch(0.65 ${c} ${h})`,

      // Charts (Dark)
      '--chart-1': `oklch(0.56 0.153 257.4)`, /* Kwickly Blue */
      '--chart-2': `oklch(0.551 0.203 26.6)`, /* Kwickly Red */
      '--chart-3': `oklch(0.85 0.08 257.4)`, /* Light Blue */
      '--chart-4': `oklch(0.85 0.10 26.6)`, /* Light Red/Coral */
      '--chart-5': `oklch(0.25 0.06 252.0)`, /* Deep Navy */

      // Sidebar (Dark)
      '--sidebar': `oklch(0.16 ${tintC} ${h})`,
      '--sidebar-foreground': `oklch(0.98 ${tintC} ${h})`,
      '--sidebar-primary': `oklch(0.65 ${c} ${h})`,
      '--sidebar-primary-foreground': `oklch(0.98 0 0)`,
      '--sidebar-accent': `oklch(0.22 ${mutedC} ${h})`,
      '--sidebar-accent-foreground': `oklch(0.98 ${mutedC} ${h})`,
      '--sidebar-border': `oklch(0.25 ${tintC} ${h})`,
      '--sidebar-ring': `oklch(0.65 ${c} ${h})`,
    }
  };
}
