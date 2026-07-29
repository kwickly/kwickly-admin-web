interface TokenSwatchProps {
  label: string;
  token: string;
  textToken?: string;
  note?: string;
}

function TokenSwatch({ label, token, textToken = '--foreground', note }: TokenSwatchProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div
        className="h-14 rounded-lg border border-border/50 flex items-end p-2"
        style={{ background: `var(${token})` }}
      >
        <span
          className="text-[10px] font-mono font-semibold opacity-80"
          style={{ color: `var(${textToken})` }}
        >
          {token}
        </span>
      </div>
      <div>
        <p className="text-xs font-medium text-foreground">{label}</p>
        {note && <p className="text-[10px] text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}

interface TokenGroupProps {
  title: string;
  children: React.ReactNode;
}

function TokenGroup({ title, children }: TokenGroupProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {children}
      </div>
    </div>
  );
}

export function ColorPalette() {
  return (
    <div className="space-y-8">

      <TokenGroup title="Brand & Primary">
        <TokenSwatch label="Primary" token="--primary" textToken="--primary-foreground" note="Kwickly Red — CTAs, active states" />
        <TokenSwatch label="Primary Foreground" token="--primary-foreground" note="Text on primary bg" />
        <TokenSwatch label="Ring" token="--ring" textToken="--primary-foreground" note="Focus ring" />
      </TokenGroup>

      <TokenGroup title="Surfaces">
        <TokenSwatch label="Background" token="--background" note="Page canvas (60%)" />
        <TokenSwatch label="Card" token="--card" note="Component surface" />
        <TokenSwatch label="Popover" token="--popover" note="Dropdown / overlay bg" />
        <TokenSwatch label="Muted" token="--muted" note="Subtle bg for badges, tabs" />
        <TokenSwatch label="Input" token="--input" note="Form input background" />
      </TokenGroup>

      <TokenGroup title="Foregrounds & Text">
        <TokenSwatch label="Foreground" token="--foreground" textToken="--background" note="Primary text (dark on light)" />
        <TokenSwatch label="Card Foreground" token="--card-foreground" textToken="--card" note="Text on cards" />
        <TokenSwatch label="Muted Foreground" token="--muted-foreground" textToken="--background" note="Secondary / helper text" />
        <TokenSwatch label="Secondary" token="--secondary" textToken="--secondary-foreground" note="Secondary button bg" />
        <TokenSwatch label="Accent" token="--accent" note="Highlighted / hover bg" />
      </TokenGroup>

      <TokenGroup title="Borders">
        <TokenSwatch label="Border" token="--border" note="1px structural lines" />
      </TokenGroup>

      <TokenGroup title="Semantic Status">
        <TokenSwatch label="Destructive" token="--destructive" textToken="--destructive-foreground" note="Errors, delete actions" />
        <TokenSwatch label="Destructive Subtle" token="--destructive-subtle" note="Badge bg for errors" />
        <TokenSwatch label="Success" token="--success" textToken="--success-foreground" note="Available, completed" />
        <TokenSwatch label="Success Subtle" token="--success-subtle" note="Badge bg for success" />
        <TokenSwatch label="Warning" token="--warning" textToken="--warning-foreground" note="Occupied, pending" />
        <TokenSwatch label="Warning Subtle" token="--warning-subtle" note="Badge bg for warnings" />
        <TokenSwatch label="Info" token="--info" textToken="--info-foreground" note="In progress, info" />
        <TokenSwatch label="Info Subtle" token="--info-subtle" note="Badge bg for info" />
      </TokenGroup>

      <TokenGroup title="Sidebar">
        <TokenSwatch label="Sidebar" token="--sidebar" textToken="--sidebar-foreground" note="Deep navy shell" />
        <TokenSwatch label="Sidebar Primary" token="--sidebar-primary" textToken="--sidebar-primary-foreground" note="Active nav item" />
        <TokenSwatch label="Sidebar Accent" token="--sidebar-accent" textToken="--sidebar-accent-foreground" note="Hover nav item" />
        <TokenSwatch label="Sidebar Border" token="--sidebar-border" note="Sidebar divider" />
      </TokenGroup>

      <TokenGroup title="Charts">
        <TokenSwatch label="Chart 1" token="--chart-1" textToken="--background" note="Kwickly Blue" />
        <TokenSwatch label="Chart 2" token="--chart-2" textToken="--background" note="Kwickly Red" />
        <TokenSwatch label="Chart 3" token="--chart-3" note="Light Blue" />
        <TokenSwatch label="Chart 4" token="--chart-4" note="Light Coral" />
        <TokenSwatch label="Chart 5" token="--chart-5" textToken="--background" note="Deep Navy" />
      </TokenGroup>

      <TokenGroup title="Brand Injection (Runtime)">
        <TokenSwatch label="Brand Tint" token="--brand-tint" note="10% opacity tint for lists" />
        <TokenSwatch label="Brand Tint Hover" token="--brand-tint-hover" note="20% opacity hover tint" />
      </TokenGroup>
    </div>
  );
}
