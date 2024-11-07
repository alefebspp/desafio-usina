export default interface Rating {
  id: string;
  value: number;
  comment?: string | null;
  movie_id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
