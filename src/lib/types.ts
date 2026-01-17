/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  createdAt?: number;
  tags: Tag[];
  source?: string;
  imgPreview?: string;
  isFavorite: boolean;
  isReadLater: boolean;
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

export interface FunctionCall {
  name: string;
  args: Record<string, any>;
}

export interface FunctionResponse {
  name: string;
  response: {
    success?: boolean;
    summary?: string;
    urlMetadata?: {
      title?: string;
      description?: string;
      image?: string;
    };
    [key: string]: any;
  };
}

export interface MessagePart {
  text?: string;
  functionCall?: FunctionCall;
  functionResponse?: FunctionResponse;
}

export interface Message {
  id: string;
  text?: string; // Optional convenience field for UI
  sender: 'user' | 'bot';
  role?: 'user' | 'model' | 'function';
  parts?: MessagePart[];
  createdAt?: string;
}
