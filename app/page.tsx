import ProductCard from "@/components/ProductCard";
import prisma from "@/lib/prisma";
import { Metadata } from "next";

interface HomePageProps {
  searchParams: {
    page: string;
  };
}

export function generateMetadata(): Metadata {
  return {
    title: "YouMe E-commerce",
    description: "An e-commerce store built with Next.js and Prisma",
  };
}

export default async function Home({ searchParams }: HomePageProps) {
  const currentPage = parseInt(searchParams.page) || 1;

  const products = await prisma.product.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  );
}
