import { MovieService } from '../service';
import { IResolvers } from 'mercurius';

export function createMovieResolvers({
  moviesService,
}: {
  moviesService: MovieService;
}) {
  const resolvers: IResolvers = {
    Query: {
      add: async (_, { x, y }) => x + y,
    },
  };

  return resolvers;
}
