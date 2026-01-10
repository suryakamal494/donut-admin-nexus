// AI Recommendations Carousel Component
// Swipeable carousel on mobile with dot indicators, grid on desktop

import { Sparkles } from "lucide-react";
import { aiRecommendations } from "@/data/student/dashboard";
import AIRecommendationCard from "./AIRecommendationCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const AIRecommendationsCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="mb-6">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-donut-coral to-donut-orange flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h2 className="font-semibold text-foreground text-sm">AI Suggestions</h2>
      </div>

      {/* Mobile/Tablet: Swipeable Carousel */}
      <div className="lg:hidden">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-3">
            {aiRecommendations.map((rec) => (
              <CarouselItem key={rec.id} className="pl-3 basis-[88%] sm:basis-[75%]">
                <AIRecommendationCard recommendation={rec} compact />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Dot Indicators */}
        <div className="flex justify-center gap-1.5 mt-3">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                current === index 
                  ? "bg-donut-coral w-4" 
                  : "bg-muted-foreground/30"
              )}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-3">
        {aiRecommendations.map((rec) => (
          <AIRecommendationCard key={rec.id} recommendation={rec} compact />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsCarousel;
