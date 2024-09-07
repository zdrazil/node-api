import { RatingRepository } from '../ratings/repository/repository';
import { Movie } from './models';
import { MovieRepository } from './repository/repository';

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

  return {
    create,
    deleteById,
    getAll,
    getById,
    getBySlug,
    getCount,
    update,
  };
};
