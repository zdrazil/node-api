import { Movie } from '../models';
import repository from './repository';

async function createMovie(movie: Movie) {
  // await movieValidator.ValidateAndThrowAsync(movie, cancellationToken);
  return await repository.createMovie(movie);
}

export default {
  createMovie,
};
