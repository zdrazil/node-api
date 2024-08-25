import { Movie } from './models';
import { MovieRepository } from './repository';

export type MovieService = ReturnType<typeof createMovieService>;

export const createMovieService = ({
  movieRepository,
}: {
  movieRepository: MovieRepository;
}) => {
  async function create(movie: Movie): Promise<boolean> {
    // await movieValidator.ValidateAndThrowAsync(movie, cancellationToken);
    return movieRepository.create(movie);
  }

  const getById = movieRepository.getById;

  const getBySlug = movieRepository.getBySlug;

  const update = movieRepository.update;

  const deleteById = movieRepository.deleteById;

  const getCount = movieRepository.getCount;

  return {
    create,
    getById,
    getBySlug,
    update,
    deleteById,
    getCount,
  };
};
