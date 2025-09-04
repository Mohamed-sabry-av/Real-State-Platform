export interface Apartment {
  _id: string;
  title: string;
  images: string[] | string | undefined;
  bedroom: number;
  bathroom: number;
  price: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
  propertyType?: string;
  userId: string;
  postType: PostType;
  postDetail: PostDetail;
  createdAt: string;
}

export interface SinglePost {
  _id: string;
  title: string;
  price: number;
  images: string[];
  bedroom: number;
  bathroom: number;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
  propertyType?: string;
  userId: string;
  postType: PostType;
  postDetail: PostDetail;
  createdAt: string;
}

export interface PostType {
  _id: string;
  name: string;
}

export interface PostDetail {
  _id: string;
  desc: string;
  utilities?: string;
  pet?: string;
  income?: number;
  size?: number;
  school?: string;
  bus?: string;
}

export interface User {
  _id: string;
  name: string;
    avatar:string;
createdAt:string;
  email: string;
  img?: string;
}

export interface AuthUser {
  email: string;
  password: string;
}

export interface RegisterUser extends AuthUser {
  name: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}