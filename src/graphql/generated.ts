import type { GraphQLResolveInfo } from "graphql";
import type { MercuriusContext } from "mercurius";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) =>
  | Promise<import("mercurius-codegen").DeepPartial<TResult>>
  | import("mercurius-codegen").DeepPartial<TResult>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  _FieldSet: any;
};

export enum OrderDirection {
  asc = "asc",
  desc = "desc",
}

export enum SortByField {
  TITLE = "TITLE",
  YEAR = "YEAR",
}

export type Movie = {
  __typename?: "Movie";
  id: Scalars["ID"];
  title: Scalars["String"];
  yearOfRelease: Scalars["Int"];
  genres: Array<Scalars["String"]>;
  rating?: Maybe<Scalars["Float"]>;
  userRating?: Maybe<Scalars["Float"]>;
};

export enum MovieSortField {
  TITLE = "TITLE",
  YEAR = "YEAR",
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}

export type Query = {
  __typename?: "Query";
  movies: MovieConnection;
  movie?: Maybe<Movie>;
  myRatings: Array<Rating>;
};

export type QuerymoviesArgs = {
  title?: InputMaybe<Scalars["String"]>;
  year?: InputMaybe<Scalars["Int"]>;
  sortField?: InputMaybe<MovieSortField>;
  sortOrder?: InputMaybe<SortOrder>;
  first?: InputMaybe<Scalars["Int"]>;
  after?: InputMaybe<Scalars["ID"]>;
};

export type QuerymovieArgs = {
  idOrSlug: Scalars["String"];
};

export type Rating = {
  __typename?: "Rating";
  id: Scalars["ID"];
  movie: Movie;
  rating: Scalars["Int"];
};

export type PageInfo = {
  __typename?: "PageInfo";
  startCursor?: Maybe<Scalars["String"]>;
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
};

export type MovieEdge = {
  __typename?: "MovieEdge";
  cursor: Scalars["ID"];
  node?: Maybe<Movie>;
};

export type MovieConnection = {
  __typename?: "MovieConnection";
  edges: Array<MovieEdge>;
  pageInfo: PageInfo;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  OrderDirection: OrderDirection;
  SortByField: SortByField;
  Movie: ResolverTypeWrapper<Movie>;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  Float: ResolverTypeWrapper<Scalars["Float"]>;
  MovieSortField: MovieSortField;
  SortOrder: SortOrder;
  Query: ResolverTypeWrapper<{}>;
  Rating: ResolverTypeWrapper<Rating>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  MovieEdge: ResolverTypeWrapper<MovieEdge>;
  MovieConnection: ResolverTypeWrapper<MovieConnection>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Movie: Movie;
  ID: Scalars["ID"];
  String: Scalars["String"];
  Int: Scalars["Int"];
  Float: Scalars["Float"];
  Query: {};
  Rating: Rating;
  PageInfo: PageInfo;
  Boolean: Scalars["Boolean"];
  MovieEdge: MovieEdge;
  MovieConnection: MovieConnection;
};

export type connectionDirectiveArgs = {
  prefix?: Maybe<Scalars["String"]>;
};

export type connectionDirectiveResolver<
  Result,
  Parent,
  ContextType = MercuriusContext,
  Args = connectionDirectiveArgs,
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MovieResolvers<
  ContextType = MercuriusContext,
  ParentType extends
    ResolversParentTypes["Movie"] = ResolversParentTypes["Movie"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  yearOfRelease?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  genres?: Resolver<Array<ResolversTypes["String"]>, ParentType, ContextType>;
  rating?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  userRating?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = MercuriusContext,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  movies?: Resolver<
    ResolversTypes["MovieConnection"],
    ParentType,
    ContextType,
    Partial<QuerymoviesArgs>
  >;
  movie?: Resolver<
    Maybe<ResolversTypes["Movie"]>,
    ParentType,
    ContextType,
    RequireFields<QuerymovieArgs, "idOrSlug">
  >;
  myRatings?: Resolver<
    Array<ResolversTypes["Rating"]>,
    ParentType,
    ContextType
  >;
};

export type RatingResolvers<
  ContextType = MercuriusContext,
  ParentType extends
    ResolversParentTypes["Rating"] = ResolversParentTypes["Rating"],
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  movie?: Resolver<ResolversTypes["Movie"], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PageInfoResolvers<
  ContextType = MercuriusContext,
  ParentType extends
    ResolversParentTypes["PageInfo"] = ResolversParentTypes["PageInfo"],
> = {
  startCursor?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  endCursor?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>;
  hasPreviousPage?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType
  >;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieEdgeResolvers<
  ContextType = MercuriusContext,
  ParentType extends
    ResolversParentTypes["MovieEdge"] = ResolversParentTypes["MovieEdge"],
> = {
  cursor?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes["Movie"]>, ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MovieConnectionResolvers<
  ContextType = MercuriusContext,
  ParentType extends
    ResolversParentTypes["MovieConnection"] = ResolversParentTypes["MovieConnection"],
> = {
  edges?: Resolver<Array<ResolversTypes["MovieEdge"]>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>;
  isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = MercuriusContext> = {
  Movie?: MovieResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Rating?: RatingResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  MovieEdge?: MovieEdgeResolvers<ContextType>;
  MovieConnection?: MovieConnectionResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = MercuriusContext> = {
  connection?: connectionDirectiveResolver<any, any, ContextType>;
};

export type Loader<TReturn, TObj, TParams, TContext> = (
  queries: Array<{
    obj: TObj;
    params: TParams;
  }>,
  context: TContext & {
    reply: import("fastify").FastifyReply;
  },
) => Promise<Array<import("mercurius-codegen").DeepPartial<TReturn>>>;
export type LoaderResolver<TReturn, TObj, TParams, TContext> =
  | Loader<TReturn, TObj, TParams, TContext>
  | {
      loader: Loader<TReturn, TObj, TParams, TContext>;
      opts?: {
        cache?: boolean;
      };
    };
export interface Loaders<
  TContext = import("mercurius").MercuriusContext & {
    reply: import("fastify").FastifyReply;
  },
> {
  Movie?: {
    id?: LoaderResolver<Scalars["ID"], Movie, {}, TContext>;
    title?: LoaderResolver<Scalars["String"], Movie, {}, TContext>;
    yearOfRelease?: LoaderResolver<Scalars["Int"], Movie, {}, TContext>;
    genres?: LoaderResolver<Array<Scalars["String"]>, Movie, {}, TContext>;
    rating?: LoaderResolver<Maybe<Scalars["Float"]>, Movie, {}, TContext>;
    userRating?: LoaderResolver<Maybe<Scalars["Float"]>, Movie, {}, TContext>;
  };

  Rating?: {
    id?: LoaderResolver<Scalars["ID"], Rating, {}, TContext>;
    movie?: LoaderResolver<Movie, Rating, {}, TContext>;
    rating?: LoaderResolver<Scalars["Int"], Rating, {}, TContext>;
  };

  PageInfo?: {
    startCursor?: LoaderResolver<
      Maybe<Scalars["String"]>,
      PageInfo,
      {},
      TContext
    >;
    endCursor?: LoaderResolver<
      Maybe<Scalars["String"]>,
      PageInfo,
      {},
      TContext
    >;
    hasNextPage?: LoaderResolver<Scalars["Boolean"], PageInfo, {}, TContext>;
    hasPreviousPage?: LoaderResolver<
      Scalars["Boolean"],
      PageInfo,
      {},
      TContext
    >;
  };

  MovieEdge?: {
    cursor?: LoaderResolver<Scalars["ID"], MovieEdge, {}, TContext>;
    node?: LoaderResolver<Maybe<Movie>, MovieEdge, {}, TContext>;
  };

  MovieConnection?: {
    edges?: LoaderResolver<Array<MovieEdge>, MovieConnection, {}, TContext>;
    pageInfo?: LoaderResolver<PageInfo, MovieConnection, {}, TContext>;
  };
}
declare module "mercurius" {
  interface IResolvers
    extends Resolvers<import("mercurius").MercuriusContext> {}
  interface MercuriusLoaders extends Loaders {}
}
