import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [category, setCategory] = useState("");

    const baseUrl = "http://127.0.0.1:8000";

    /* PRODUCTS */
    useEffect(() => {
        fetch(`${baseUrl}/api/products/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setAllProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    /* CATEGORIES */
    useEffect(() => {
        fetch(`${baseUrl}/api/categories/`)
            .then((res) => res.json())
            .then((data) => setCategories(data))
            .catch((err) => console.log(err));
    }, []);

    /* FILTERING + SORTING */
    useEffect(() => {
        let filtered = [...allProducts];

        // Search
        if (search) {
            filtered = filtered.filter((product) =>
                product.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // Category
        if (category) {
            filtered = filtered.filter(
                (product) =>
                    String(product.category) === String(category)
            );
        }

        // Sort
        if (sort === "price_low") {
            filtered.sort(
                (a, b) => Number(a.price) - Number(b.price)
            );
        }

        if (sort === "price_high") {
            filtered.sort(
                (a, b) => Number(b.price) - Number(a.price)
            );
        }

        setProducts(filtered);
    }, [search, sort, category, allProducts]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-400">
                Loading products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-400 p-4">
                Error: {error}
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100">

                {/* FILTER CARD */}
                <div className="max-w-7xl mx-auto px-4 pt-5">

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            border
                            border-gray-100
                            shadow-sm
                            p-4
                            hover:shadow-md
                            transition
                        "
                    >

                        <div className="grid md:grid-cols-3 gap-3">

                            {/* SEARCH */}
                            <input
                                type="text"
                                placeholder="Search products, brands..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                className="
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    text-sm
                                    focus:outline-none
                                    focus:ring-1
                                    focus:ring-gray-400
                                "
                            />

                            {/* CATEGORY */}
                            <select
                                value={category}
                                onChange={(e) =>
                                    setCategory(e.target.value)
                                }
                                className="
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    text-sm
                                    bg-white
                                    focus:outline-none
                                    focus:ring-1
                                    focus:ring-gray-400
                                "
                            >
                                <option value="">
                                    All Categories
                                </option>

                                {categories.map((cat) => (
                                    <option
                                        key={cat.id}
                                        value={cat.id}
                                    >
                                        {cat.name}
                                    </option>
                                ))}
                            </select>

                            {/* SORT */}
                            <select
                                value={sort}
                                onChange={(e) =>
                                    setSort(e.target.value)
                                }
                                className="
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    text-sm
                                    bg-white
                                    focus:outline-none
                                    focus:ring-1
                                    focus:ring-gray-400
                                "
                            >
                                <option value="">
                                    Sort Products
                                </option>

                                <option value="price_low">
                                    Price: Low → High
                                </option>

                                <option value="price_high">
                                    Price: High → Low
                                </option>
                            </select>

                        </div>

                        <div className="mt-3 text-xs text-gray-400">
                            Showing {products.length} products
                        </div>

                    </div>

                </div>

                {/* PRODUCTS */}
                <div
                    className="
                        max-w-7xl
                        mx-auto
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        lg:grid-cols-5
                        xl:grid-cols-6
                        gap-3
                        p-4
                    "
                >
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

            </div>
        </>
    );
}

export default ProductList;