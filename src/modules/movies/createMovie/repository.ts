import { PostgresDb } from '@fastify/postgres';
import { Movie } from '../models';

export type Repository = ReturnType<typeof createRepository>;

export function createRepository({ db }: { db: PostgresDb }) {
  async function createMovie(movie: Movie): Promise<boolean> {
    const result = await db.transact(async (client) => {
      return await client.query(
        'INSERT INTO movies (id, slug, title, yearofrelease) VALUES ($1, $2, $3, $4)',
        [movie.id, movie.slug, movie.title, movie.yearOfRelease],
      );
    });

    return result.rowCount != null && result.rowCount > 0;
  }

  return { createMovie };
}
