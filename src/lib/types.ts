
export interface Link {
  id: string;
  url: string;
  description: string;
  createdAt: string;
}

export interface SubCategory {
  id: string;
  name: string;
  description?: string;
  links: Link[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  subCategories: SubCategory[];
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}
