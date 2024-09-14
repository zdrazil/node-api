import { MovieSortField } from '../../../graphql/generated';
import { MovieService } from '../service';
import { IResolvers } from 'mercurius';
const cancellationToken = false;

export function createMovieResolvers({
  moviesService,
}: {
  moviesService: MovieService;
}) {
  const resolvers: IResolvers = {
    Query: {
      movie: async (_, { idOrSlug }) => {
        return moviesService.getById({
          cancellationToken,
          id: idOrSlug,
        });
      },
      movies: async (
        _,
        { after, first, sortField, sortOrder, title, userId, year },
      ) => {
        const sortBy = (() => {
          switch (sortField) {
            case null:
            case undefined:
              return undefined;
            case MovieSortField.TITLE:
              return 'title';
            case MovieSortField.YEAR:
              return 'year';
          }
        })();
        const order = (() => {
          switch (sortOrder) {
            case null:
            case undefined:
              return undefined;
            case 'ASC':
              return 'asc';
            case 'DESC':
              return 'desc';
          }
        })();

        const result = await moviesService.getAllWithCursor({
          after,
          cancellationToken,
          first,
          sortDirection: order,
          sortField: sortBy,
          title: title,
          userId,
          year: year,
        });

        return result;
      },
    },
  };

  return resolvers;
}
