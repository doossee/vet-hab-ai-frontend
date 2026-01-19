"use client";

import { UserCog } from "lucide-react";
import { useTranslations } from "next-intl";
import { managementLinks } from "@/shared/constants";
import { Button } from "@/shared/components/ui/button";
// import { ModeToggle } from "@/shared/components/theme-toggler";
import { LogoutButton } from "@/shared/components/logout-button";
import { ToggleLocale } from "@/shared/components/toggle-locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { Link, usePathname } from "@/shared/i18n/routing";
import { cn } from "@/shared/lib/utils";
import { useAuthData } from "@/shared/hooks/use-auth-data";
import { useEffect, useState } from "react";

export function UserMenu() {
  const t = useTranslations();
  const pathname = usePathname();
  const { userData } = useAuthData();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(userData?.userRole === "ADMIN");
  }, [userData]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size={"icon"} variant={"outline"}>
          <UserCog />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2! max-w-[230px] mr-4!">
        <div className="flex flex-col gap-2">
          <ToggleLocale />
          <hr />
          <LogoutButton />
          {/* <hr /> */}
          {/* <ModeToggle /> */}
          {
            isAdmin && <>
              <hr />
              {
                managementLinks.map(link => (
                  <Link key={link.url} href={link.url}>
                    <Button 
                      variant="ghost" 
                      className={cn(
                        "w-full justify-start",
                        pathname === link.url
                          ? "bg-primary hover:bg-primary/80 text-primary-foreground"
                          : ""
                      )}
                    >
                      <div>
                        <link.icon className="mr-2 h-4 w-4" />
                      </div>
                      {t(link.title)}
                    </Button>
                  </Link>
                ))
              }
            </> 
          }
        </div>
      </PopoverContent>
    </Popover>
  );
}
