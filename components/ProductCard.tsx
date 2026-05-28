import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow duration-300">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={200}
          height={200}
          className="object-cover rounded-md mb-4"
        />
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-600">${(product.price / 100).toFixed(2)}</p>
      </div>
    </Link>
  );
}
