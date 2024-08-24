import { Movie } from '../models';
import { Repository } from './repository';

export type Service = ReturnType<typeof createService>;

export function createService({
  movieRepository,
}: {
  movieRepository: Repository;
}) {
  async function createMovie(movie: Movie): Promise<boolean> {
    // await movieValidator.ValidateAndThrowAsync(movie, cancellationToken);
    return movieRepository.createMovie(movie);
  }

  return { createMovie };
}
