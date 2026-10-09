"use client";

import { motion } from "motion/react";
import { useCallback, useRef } from "react";

import { CopyButton } from "@/components/copy-button";
import { getIconForPackageManager } from "@/components/icons";
import { RegistryAddButton } from "@/components/registry-add-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TextFlip } from "@/components/ui/text-flip";
import { SITE } from "@/constants/site";
import type { PackageManager } from "@/hooks/use-package-manager";
import { usePackageManager } from "@/hooks/use-package-manager";
import { cn } from "@/lib/utils";
import registry from "@/registry.json";

const pmCommands = {
  bun: "bunx --bun",
  npm: "npx",
  pnpm: "pnpm dlx",
  yarn: "yarn",
};

const registryItemNames = registry.items
  .map((item) => item.name)
  .toSorted((a, b) =>
    a.localeCompare(b, "en", {
      sensitivity: "base",
    })
  );

export const CommandBox = ({ className }: { className?: string }) => {
  const [packageManager, setPackageManager] = usePackageManager();

  const currentItemRef = useRef(registryItemNames[0]);

  const handlePackageManagerChange = useCallback(
    (value: string) => {
      setPackageManager(value as PackageManager);
    },
    [setPackageManager]
  );

  return (
    <div
      className={cn(
        "bg-code text-code-foreground relative overflow-hidden rounded-lg text-sm",
        className
      )}
    >
      <Tabs
        className="gap-0"
        onValueChange={handlePackageManagerChange}
        value={packageManager}
      >
        <div className="border-border/50 flex items-center gap-2 border-b px-3 py-1">
          <TabsList className="hidden rounded-none bg-transparent p-0 md:inline-flex [&_svg]:me-2 [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForPackageManager(packageManager)}

            {Object.entries(pmCommands).map(([key]) => (
              <TabsTrigger
                key={key}
                className="data-[state=active]:border-input h-7 border border-transparent pt-0.5 data-[state=active]:shadow-none"
                sound="tabSwitch"
                value={key}
              >
                {key}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="flex items-center gap-2 md:hidden">
            {getIconForPackageManager(packageManager)}
            <Select
              onValueChange={handlePackageManagerChange}
              value={packageManager}
            >
              <SelectTrigger
                aria-label="Package manager"
                size="sm"
                className="font-sans bg-background px-2.5 my-0.5 shadow-none dark:bg-background dark:hover:bg-background"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(pmCommands).map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <pre className="-translate-y-px px-4 py-3.5">
          <code
            data-language="bash"
            className="text-left block font-mono text-sm text-muted-foreground max-sm:leading-6"
          >
            {Object.entries(pmCommands).map(([key, command]) => (
              <TabsContent key={key} value={key} asChild>
                <span className="block sm:inline-block">
                  <span className="select-none">$ </span>
                  {command} shadcn add{" "}
                  <span className="select-none sm:hidden" aria-hidden="true">
                    \
                  </span>
                </span>
              </TabsContent>
            ))}

            <span>{SITE.REGISTRY}/</span>

            <TextFlip
              className="text-foreground"
              as={motion.span}
              variants={{
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 12 },
                initial: { opacity: 0, y: -12 },
              }}
              interval={1.5}
              onIndexChange={(index: number) => {
                currentItemRef.current = registryItemNames[index];
              }}
            >
              {registryItemNames}
            </TextFlip>
          </code>
        </pre>
      </Tabs>

      <RegistryAddButton
        registry={SITE.REGISTRY}
        className="absolute top-2 right-10 z-10 w-7 h-7 sm:w-auto gap-1.5 border-none px-2 opacity-70 hover:opacity-100 focus-visible:opacity-100 [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-3.5"
        variant="ghost"
        size="sm"
      />

      <CopyButton
        className="absolute top-2 right-2 z-10 size-7 opacity-70 hover:opacity-100 focus-visible:opacity-100"
        value={() =>
          `${pmCommands[packageManager]} shadcn@latest add ${SITE.REGISTRY}/${currentItemRef.current}`
        }
        event="copy_npm_command"
      />
    </div>
  );
};
