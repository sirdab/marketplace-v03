import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { type PropertyPurpose } from "@shared/schema";

const purposes: PropertyPurpose[] = ["buy", "rent", "daily_rent"];

interface PurposeFilterProps {
  value: PropertyPurpose | undefined;
  onChange: (value: PropertyPurpose | undefined) => void;
  variant?: "hero" | "header" | "default";
}

export function PurposeFilter({ value, onChange, variant = "default" }: PurposeFilterProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const getPurposeLabel = (purpose: PropertyPurpose | undefined) => {
    if (!purpose) return t("purpose.rent");
    switch (purpose) {
      case "buy":
        return t("purpose.buy");
      case "rent":
        return t("purpose.rent");
      case "daily_rent":
        return t("purpose.dailyRental");
    }
  };

  const handleSelect = (purpose: PropertyPurpose) => {
    onChange(purpose);
    setOpen(false);
  };

  if (variant === "hero") {
    return (
      <div className="inline-flex bg-white/10 backdrop-blur-md p-1 rounded-full border border-white/20 mb-6">
        {purposes.map((purpose) => (
          <button
            key={purpose}
            type="button"
            onClick={() => onChange(purpose)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              (value === purpose || (!value && purpose === "rent"))
                ? "bg-white text-primary shadow-sm"
                : "text-white hover:bg-white/10"
            )}
          >
            {getPurposeLabel(purpose)}
          </button>
        ))}
      </div>
    );
  }

  const buttonClassName = variant === "header"
    ? "h-9 gap-2"
    : "h-10 gap-2";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={buttonClassName}
          data-testid="button-purpose-filter"
        >
          {getPurposeLabel(value)}
          <ChevronDown className="h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground px-2 py-1">
            {t("purpose.title")}
          </p>
          {purposes.map((purpose) => (
            <Button
              key={purpose}
              variant={value === purpose ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleSelect(purpose)}
              data-testid={`button-purpose-${purpose}`}
            >
              {getPurposeLabel(purpose)}
            </Button>
          ))}
          <div className="border-t pt-2 mt-2 flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
              data-testid="button-purpose-reset"
            >
              {t("common.reset")}
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => setOpen(false)}
              data-testid="button-purpose-done"
            >
              {t("common.done")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
