"use client";

import { cn } from "@/lib/utils";
import { ChevronUp } from "lucide-react";
import React, { createContext, useContext, useState, ReactNode } from "react";

type AccordionContextType = {
  openItems: string[];
  toggleItem: (value: string) => void;
  mode: "single" | "multiple";
  orientation?: "horizontal" | "vertical";
};

const AccordionContext = createContext<AccordionContextType | null>(null);
const ItemValueContext = createContext<string | null>(null);

function Accordion({
  children,
  mode = "single",
  orientation = "vertical",
  className,
  ...props
}: {
  children: ReactNode;
  mode: "single" | "multiple";
  orientation?: "horizontal" | "vertical";
} & React.ComponentProps<"div">) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const isOpen = prev.includes(value);
      if (mode === "multiple") {
        return isOpen ? prev.filter((v) => v !== value) : [...prev, value];
      } else {
        return isOpen ? [] : [value];
      }
    });
  };

  return (
    <AccordionContext.Provider
      value={{ openItems, toggleItem, mode, orientation }}
    >
      <div
        aria-label="accordion"
        data-slot="accordion"
        data-orientation={orientation}
        className={cn("w-full", className)}
        {...props}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

function Item({
  children,
  value,
  className,
  ...props
}: {
  children: ReactNode;
  value: string;
} & React.ComponentProps<"div">) {
  const ctx = useContext(AccordionContext);
  if (!ctx) return null;
  const isOpen = ctx.openItems.includes(value);
  return (
    <ItemValueContext.Provider value={value}>
      <div
        className={cn("border-b last:border-b-0", className)}
        data-slot="accordion-item"
        data-state={isOpen ? "open" : "closed"}
        data-orientation={ctx.orientation}
        {...props}
      >
        {children}
      </div>
    </ItemValueContext.Provider>
  );
}

function Header({
  children,
  className,
  ...props
}: { children: ReactNode } & React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("flex", className)}
      data-slot="accordion-header"
      {...props}
    >
      {children}
    </h3>
  );
}

function Trigger({
  children,
  className,
  onClick,
  ...props
}: { children: ReactNode } & React.ComponentProps<"button">) {
  const ctx = useContext(AccordionContext);
  const itemValue = useContext(ItemValueContext);

  if (!ctx || !itemValue) return null;

  const isOpen = ctx.openItems.includes(itemValue);

  return (
    <button
      className={cn(
        `focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 px-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180`,
        className
      )}
      data-slot="accordion-trigger"
      data-state={isOpen ? "open" : "closed"}
      data-orientation={ctx.orientation}
      aria-expanded={isOpen}
      onClick={(event) => {
        ctx.toggleItem(itemValue);
        onClick?.(event);
      }}
      {...props}
    >
      {children} <ChevronUp />
    </button>
  );
}

function Content({
  children,
  className,
  ...props
}: { children: ReactNode } & React.ComponentProps<"div">) {
  const ctx = useContext(AccordionContext);
  const itemValue = useContext(ItemValueContext);

  const contentRef = React.useRef<HTMLDivElement>(null);

  if (!ctx || !itemValue) return null;

  const isOpen = ctx.openItems.includes(itemValue);

  return (
    <div
      ref={contentRef}
      style={{
        maxHeight: contentRef.current && isOpen ? `${contentRef.current.scrollHeight}px` : "0px",
        overflow: "hidden",
        transition: "max-height 0.3s ease-in-out",
      }}
      className={cn("text-sm text-slate-500", className)}
      data-slot="accordion-content"
      data-state={isOpen ? "open" : "closed"}
      data-orientation={ctx.orientation}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </div>
  );
}
Accordion.Item = Item;
Accordion.Header = Header;
Accordion.Trigger = Trigger;
Accordion.Content = Content;
Accordion.displayName = "Accordion";

export { Accordion };
