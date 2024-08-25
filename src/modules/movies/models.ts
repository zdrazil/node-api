export interface Movie {
  genres: string[];
  id: string;
  slug: string;
  title: string;
  yearOfRelease: number;
  rating?: number;
  userRating?: number;
}
