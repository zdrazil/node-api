import { apiBase } from '../../api/endpoints';

const movieBase = `${apiBase}/movies`;
export const movieEndpoints = {
  create: movieBase,
  delete: `${movieBase}/:id`,
  deleteRating: `${movieBase}/:id/ratings`,
  get: `${movieBase}/:idOrSlug`,
  getAll: movieBase,
  rate: `${movieBase}/:id/ratings`,
  update: `${movieBase}/:id`,
};
