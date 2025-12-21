import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  const handleReset = () => {
    onChange(undefined);
    setOpen(false);
  };

  const buttonClassName = variant === "hero"
    ? "h-12 bg-white/10 border-white/20 text-white hover:bg-white/20 gap-2"
    : variant === "header"
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
              onClick={handleReset}
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
