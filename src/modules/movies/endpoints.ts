import { apiBase } from '../ratings/endpoints';

const movieBase = `${apiBase}/movies`;
export const movieEndpoints = {
  create: movieBase,
  delete: `${movieBase}/:id`,
  deleteRating: `${movieBase}/:id/ratings`,
  get: `${movieBase}/:idOrSlug`,
  getAll: `${movieBase}/movies`,
  rate: `${movieBase}/:id/ratings`,
  update: `${movieBase}/:id`,
};
