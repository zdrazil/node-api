import { RatingRepository } from '../ratings/repository';
import { Movie } from './models';
import { MovieRepository } from './repository';

export type MovieService = ReturnType<typeof createMovieService>;

export const createMovieService = ({
  movieRepository,
  ratingRepository,
}: {
  movieRepository: MovieRepository;
  ratingRepository: RatingRepository;
}) => {
  async function create(movie: Movie): Promise<boolean> {
    // await movieValidator.ValidateAndThrowAsync(movie, cancellationToken);
    return movieRepository.create(movie);
  }

  const getById = movieRepository.getById;

  const getBySlug = movieRepository.getBySlug;

  async function update(
    movie: Movie,
    { userId }: { userId?: string },
  ): Promise<Movie | null> {
    const movieExists = await movieRepository.existsById({ id: movie.id });

    if (!movieExists) {
      return null;
    }

    await movieRepository.update({ movie });

    if (userId == null) {
      const rating = await ratingRepository.getRatingByMovieId({
        movieId: movie.id,
      });

      return {
        ...movie,
        rating: rating,
      };
    }

    const userRating = await ratingRepository.getRatingByMovieAndUserId({
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
