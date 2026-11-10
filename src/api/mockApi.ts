export interface Product {
  id: string;
  name: string;
  category: string;
  /** Price in integer cents (e.g. 500 = $5.00) */
  price: number;
  inStock: boolean;
}

export const CATEGORIES = [
  'Electronics',
  'Stationery',
  'Home & Office',
  'Accessories',
] as const;

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Mechanical Keyboard',
    category: 'Electronics',
    price: 8999,
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Vertical Mouse',
    category: 'Electronics',
    price: 4500,
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Hardcover Dotted Notebook',
    category: 'Stationery',
    price: 1200,
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'Precision Gel Pen Set',
    category: 'Stationery',
    price: 500,
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'Ceramic Pour-Over Mug',
    category: 'Home & Office',
    price: 1850,
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Adjustable Aluminum Laptop Stand',
    category: 'Home & Office',
    price: 3499,
    inStock: false,
  },
  {
    id: 'prod-7',
    name: 'Canvas Everyday Tote Bag',
    category: 'Accessories',
    price: 1500,
    inStock: true,
  },
  {
    id: 'prod-8',
    name: 'USB-C Braided Charging Cable',
    category: 'Electronics',
    price: 999,
    inStock: true,
  },
  {
    id: 'prod-9',
    name: 'Desk Felt Mat Organizer',
    category: 'Home & Office',
    price: 2200,
    inStock: true,
  },
  {
    id: 'prod-10',
    name: 'Minimalist Leather Card Holder',
    category: 'Accessories',
    price: 2800,
    inStock: false,
  },
];

/**
 * Simulates an unreliable async product search endpoint.
 * - Variable latency between 200ms and 800ms (can resolve out of order).
 * - ~10% random failure rate.
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const delay = Math.floor(Math.random() * 600) + 200;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.1) {
        reject(new Error('Network error: Failed to fetch products. Please try again.'));
        return;
      }

      const normalized = query.trim().toLowerCase();
      if (!normalized) {
        resolve([...PRODUCTS]);
        return;
      }

      const matched = PRODUCTS.filter(
        (product) =>
          product.name.toLowerCase().includes(normalized) ||
          product.category.toLowerCase().includes(normalized)
      );
      resolve(matched);
    }, delay);
  });
}
