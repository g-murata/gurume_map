export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  image_url?: string;
  reviews_count?: number;
  restraunts_count?: number;
}

export interface Area {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
  category?: string;
}

export interface Restraunt {
  id: number;
  name: string;
  lat: number;
  lng: number;
  url?: string;
  description?: string;
  image?: string;
  area_id: number;
  user_id?: number;
}

export interface Review {
  id: number;
  evaluation: number;
  content: string;
  restraunt_id: number;
  user_id: number;
  image?: string;
  image_url?: string;
  user?: User;
  user_name?: string;
  email?: string;
  user_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_at: string;
}

export interface TagsTaggedItem {
  id: number;
  tag_id: number;
  tagged_item_id: number;
  tagged_item_type: string;
}
