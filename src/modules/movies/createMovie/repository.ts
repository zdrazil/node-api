import { Movie } from '../models';

function createMovie(movie: Movie): Promise<boolean> {
  console.log('Creating movie', movie);
  return Promise.resolve(true);
}

export default { createMovie };
