
export interface Tag {
  id: string;
  name: string;
  color?: string | null;
}

export interface Link {
  id: string;
  url: string;
  description: string;
  createdAt: string;
  tags: Tag[];
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
