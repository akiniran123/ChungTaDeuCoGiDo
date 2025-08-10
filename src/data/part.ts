// src/data/parts.ts
import { PCPart } from "@/types/part";

export const sampleParts: PCPart[] = [
  {
    id: '1',
    name: 'Intel Core i5-13600K',
    imageUrl: 'https://example.com/cpu.png',
    price: 299.99,
    category: 'CPU',
    productUrl: 'https://example.com/cpu',
  },
  {
    id: '2',
    name: 'NVIDIA RTX 4070',
    imageUrl: 'https://example.com/gpu.png',
    price: 599.99,
    category: 'GPU',
    productUrl: 'https://example.com/gpu',
  },
  // ...
];
