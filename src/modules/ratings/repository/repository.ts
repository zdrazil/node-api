import { Client } from 'pg';
import {
  getRatingsByMovieAndUserId,
  getRatingsByMovieId,
} from './ratings.queries';
import * as query from './ratings.queries';
import { MovieRating } from '../models';

export type RatingRepository = ReturnType<typeof createRatingRepository>;

export function createRatingRepository({ db }: { db: () => Promise<Client> }) {
  async function getRatingByMovieId({
    movieId,
  }: {
    cancellationToken: boolean;
    movieId: string;
  }): Promise<number> {
    const client = await db();
    await client.connect();

    const rating = await getRatingsByMovieId.run({ movie_id: movieId }, client);

    await client.end();

    return parseRatingNumber(rating);
  }

  async function getRatingByMovieAndUserId({
    movieId,
    userId,
  }: {
    cancellationToken: boolean;
    movieId: string;
    userId: string;
  }): Promise<number> {
    const client = await db();
    await client.connect();

    const rating = await getRatingsByMovieAndUserId.run(
      { movie_id: movieId, user_id: userId },
      client,
    );

    await client.end();

    return rating[0]?.rating ?? 0;
  }

  async function rateMovie({
    movieId,
    rating,
    userId,
  }: {
    cancellationToken: boolean;
    movieId: string;
    rating: number;
    userId: string;
  }): Promise<boolean> {
    const client = await db();
    await client.connect();

    await query.rateMovie.run(
      { movie_id: movieId, rating, user_id: userId },
      client,
    );

    await client.end();

    return true;
  }

  async function deleteRating({
    movieId,
    userId,
  }: {
    cancellationToken: boolean;
    movieId: string;
    userId: string;
  }): Promise<boolean> {
    const client = await db();
    await client.connect();

    await query.deleteRatings.run(
      { movie_id: movieId, user_id: userId },
      client,
    );

    await client.end();

    return true;
  }

  async function getRatingsForUser({
    userId,
  }: {
    cancellationToken: boolean;
    userId: string;
  }): Promise<MovieRating[]> {
    const client = await db();
    await client.connect();

    const ratings = await query.getRatingsForUser.run(
      { user_id: userId },
      client,
    );

    await client.end();

    return ratings.map((rating) => ({
      id: rating.movie_id,
      movieId: rating.movie_id,
      rating: rating.rating,
      slug: rating.slug,
    }));
  }

  return {
    deleteRating,
    getRatingByMovieAndUserId,
    getRatingByMovieId,
    getRatingsForUser,
    rateMovie,
  };
}
function parseRatingNumber(rating: { rating: string | null }[]) {
  const ratingNumber = rating[0]?.rating;
  return ratingNumber != null ? Number(ratingNumber) : 0;
}
