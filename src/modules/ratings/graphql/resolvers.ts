import { IResolvers } from 'mercurius';

export function createRatingResolvers({
  moviesService,
}: {
  moviesService: MovieService;
}) {
  const resolvers: IResolvers = {
    Rating: {},
  };

  return resolvers;
}
