
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

export const ImageCarousel = ({ images, className = "" }: ImageCarouselProps) => {
  return (
    <div className={`w-full max-w-xs mx-auto ${className}`}>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=400&h=300`}
                    alt={`Tech image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
