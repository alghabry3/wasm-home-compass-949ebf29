import { Filter, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export interface FilterState {
  city: string;
  category: string;
  status: string;
  priceRange: [number, number];
  rooms: string;
}

interface PropertyFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  resultCount: number;
}

const cities = ["الكل", "الخبر", "الدمام", "الرياض", "جدة"];
const categories = ["الكل", "شقة", "فيلا", "أرض", "تجاري"];
const statuses = ["الكل", "للبيع", "للإيجار"];
const roomOptions = ["الكل", "1", "2", "3", "4", "5+"];

const PropertyFilters = ({ filters, onFilterChange, resultCount }: PropertyFiltersProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string | [number, number]) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFilterChange({
      city: "الكل",
      category: "الكل",
      status: "الكل",
      priceRange: [0, 5000000],
      rooms: "الكل",
    });
  };

  const hasActiveFilters =
    filters.city !== "الكل" ||
    filters.category !== "الكل" ||
    filters.status !== "الكل" ||
    filters.rooms !== "الكل" ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000000;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-soft mb-8">
      {/* Main Filters Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <Select value={filters.city} onValueChange={(v) => updateFilter("city", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="المدينة" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(v) => updateFilter("category", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="نوع العقار" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status} onValueChange={(v) => updateFilter("status", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.rooms} onValueChange={(v) => updateFilter("rooms", v)}>
          <SelectTrigger className="bg-background">
            <SelectValue placeholder="عدد الغرف" />
          </SelectTrigger>
          <SelectContent>
            {roomOptions.map((room) => (
              <SelectItem key={room} value={room}>
                {room === "الكل" ? "الكل" : `${room} غرف`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>فلاتر متقدمة</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
        </button>

        <div className="flex items-center gap-4">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-destructive hover:underline"
            >
              <X className="h-4 w-4" />
              إعادة ضبط
            </button>
          )}
          <span className="text-sm text-muted-foreground">
            {resultCount} عقار
          </span>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                نطاق السعر: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} ريال
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(v) => updateFilter("priceRange", v as [number, number])}
                min={0}
                max={5000000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>0</span>
                <span>5,000,000 ريال</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;
