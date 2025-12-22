import { MapPin, BedDouble, Bath, Maximize, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Property {
  id: number;
  name: string;
  city: string;
  district: string;
  price: string;
  priceNum: number;
  image: string;
  type: string;
  rooms: number;
  bathrooms: number;
  area: number;
  status: "للبيع" | "للإيجار" | "محجوز";
  category: "شقة" | "فيلا" | "أرض" | "تجاري";
  developer: string;
  features: string[];
}

interface PropertyCardProps {
  property: Property;
  index?: number;
}

const PropertyCard = ({ property, index = 0 }: PropertyCardProps) => {
  const statusColor = {
    "للبيع": "bg-green-500",
    "للإيجار": "bg-blue-500",
    "محجوز": "bg-red-500",
  };

  return (
    <div
      className="group bg-card rounded-2xl overflow-hidden shadow-soft card-hover animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-wrap gap-2">
          <Badge className={`${statusColor[property.status]} text-white border-0`}>
            {property.status}
          </Badge>
          <Badge variant="secondary" className="bg-card/90 text-foreground">
            {property.category}
          </Badge>
        </div>

        {/* Quick Contact */}
        <a
          href="https://wa.me/966920017195"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 left-4 p-2 bg-accent rounded-full text-accent-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          aria-label="تواصل واتساب"
        >
          <Phone className="h-4 w-4" />
        </a>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <MapPin className="h-4 w-4" />
          <span>{property.district}، {property.city}</span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-1">
          {property.name}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.rooms > 0 && (
            <div className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" />
              <span>{property.rooms}</span>
            </div>
          )}
          {property.bathrooms > 0 && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{property.area} م²</span>
          </div>
        </div>

        {/* Features */}
        {property.features.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {property.features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">يبدأ من</span>
            <div className="text-xl font-bold text-accent">
              {property.price} <span className="text-sm">ر.س</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-colors">
            التفاصيل
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
