
import { Category } from './types';

export const initialCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'lukAI',
    description: "My startup's related links",
    subCategories: [
      {
        id: 'sub-1-1',
        name: 'Competitors',
        links: [
          { id: 'l1', url: 'https://www.perplexity.ai/', description: 'Main competitor in the space', createdAt: new Date().toISOString() },
        ],
      },
      {
        id: 'sub-1-2',
        name: 'Inspiration',
        links: [],
      }
    ],
  },
  {
    id: 'cat-2',
    name: 'joshi',
    description: "Girlfriend's stuff",
    subCategories: [
      {
        id: 'sub-2-1',
        name: 'Gift Ideas',
        links: [
          { id: 'l2', url: 'https://www.etsy.com/market/personalized_necklace', description: 'A nice necklace', createdAt: new Date().toISOString() },
        ],
      },
    ],
  },
  {
    id: 'cat-3',
    name: 'Work',
    subCategories: [
      { id: 'sub-3-1', name: 'React', links: [] },
      { id: 'sub-3-2', name: 'Tailwind CSS', links: [] },
    ],
  },
];
