import React from "react";
import { 
  Sparkles, 
  Coffee, 
  GlassWater, 
  Flame, 
  IceCream, 
  UtensilsCrossed,
  CupSoda,
  Wine,
  Cake,
  Sandwich
} from "lucide-react";

export function getCategoryIcon(iconName, className = "w-5 h-5") {
  switch (iconName) {
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Coffee":
      return <Coffee className={className} />;
    case "GlassWater":
    case "CupSoda":
      return <GlassWater className={className} />;
    case "Flame":
      return <Flame className={className} />;
    case "IceCream":
      return <IceCream className={className} />;
    case "UtensilsCrossed":
      return <UtensilsCrossed className={className} />;
    case "Cake":
      return <Cake className={className} />;
    case "Sandwich":
      return <Sandwich className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}
