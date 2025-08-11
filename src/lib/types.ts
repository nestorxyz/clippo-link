
export interface Tag {
  id: string;
  name: string;
  color?: string | null;
}

export interface Link {
  id: string;
  url: string;
  title: string;
  description: string | null;
  createdAt: string;
  tags: Tag[];
  source?: string | null;
  img_preview?: string | null;
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
  createdAt?: string;
}
