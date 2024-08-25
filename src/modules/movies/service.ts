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

  return { create, getById };
};
