import { SortDirection } from '../api/sortDirection';
import { RatingRepository } from '../ratings/repository/repository';
import { Movie } from './models';
import { MovieRepository } from './repository/repository';
import { SortField } from './restApi/getAllMovies/schema';

export type MovieService = ReturnType<typeof createMovieService>;

export const createMovieService = ({
  movieRepository,
  ratingRepository,
}: {
  movieRepository: MovieRepository;
  ratingRepository: RatingRepository;
}) => {
  async function create({
    cancellationToken,
    movie,
  }: {
    cancellationToken: boolean;
    movie: Movie;
  }): Promise<boolean> {
    return movieRepository.create({ cancellationToken, movie });
  }

  const getById = movieRepository.getById;

  const getBySlug = movieRepository.getBySlug;

  async function update(
    movie: Movie,
    {
      cancellationToken,
      userId,
    }: { cancellationToken: boolean; userId: string },
  ): Promise<Movie | null> {
    const movieExists = await movieRepository.existsById({
      cancellationToken,
      id: movie.id,
    });

    if (!movieExists) {
      return null;
    }

    await movieRepository.update({ cancellationToken, movie });

    const userRating = await ratingRepository.getRatingByMovieAndUserId({
      cancellationToken,
      movieId: movie.id,
      userId,
    });

    return {
      ...movie,
      rating: movie.rating,
      userRating: userRating,
    };
  }

  const deleteById = movieRepository.deleteById;

  const getCount = movieRepository.getCount;

  const getAll = movieRepository.getAll;

  async function getAllWithCursor({
    after,
    cancellationToken,
    first = 1,
    sortDirection: sortDirection,
    sortField,
    title,
    userId,
    year,
  }: {
    after?: string | null;
    cancellationToken: boolean;
    first?: number | null;
    sortDirection?: SortDirection | null;
    sortField?: SortField | null;
    title?: string | null;
    userId?: string | null;
    year?: number | null;
  }) {
    const result = await movieRepository.getAllWithCursor({
      after,
      cancellationToken,
      first,
      sortDirection,
      sortField,
      title,
      userId,
      year,
    });

    return result;
  }

  return {
    create,
    deleteById,
    getAll,
    getAllWithCursor,
    getById,
    getBySlug,
    getCount,
    update,
  };
};
