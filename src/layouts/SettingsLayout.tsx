import { Outlet } from "react-router-dom";

export default function SettingsLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
}
