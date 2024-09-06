export interface Movie {
  genres: string[];
  id: string;
  rating?: number;
  slug: string;
  title: string;
  userRating?: number;
  yearOfRelease: number;
}

export interface MovieDb {
  genres: string[];
  id: string;
  rating?: number;
  slug: string;
  title: string;
  user_rating?: number;
  year_of_release: number;
}
