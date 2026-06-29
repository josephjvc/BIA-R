import { useNavigate } from "react-router";
import { User, Building, LogOut, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "../../shared/store/auth.store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";

export function UserMenu({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0A2540" }}>{user?.displayName}</div>
            <div style={{ fontSize: 12, color: "#64748B" }}>{user?.email}</div>
            {user?.organizationName && (
              <div className="flex items-center gap-1.5 mt-1" style={{ fontSize: 11, color: "#94A3B8" }}>
                <Building className="size-3" strokeWidth={1.75} />
                {user.organizationName}
              </div>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => navigate("/settings")}>
          <User className="size-4" strokeWidth={1.75} />
          Profile
        </DropdownMenuItem>

        {user?.organizationName && (
          <DropdownMenuItem onClick={() => navigate("/settings")}>
            <Building className="size-4" strokeWidth={1.75} />
            Organization
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {theme === "dark" ? (
              <Moon className="size-4" strokeWidth={1.75} />
            ) : theme === "system" ? (
              <Monitor className="size-4" strokeWidth={1.75} />
            ) : (
              <Sun className="size-4" strokeWidth={1.75} />
            )}
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light">
                <Sun className="size-4" strokeWidth={1.75} />
                Light
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">
                <Moon className="size-4" strokeWidth={1.75} />
                Dark
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">
                <Monitor className="size-4" strokeWidth={1.75} />
                System
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleLogout} variant="destructive">
          <LogOut className="size-4" strokeWidth={1.75} />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
