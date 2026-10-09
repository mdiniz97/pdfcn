"use client";

import { useCallback, useMemo, useState } from "react";

import { CopyButton } from "@/components/copy-button";
import { getIconForCommandTab } from "@/components/icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { PackageManager } from "@/hooks/use-package-manager";
import { usePackageManager } from "@/hooks/use-package-manager";
import type { Event } from "@/lib/events";
import { cn } from "@/lib/utils";

type CommandTab = PackageManager | "shadcn" | "prompt";

const SHADCN_NPX_PREFIX = "npx shadcn@latest ";

export const CodeBlockCommand = ({
  __npm__,
  __yarn__,
  __pnpm__,
  __bun__,
  className,
  copyEvent = "copy_npm_command",
}: {
  __npm__?: string;
  __yarn__?: string;
  __pnpm__?: string;
  __bun__?: string;
  className?: string;
  copyEvent?: Event["name"];
}) => {
  const [packageManager, setPackageManager] = usePackageManager();
  const [commandTab, setCommandTab] = useState<CommandTab | null>(null);

  const tabs = useMemo(() => {
    const packageManagerTabs = [
      { command: __bun__, value: "bun" },
      { command: __npm__, value: "npm" },
      { command: __pnpm__, value: "pnpm" },
      { command: __yarn__, value: "yarn" },
    ] satisfies { command: string | undefined; value: CommandTab }[];

    if (!__npm__?.startsWith(SHADCN_NPX_PREFIX)) {
      return packageManagerTabs;
    }

    return [
      {
        command: `Run \`${__npm__}\` in this project to install it with the shadcn CLI. Don't rewrite the files it adds; if the command fails, show me the error.`,
        value: "prompt",
      },
      {
        command: __npm__.replace(SHADCN_NPX_PREFIX, "shadcn "),
        value: "shadcn",
      },
      ...packageManagerTabs,
    ];
  }, [__bun__, __npm__, __pnpm__, __yarn__]);

  const handleTabChange = useCallback(
    (value: string) => {
      const tab = value as CommandTab;
      setCommandTab(tab);

      if (tab === "npm" || tab === "yarn" || tab === "pnpm" || tab === "bun") {
        setPackageManager(tab);
      }
    },
    [setPackageManager]
  );

  const selectedTab = commandTab ?? packageManager;
  const activeTab = tabs.some((tab) => tab.value === selectedTab)
    ? selectedTab
    : "npm";
  const copyValue = tabs.find((tab) => tab.value === activeTab)?.command ?? "";
  const isPromptTab = activeTab === "prompt";

  return (
    <div
      className={cn(
        "bg-code text-code-foreground relative overflow-hidden rounded-lg text-sm",
        className
      )}
    >
      <Tabs className="gap-0" onValueChange={handleTabChange} value={activeTab}>
        <div className="border-border/50 flex items-center gap-2 border-b px-3 py-1">
          <TabsList className="hidden rounded-none bg-transparent p-0 md:inline-flex [&_svg]:me-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForCommandTab(activeTab)}

            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                className="data-[state=active]:border-input h-7 border border-transparent pt-0.5 data-[state=active]:shadow-none"
                sound="tabSwitch"
                value={tab.value}
              >
                {tab.value}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2 md:hidden">
            {getIconForCommandTab(activeTab)}
            <Select onValueChange={handleTabChange} value={activeTab}>
              <SelectTrigger
                aria-label="Command"
                size="sm"
                className="font-sans bg-background px-2.5 my-0.5 shadow-none dark:bg-background dark:hover:bg-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={cn("no-scrollbar", !isPromptTab && "overflow-x-auto")}>
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              className="mt-0 px-4 py-3.5"
              value={tab.value}
            >
              {tab.value === "prompt" ? (
                <p
                  data-slot="code-block"
                  className="text-sm/relaxed whitespace-normal"
                >
                  {tab.command}
                </p>
              ) : (
                <pre>
                  <code
                    data-slot="code-block"
                    data-language="bash"
                    className="font-mono text-sm/none"
                  >
                    <span className="select-none">$ </span>
                    {tab.command}
                  </code>
                </pre>
              )}
            </TabsContent>
          ))}
        </div>
      </Tabs>
      <CopyButton
        className="absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
        value={copyValue}
        event={isPromptTab ? "copy_agent_prompt" : copyEvent}
      />
    </div>
  );
};
