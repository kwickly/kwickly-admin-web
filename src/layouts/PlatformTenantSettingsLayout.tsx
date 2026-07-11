import { Outlet, NavLink, useParams } from 'react-router-dom';
import { Palette, CheckCircle2, Sliders, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlatformTenantSettingsLayout() {
  const { tenantId } = useParams();

  const navItems = [
    { name: 'Feature Toggles', path: `/platform/tenants/${tenantId}/settings/features`, icon: Sliders },
    { name: 'Branding & Theme', path: `/platform/tenants/${tenantId}/settings/branding`, icon: Palette },
    { name: 'White Labeling', path: `/platform/tenants/${tenantId}/settings/whitelabel`, icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-[1400px] mx-auto pb-20 space-y-8 animate-in fade-in duration-300">
      
      <div className="flex items-center gap-4">
        <Link to="/platform/tenants" className="p-2 -ml-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Tenant Configuration</h2>
          <p className="text-muted-foreground mt-1">Manage platform-level overrides and enterprise configurations.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Sub-Sidebar Navigation */}
        <div className="flex flex-col gap-2 w-full lg:w-64 shrink-0 overflow-x-auto pb-2 lg:pb-0">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}
