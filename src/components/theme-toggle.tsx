"use client";

import { MonitorIcon, MoonStarIcon, SunMediumIcon } from "lucide-react";
import { useTheme } from "next-themes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";

const themeOptions = [
  { value: "light", label: "Light", icon: SunMediumIcon },
  { value: "dark", label: "Dark", icon: MoonStarIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const currentTheme = theme ?? "system";
  const activeOption =
    themeOptions.find((option) => option.value === currentTheme) ??
    themeOptions[2];
  const ActiveIcon = activeOption.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          tooltip={activeOption.label}
          className="gap-x-4 h-10 px-4"
        >
          <ActiveIcon className="size-4" />
          <span>{activeOption.label}</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup
          value={currentTheme}
          onValueChange={(value) => setTheme(value)}
        >
          {themeOptions.map((option) => {
            const OptionIcon = option.icon;

            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <OptionIcon className="size-4" />
                {option.label}
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}