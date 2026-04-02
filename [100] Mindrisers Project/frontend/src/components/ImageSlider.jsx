import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import banner1 from "../assets/oppobanner.webp";
import banner2 from "../assets/shirtbanner.webp";
import banner3 from "../assets/bammer3.webp";
import banner4 from "../assets/banner4.webp";

const slides = [
  { img: banner1, to: "/category/smartphones" },
  { img: banner2, to: "/category/mens-shirts" }, // ✅ change this if your category is different
  { img: banner3, to: "/category/smartphones" },
  { img: banner4, to: "/category/smartphones" },
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative h-64 overflow-hidden rounded-xl mt-3 group w-[98%] m-auto">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <Link key={index} to={slide.to} className="w-full h-64 shrink-0">
            <img
              src={slide.img}
              className="w-full h-64 object-cover"
              alt="slider"
            />
          </Link>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 
                   bg-white/80 p-2 rounded-full
                   opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"
      >
        <ChevronLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 
                   bg-white/80 p-2 rounded-full
                   opacity-0 group-hover:opacity-100
                   transition-opacity duration-300"
      >
        <ChevronRight />
      </button>
    </div>
  );
}
