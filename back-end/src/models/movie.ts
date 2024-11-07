export default interface Movie {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  year: number;
  user_id: string;
  image_url?: string | null;
  created_at: Date;
  updated_at: Date;
}
