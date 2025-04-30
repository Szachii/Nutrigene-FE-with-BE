// src/pages/ShopPage.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import ProductDemandBadge from "@/components/ProductDemandBadge";
import { useCart } from "@/contexts/CartContext";

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const { addToCart } = useCart();

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]); // Adjusted for INR
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState([]);

  const demandLevels = ["high", "medium", "low"];

  const [addingToCart, setAddingToCart] = useState(null);
  const [cartError, setCartError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await fetch('http://localhost:5000/api/products');
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const productsData = await productsResponse.json();

        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:5000/api/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categoriesData = await categoriesResponse.json();

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData.map(cat => cat.name));

        // Set initial price range based on products
        const prices = productsData.map((product) => product.price);
        const minPrice = Math.floor(Math.min(...prices));
        const maxPrice = Math.ceil(Math.max(...prices));
        setPriceRange([minPrice, maxPrice]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Could not load products or categories. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategories, selectedDemand, priceRange, products]);

  const applyFilters = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) => selectedCategories.includes(product.category));
    }

    // Apply demand filter
    if (selectedDemand.length > 0) {
      filtered = filtered.filter((product) => selectedDemand.includes(product.demand));
    }

    // Apply price range filter
    filtered = filtered.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

    setFilteredProducts(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      setSearchParams({ search: searchTerm });
    } else {
      setSearchParams({});
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleDemandChange = (demand) => {
    setSelectedDemand((prev) => {
      if (prev.includes(demand)) {
        return prev.filter((d) => d !== demand);
      } else {
        return [...prev, demand];
      }
    });
  };

  const handleAddToCart = async (product) => {
    setAddingToCart(product._id);
    setCartError(null);
    try {
      await addToCart(product, 1);
      // Show success message or update UI as needed
    } catch (error) {
      console.error("Error adding to cart:", error);
      setCartError(error.message || "Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Shop Our Cookies</h1>
        <p className="text-muted-foreground">
          Browse our delicious selection of handcrafted cookies for Mom & Baby.
        </p>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {cartError && <p className="text-red-500 mb-4">{cartError}</p>}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cookies..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 sm:ml-auto">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filter Cookies</SheetTitle>
            </SheetHeader>
            <div className="grid gap-6 py-4">
              <div>
                <h3 className="mb-4 text-lg font-medium">Price Range (₹)</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000} // Adjusted for INR
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span>₹{priceRange[0]}</span>
                    <span>₹{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Categories</h3>
                <div className="grid gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center gap-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label htmlFor={`category-${category}`}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-lg font-medium">Demand</h3>
                <div className="grid gap-2">
                  {demandLevels.map((demand) => (
                    <div key={demand} className="flex items-center gap-2">
                      <Checkbox
                        id={`demand-${demand}`}
                        checked={selectedDemand.includes(demand)}
                        onCheckedChange={() => handleDemandChange(demand)}
                      />
                      <Label htmlFor={`demand-${demand}`} className="capitalize">
                        {demand === "high" ? "High Demand" : demand === "medium" ? "Popular" : "Try Me"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {(selectedCategories.length > 0 || selectedDemand.length > 0 || searchTerm) && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Active Filters:</span>

          {searchTerm && (
            <Button variant="secondary" size="sm" className="h-7 gap-1 text-xs" onClick={() => setSearchTerm("")}>
              Search: {searchTerm}
              <span className="ml-1">×</span>
            </Button>
          )}

          {selectedCategories.map((category) => (
            <Button
              key={category}
              variant="secondary"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
              <span className="ml-1">×</span>
            </Button>
          ))}

          {selectedDemand.map((demand) => (
            <Button
              key={demand}
              variant="secondary"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => handleDemandChange(demand)}
            >
              {demand === "high" ? "High Demand" : demand === "medium" ? "Popular" : "Try Me"}
              <span className="ml-1">×</span>
            </Button>
          ))}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => {
              setSelectedCategories([]);
              setSelectedDemand([]);
              setSearchTerm("");
              setSearchParams({});
            }}
          >
            Clear All
          </Button>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md"
            >
              <a href={`/product/${product._id}`} className="block overflow-hidden">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image || "/BabyCookie1.jpg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.discount > 0 && (
                    <div className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-semibold">{product.name}</h3>
                    <ProductDemandBadge demand={product.demand} />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground line-clamp-2">{product.shortDescription}</p>
                  <div className="flex items-center justify-between">
                    {product.discount > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₹{(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground line-through">₹{product.price.toFixed(2)}</span>
                      </div>
                    ) : (
                      <span className="font-bold">₹{product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </a>
              <div className="border-t p-4">
                <Button
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToCart(product);
                  }}
                  disabled={addingToCart === product._id}
                >
                  {addingToCart === product._id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-[40vh] flex-col items-center justify-center rounded-lg border bg-muted/40 p-8 text-center">
          <Filter className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-medium">No cookies found</h3>
          <p className="mb-6 text-muted-foreground">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
          <Button
            onClick={() => {
              setSelectedCategories([]);
              setSelectedDemand([]);
              setSearchTerm("");
              setSearchParams({});
            }}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;