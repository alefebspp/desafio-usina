export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface Rating {
  id: string;
  value: number;
  comment?: string | null;
  movie_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  user: {
    name: string;
  };
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  year: number;
  duration: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
  created_by: {
    name: string;
    id: string;
  };
}
