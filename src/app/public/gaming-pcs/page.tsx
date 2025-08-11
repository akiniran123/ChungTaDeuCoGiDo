"use client";

import React, { useState } from "react";
import CategoryHeader from "@/components/FullSystem/CategoryHeader";
import FiltersSidebar from "@/components/FullSystem/FiltersSidebar";
import ProductGrid from "@/components/FullSystem/ProductGrid";
import Pagination from "@/components/FullSystem/Pagination";
import SortDropdown from "@/components/FullSystem/SortDropdown";

export default function GamingPcsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);

  const products = [
    {
      image: "/images/pc1.jpg",
      title: "Custom Gaming PC - RTX 4070",
      price: "$1,299",
      condition: "Used - Like New",
      seller: "John Doe",
    },
  ];

  const filterGroups = [
    { title: "Brand", options: [{ label: "ASUS", value: "asus" }] },
  ];

  const sortOptions = [
    { label: "Newest", value: "newest" },
    { label: "Price: Low to High", value: "price_low" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <CategoryHeader title="Full Systems" subtitle="Gaming PCs" />
      <div className="flex gap-6">
        <FiltersSidebar filters={filterGroups} onChange={(k, v) => setFilters({ ...filters, [k]: v })} />
        <div className="flex-1">
          <SortDropdown options={sortOptions} onChange={(v) => console.log(v)} />
          <ProductGrid products={products} />
          <Pagination totalPages={5} currentPage={page} onPageChange={setPage} />
        </div>
      </div>
    </div>
  );
}
