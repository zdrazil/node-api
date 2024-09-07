/** Types generated for queries found in "src/modules/ratings/repository/ratings.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetRatingsByMovieId' parameters type */
export interface IGetRatingsByMovieIdParams {
  movie_id?: string | null | void;
}

/** 'GetRatingsByMovieId' return type */
export interface IGetRatingsByMovieIdResult {
  rating: string | null;
}

/** 'GetRatingsByMovieId' query type */
export interface IGetRatingsByMovieIdQuery {
  params: IGetRatingsByMovieIdParams;
  result: IGetRatingsByMovieIdResult;
}

const getRatingsByMovieIdIR: any = {"usedParamSet":{"movie_id":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":85,"b":93}]}],"statement":"SELECT\n    round(avg(r.rating), 1) AS rating\nFROM\n    ratings r\nWHERE\n    movie_id = :movie_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     round(avg(r.rating), 1) AS rating
 * FROM
 *     ratings r
 * WHERE
 *     movie_id = :movie_id
 * ```
 */
export const getRatingsByMovieId = new PreparedQuery<IGetRatingsByMovieIdParams,IGetRatingsByMovieIdResult>(getRatingsByMovieIdIR);


/** 'GetRatingsByMovieAndUserId' parameters type */
export interface IGetRatingsByMovieAndUserIdParams {
  movie_id?: string | null | void;
  user_id?: string | null | void;
}

/** 'GetRatingsByMovieAndUserId' return type */
export interface IGetRatingsByMovieAndUserIdResult {
  rating: number | null;
  round: string | null;
}

/** 'GetRatingsByMovieAndUserId' query type */
export interface IGetRatingsByMovieAndUserIdQuery {
  params: IGetRatingsByMovieAndUserIdParams;
  result: IGetRatingsByMovieAndUserIdResult;
}

const getRatingsByMovieAndUserIdIR: any = {"usedParamSet":{"movie_id":true,"user_id":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":142,"b":150},{"a":244,"b":252}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":178,"b":185}]}],"statement":"SELECT\n    round(avg(r.rating), 1),\n(\n        SELECT\n            rating\n        FROM\n            ratings\n        WHERE\n            movie_id = :movie_id\n            AND user_id = :user_id\n        LIMIT 1)\nFROM\n    ratings r\nWHERE\n    movie_id = :movie_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     round(avg(r.rating), 1),
 * (
 *         SELECT
 *             rating
 *         FROM
 *             ratings
 *         WHERE
 *             movie_id = :movie_id
 *             AND user_id = :user_id
 *         LIMIT 1)
 * FROM
 *     ratings r
 * WHERE
 *     movie_id = :movie_id
 * ```
 */
export const getRatingsByMovieAndUserId = new PreparedQuery<IGetRatingsByMovieAndUserIdParams,IGetRatingsByMovieAndUserIdResult>(getRatingsByMovieAndUserIdIR);


/** 'RateMovie' parameters type */
export interface IRateMovieParams {
  movie_id?: string | null | void;
  rating?: number | null | void;
  user_id?: string | null | void;
}

/** 'RateMovie' return type */
export type IRateMovieResult = void;

/** 'RateMovie' query type */
export interface IRateMovieQuery {
  params: IRateMovieParams;
  result: IRateMovieResult;
}

const rateMovieIR: any = {"usedParamSet":{"movie_id":true,"user_id":true,"rating":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":59,"b":67}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":70,"b":77}]},{"name":"rating","required":false,"transform":{"type":"scalar"},"locs":[{"a":80,"b":86},{"a":156,"b":162}]}],"statement":"INSERT INTO ratings(movie_id, user_id, rating)\n    VALUES (:movie_id, :user_id, :rating)\nON CONFLICT (movie_id, user_id)\n    DO UPDATE SET\n        rating = :rating"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO ratings(movie_id, user_id, rating)
 *     VALUES (:movie_id, :user_id, :rating)
 * ON CONFLICT (movie_id, user_id)
 *     DO UPDATE SET
 *         rating = :rating
 * ```
 */
export const rateMovie = new PreparedQuery<IRateMovieParams,IRateMovieResult>(rateMovieIR);


/** 'DeleteRatings' parameters type */
export interface IDeleteRatingsParams {
  movie_id?: string | null | void;
  user_id?: string | null | void;
}

/** 'DeleteRatings' return type */
export type IDeleteRatingsResult = void;

/** 'DeleteRatings' query type */
export interface IDeleteRatingsQuery {
  params: IDeleteRatingsParams;
  result: IDeleteRatingsResult;
}

const deleteRatingsIR: any = {"usedParamSet":{"movie_id":true,"user_id":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":37,"b":45}]},{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":65,"b":72}]}],"statement":"DELETE FROM ratings\nWHERE movie_id = :movie_id\n    AND user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM ratings
 * WHERE movie_id = :movie_id
 *     AND user_id = :user_id
 * ```
 */
export const deleteRatings = new PreparedQuery<IDeleteRatingsParams,IDeleteRatingsResult>(deleteRatingsIR);


/** 'GetRatingsForUser' parameters type */
export interface IGetRatingsForUserParams {
  user_id?: string | null | void;
}

/** 'GetRatingsForUser' return type */
export interface IGetRatingsForUserResult {
  movie_id: string;
  rating: number;
  slug: string;
}

/** 'GetRatingsForUser' query type */
export interface IGetRatingsForUserQuery {
  params: IGetRatingsForUserParams;
  result: IGetRatingsForUserResult;
}

const getRatingsForUserIR: any = {"usedParamSet":{"user_id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":132,"b":139}]}],"statement":"SELECT\n    r.rating,\n    r.movie_id,\n    m.slug\nFROM\n    ratings r\n    INNER JOIN movies m ON r.movie_id = m.id\nWHERE\n    user_id = :user_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *     r.rating,
 *     r.movie_id,
 *     m.slug
 * FROM
 *     ratings r
 *     INNER JOIN movies m ON r.movie_id = m.id
 * WHERE
 *     user_id = :user_id
 * ```
 */
export const getRatingsForUser = new PreparedQuery<IGetRatingsForUserParams,IGetRatingsForUserResult>(getRatingsForUserIR);


