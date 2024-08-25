import { PostgresDb } from '@fastify/postgres';
import { Movie } from './models';

export type MovieRepository = ReturnType<typeof createMovieRepository>;

export function createMovieRepository({ db }: { db: PostgresDb }) {
  async function create(movie: Movie): Promise<boolean> {
    const result = await db.transact(async (client) => {
      return await client.query(
        'INSERT INTO movies (id, slug, title, yearofrelease) VALUES ($1, $2, $3, $4)',
        [movie.id, movie.slug, movie.title, movie.yearOfRelease],
      );
    });

    return result.rowCount != null && result.rowCount > 0;
  }

  async function getById(id: string): Promise<Movie | undefined> {
    const client = await db.connect();

    const movieResult = await client.query<
      Pick<Movie, 'id' | 'title' | 'yearOfRelease' | 'slug'>
    >('SELECT id, title, yearOfRelease, slug FROM movies WHERE id = $1', [id]);

    console.log(movieResult.rows[0]);

    const movie = movieResult.rows[0];

    if (!movie) {
      client.release();

      return undefined;
    }

    const genresResult = await client.query<{ name: string }>(
      'SELECT * FROM genres WHERE movieId = $1',
      [id],
    );

    const result = {
      ...movie,
      genres: genresResult.rows.map((row) => row.name),
    };

    console.log(result);

    return result;
  }

  return { create, getById };
}
