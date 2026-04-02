import { useEffect, useState } from "react";
import Card from "./Card";
import Header from "./Header";

function Dummy() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(8);
    const [maxLimit, setMaxLimit] = useState(20);
    console.log(limit)
    async function fetchData() {
        try {
            const response = await fetch(`https://dummyjson.com/products/search?q=${search}&limit=${limit}`);
            const data = await response.json();
            setProducts(data.products);
            console.log(data)
            // console.log(data.limit)
            setMaxLimit(data.total);

        } catch (error) {
            console.error("Fetch failed:", error.message);
        }

    }

    useEffect(() => {
        fetchData();
    }, [limit, search]);
    // console.log(search)
    return <>
        <Header SetSearch={setSearch}></Header>
        <div className="grid grid-cols-4  items-center justify-items-center gap-y-8 m-8">
            {products.map(product => (
                <Card title={product.title} desc={product.description} price={product.price} image={product.images[0]} stock={product.availabilityStatus} />
            ))}
        </div>
        {products.length < maxLimit ? (
            <div className="w-full text-center my-8">
                <button
                    onClick={() => setLimit(limit + 4)}
                    className="bg-amber-300 px-4 py-2 rounded-3xl cursor-pointer"
                >
                    Show more
                </button>
            </div>
        ) :
            (
                <div className="w-full text-center my-8 text-gray-500">
                    No more products
                </div>
            )}
    </>;
}

export default Dummy;
