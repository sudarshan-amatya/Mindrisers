import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { ChevronRight, ChevronLeft } from "lucide-react";
import ImageSlider from "../components/ImageSlider";
import { CardSkeleton } from "../components/Skeleten";
import Herobanner from "../assets/herobanner.jpg"
import Herobanner2 from "../assets/bannerhero2.png"
import Herobanner3 from "../assets/bannerhero3.png"
import Herobanner4 from "../assets/bannerhero4.png"




export default function Home() {
  const [loading, setLoading] = useState(true);
  const [smartphones, setSmartphones] = useState([]);
  const [groceries, setGroceries] = useState([]);

  const phoneScrollRef = useRef(null);
  const groceryScrollRef = useRef(null);

  const scrollRight = (ref) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeft = (ref) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  async function fetchData() {
    try {
      setLoading(true);
      const res = await fetch("https://dummyjson.com/products?limit=0");
      const data = await res.json();

      setSmartphones(
        data.products.filter((p) => p.category === "smartphones")
      );
      setGroceries(
        data.products.filter((p) => p.category === "groceries")
      );
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        {/* Main banner -> groceries */}
        <Link className="block w-[98%] m-auto mt-3" to="/category/groceries">
          <img
            className="rounded-2xl object-cover"
            src={Herobanner}
            alt="vegetables-banner"
          />
        </Link>

        <div className="flex w-[98%] m-auto mt-3 gap-4">
          {/* pharmacy banner -> skincare (dummyjson has "skincare") */}
          <Link to="/category/kitchen-accessories">
            <img className="w-80 rounded-2xl" src={Herobanner2} alt="pharmacy-banner" />
          </Link>

          {/* pets products banner -> (dummyjson doesn't have pets) use "pet-supplies" if available, else choose another real category */}
          <Link to="/category/furniture">
            <img className="w-80 rounded-2xl" src={Herobanner3} alt="pets-products-banner" />
          </Link>

          {/* baby care banner -> (dummyjson may not have baby) choose another real category */}
          <Link to="/category/fragrances">
            <img className="w-80 rounded-2xl" src={Herobanner4} alt="baby-care-banner" />
          </Link>
        </div>
      </div>

      {/* Smartphones Section */}
      <div className="relative bg-white mt-3 rounded-2xl p-4 group/card w-[98%] m-auto">
        <h2 className="text-2xl font-medium mb-4">
          Best deals on smartphones
        </h2>

        <div
          ref={phoneScrollRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {loading
            ? Array(6)
              .fill(0)
              .map((_, i) => <CardSkeleton key={i} />)
            : smartphones.slice(0, 8).map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="shrink-0">
                <Card
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.images[0]}
                />
              </Link>
            ))}
        </div>

        {!loading && (
          <>
            <button
              onClick={() => scrollLeft(phoneScrollRef)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:scale-110 opacity-0 group-hover/card:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={() => scrollRight(phoneScrollRef)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:scale-110 opacity-0 group-hover/card:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>

      <ImageSlider />

      {/* Groceries Section */}
      <div className="relative bg-white mt-3 rounded-2xl p-4 group/card w-[98%] m-auto">
        <h2 className="text-2xl font-medium">
          Groceries
        </h2>

        <div
          ref={groceryScrollRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        >
          {loading
            ? Array(6)
              .fill(0)
              .map((_, i) => <CardSkeleton key={i} />)
            : groceries.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="shrink-0">
                <Card
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.images[0]}
                />
              </Link>
            ))}
        </div>

        {!loading && (
          <>
            <button
              onClick={() => scrollLeft(groceryScrollRef)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:scale-110 opacity-0 group-hover/card:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={() => scrollRight(groceryScrollRef)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:scale-110 opacity-0 group-hover/card:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}
      </div>
    </>
  );
}
