import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export const YearButton = () => (
  <Button
    variant="ghost"
    size="sm"
    className="border border-gray-100 bg-white text-gray-500 hover:bg-gray-50"
    rightIcon={<ChevronDown className="h-4 w-4" />}
  >
    2025
  </Button>
);
