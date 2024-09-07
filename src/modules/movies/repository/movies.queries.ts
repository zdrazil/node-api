/** Types generated for queries found in "src/modules/movies/repository/movies.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'CreateMovie' parameters type */
export interface ICreateMovieParams {
  id?: string | null | void;
  slug?: string | null | void;
  title?: string | null | void;
  year_of_release?: number | null | void;
}

/** 'CreateMovie' return type */
export type ICreateMovieResult = void;

/** 'CreateMovie' query type */
export interface ICreateMovieQuery {
  params: ICreateMovieParams;
  result: ICreateMovieResult;
}

const createMovieIR: any = {"usedParamSet":{"id":true,"slug":true,"title":true,"year_of_release":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":66,"b":68}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":70,"b":74}]},{"name":"title","required":false,"transform":{"type":"scalar"},"locs":[{"a":76,"b":81}]},{"name":"year_of_release","required":false,"transform":{"type":"scalar"},"locs":[{"a":83,"b":98}]}],"statement":"INSERT INTO\n  movies (id, slug, title, year_of_release)\nVALUES\n  (:id,:slug,:title,:year_of_release)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   movies (id, slug, title, year_of_release)
 * VALUES
 *   (:id,:slug,:title,:year_of_release)
 * ```
 */
export const createMovie = new PreparedQuery<ICreateMovieParams,ICreateMovieResult>(createMovieIR);


/** 'CreateGenre' parameters type */
export interface ICreateGenreParams {
  movie_id?: string | null | void;
  name?: string | null | void;
}

/** 'CreateGenre' return type */
export type ICreateGenreResult = void;

/** 'CreateGenre' query type */
export interface ICreateGenreQuery {
  params: ICreateGenreParams;
  result: ICreateGenreResult;
}

const createGenreIR: any = {"usedParamSet":{"movie_id":true,"name":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":48,"b":56}]},{"name":"name","required":false,"transform":{"type":"scalar"},"locs":[{"a":58,"b":62}]}],"statement":"INSERT INTO\n  genres (movie_id, name)\nVALUES\n  (:movie_id,:name)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO
 *   genres (movie_id, name)
 * VALUES
 *   (:movie_id,:name)
 * ```
 */
export const createGenre = new PreparedQuery<ICreateGenreParams,ICreateGenreResult>(createGenreIR);


/** 'GetMovieById' parameters type */
export interface IGetMovieByIdParams {
  id?: string | null | void;
  user_id?: string | null | void;
}

/** 'GetMovieById' return type */
export interface IGetMovieByIdResult {
  id: string;
  rating: string | null;
  slug: string;
  title: string;
  user_rating: number;
  year_of_release: number;
}

/** 'GetMovieById' query type */
export interface IGetMovieByIdQuery {
  params: IGetMovieByIdParams;
  result: IGetMovieByIdResult;
}

const getMovieByIdIR: any = {"usedParamSet":{"user_id":true,"id":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":204,"b":211}]},{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":225,"b":227}]}],"statement":"SELECT\n  m.*,\n  round(avg(r.rating), 1) AS rating,\n  myr.rating AS user_rating\nFROM\n  movies m\n  LEFT JOIN ratings r ON m.id = r.movie_id\n  LEFT JOIN ratings myr ON m.id = myr.movie_id\n  AND myr.user_id =:user_id\nWHERE\n  id =:id\nGROUP BY\n  id,\n  user_rating"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   m.*,
 *   round(avg(r.rating), 1) AS rating,
 *   myr.rating AS user_rating
 * FROM
 *   movies m
 *   LEFT JOIN ratings r ON m.id = r.movie_id
 *   LEFT JOIN ratings myr ON m.id = myr.movie_id
 *   AND myr.user_id =:user_id
 * WHERE
 *   id =:id
 * GROUP BY
 *   id,
 *   user_rating
 * ```
 */
export const getMovieById = new PreparedQuery<IGetMovieByIdParams,IGetMovieByIdResult>(getMovieByIdIR);


/** 'GetMovieGenres' parameters type */
export interface IGetMovieGenresParams {
  movie_id?: string | null | void;
}

/** 'GetMovieGenres' return type */
export interface IGetMovieGenresResult {
  name: string;
}

/** 'GetMovieGenres' query type */
export interface IGetMovieGenresQuery {
  params: IGetMovieGenresParams;
  result: IGetMovieGenresResult;
}

const getMovieGenresIR: any = {"usedParamSet":{"movie_id":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":46,"b":54}]}],"statement":"SELECT\n  name\nFROM\n  genres\nWHERE\n  movie_id =:movie_id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   name
 * FROM
 *   genres
 * WHERE
 *   movie_id =:movie_id
 * ```
 */
export const getMovieGenres = new PreparedQuery<IGetMovieGenresParams,IGetMovieGenresResult>(getMovieGenresIR);


/** 'GetMovieBySlug' parameters type */
export interface IGetMovieBySlugParams {
  slug?: string | null | void;
  user_id?: string | null | void;
}

/** 'GetMovieBySlug' return type */
export interface IGetMovieBySlugResult {
  id: string;
  rating: string | null;
  slug: string;
  title: string;
  user_rating: number;
  year_of_release: number;
}

/** 'GetMovieBySlug' query type */
export interface IGetMovieBySlugQuery {
  params: IGetMovieBySlugParams;
  result: IGetMovieBySlugResult;
}

const getMovieBySlugIR: any = {"usedParamSet":{"user_id":true,"slug":true},"params":[{"name":"user_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":204,"b":211}]},{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":227,"b":231}]}],"statement":"SELECT\n  m.*,\n  round(avg(r.rating), 1) AS rating,\n  myr.rating AS user_rating\nFROM\n  movies m\n  LEFT JOIN ratings r ON m.id = r.movie_id\n  LEFT JOIN ratings myr ON m.id = myr.movie_id\n  AND myr.user_id =:user_id\nWHERE\n  slug =:slug\nGROUP BY\n  id,\n  user_rating"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   m.*,
 *   round(avg(r.rating), 1) AS rating,
 *   myr.rating AS user_rating
 * FROM
 *   movies m
 *   LEFT JOIN ratings r ON m.id = r.movie_id
 *   LEFT JOIN ratings myr ON m.id = myr.movie_id
 *   AND myr.user_id =:user_id
 * WHERE
 *   slug =:slug
 * GROUP BY
 *   id,
 *   user_rating
 * ```
 */
export const getMovieBySlug = new PreparedQuery<IGetMovieBySlugParams,IGetMovieBySlugResult>(getMovieBySlugIR);


/** 'DeleteGenres' parameters type */
export interface IDeleteGenresParams {
  movie_id?: string | null | void;
}

/** 'DeleteGenres' return type */
export type IDeleteGenresResult = void;

/** 'DeleteGenres' query type */
export interface IDeleteGenresQuery {
  params: IDeleteGenresParams;
  result: IDeleteGenresResult;
}

const deleteGenresIR: any = {"usedParamSet":{"movie_id":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":37,"b":45}]}],"statement":"DELETE FROM genres\nWHERE\n  movie_id =:movie_id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM genres
 * WHERE
 *   movie_id =:movie_id
 * ```
 */
export const deleteGenres = new PreparedQuery<IDeleteGenresParams,IDeleteGenresResult>(deleteGenresIR);


/** 'UpdateMovie' parameters type */
export interface IUpdateMovieParams {
  id?: string | null | void;
  slug?: string | null | void;
  title?: string | null | void;
  year_of_release?: number | null | void;
}

/** 'UpdateMovie' return type */
export type IUpdateMovieResult = void;

/** 'UpdateMovie' query type */
export interface IUpdateMovieQuery {
  params: IUpdateMovieParams;
  result: IUpdateMovieResult;
}

const updateMovieIR: any = {"usedParamSet":{"slug":true,"title":true,"year_of_release":true,"id":true},"params":[{"name":"slug","required":false,"transform":{"type":"scalar"},"locs":[{"a":26,"b":30}]},{"name":"title","required":false,"transform":{"type":"scalar"},"locs":[{"a":42,"b":47}]},{"name":"year_of_release","required":false,"transform":{"type":"scalar"},"locs":[{"a":69,"b":84}]},{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":98,"b":100}]}],"statement":"UPDATE movies\nSET\n  slug =:slug,\n  title =:title,\n  year_of_release =:year_of_release\nWHERE\n  id =:id"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE movies
 * SET
 *   slug =:slug,
 *   title =:title,
 *   year_of_release =:year_of_release
 * WHERE
 *   id =:id
 * ```
 */
export const updateMovie = new PreparedQuery<IUpdateMovieParams,IUpdateMovieResult>(updateMovieIR);


/** 'DeleteRatings' parameters type */
export interface IDeleteRatingsParams {
  movie_id?: string | null | void;
}

/** 'DeleteRatings' return type */
export type IDeleteRatingsResult = void;

/** 'DeleteRatings' query type */
export interface IDeleteRatingsQuery {
  params: IDeleteRatingsParams;
  result: IDeleteRatingsResult;
}

const deleteRatingsIR: any = {"usedParamSet":{"movie_id":true},"params":[{"name":"movie_id","required":false,"transform":{"type":"scalar"},"locs":[{"a":38,"b":46}]}],"statement":"DELETE FROM ratings\nWHERE\n  movie_id =:movie_id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM ratings
 * WHERE
 *   movie_id =:movie_id
 * ```
 */
export const deleteRatings = new PreparedQuery<IDeleteRatingsParams,IDeleteRatingsResult>(deleteRatingsIR);


/** 'DeleteMovie' parameters type */
export interface IDeleteMovieParams {
  id?: string | null | void;
}

/** 'DeleteMovie' return type */
export type IDeleteMovieResult = void;

/** 'DeleteMovie' query type */
export interface IDeleteMovieQuery {
  params: IDeleteMovieParams;
  result: IDeleteMovieResult;
}

const deleteMovieIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":31,"b":33}]}],"statement":"DELETE FROM movies\nWHERE\n  id =:id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM movies
 * WHERE
 *   id =:id
 * ```
 */
export const deleteMovie = new PreparedQuery<IDeleteMovieParams,IDeleteMovieResult>(deleteMovieIR);


/** 'MovieExists' parameters type */
export interface IMovieExistsParams {
  id?: string | null | void;
}

/** 'MovieExists' return type */
export interface IMovieExistsResult {
  count: string | null;
}

/** 'MovieExists' query type */
export interface IMovieExistsQuery {
  params: IMovieExistsParams;
  result: IMovieExistsResult;
}

const movieExistsIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":44,"b":46}]}],"statement":"SELECT\n  count(1)\nFROM\n  movies\nWHERE\n  id =:id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   count(1)
 * FROM
 *   movies
 * WHERE
 *   id =:id
 * ```
 */
export const movieExists = new PreparedQuery<IMovieExistsParams,IMovieExistsResult>(movieExistsIR);


/** 'GetMovieCount' parameters type */
export interface IGetMovieCountParams {
  title?: string | null | void;
  year_of_release?: number | null | void;
}

/** 'GetMovieCount' return type */
export interface IGetMovieCountResult {
  count: string | null;
}

/** 'GetMovieCount' query type */
export interface IGetMovieCountQuery {
  params: IGetMovieCountParams;
  result: IGetMovieCountResult;
}

const getMovieCountIR: any = {"usedParamSet":{"title":true,"year_of_release":true},"params":[{"name":"title","required":false,"transform":{"type":"scalar"},"locs":[{"a":43,"b":48},{"a":89,"b":94}]},{"name":"year_of_release","required":false,"transform":{"type":"scalar"},"locs":[{"a":116,"b":131},{"a":174,"b":189}]}],"statement":"SELECT\n  count(id)\nFROM\n  movies\nWHERE\n  (\n:title::TEXT IS NULL\n    OR title LIKE ('%' ||:title || '%')\n  )\n  AND (\n:year_of_release::INTEGER IS NULL\n    OR year_of_release =:year_of_release\n  )"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   count(id)
 * FROM
 *   movies
 * WHERE
 *   (
 * :title::TEXT IS NULL
 *     OR title LIKE ('%' ||:title || '%')
 *   )
 *   AND (
 * :year_of_release::INTEGER IS NULL
 *     OR year_of_release =:year_of_release
 *   )
 * ```
 */
export const getMovieCount = new PreparedQuery<IGetMovieCountParams,IGetMovieCountResult>(getMovieCountIR);


