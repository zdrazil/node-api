import { Movie } from './models';
import { Repository } from './repository';

export type Service = ReturnType<typeof createService>;

export const createService = ({
  movieRepository,
}: {
  movieRepository: Repository;
}) => {
  const createMovie = async (movie: Movie): Promise<boolean> => {
    // await movieValidator.ValidateAndThrowAsync(movie, cancellationToken);
    return movieRepository.createMovie(movie);
  };

  return { createMovie };
};
