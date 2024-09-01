import { apiBase } from '../api/endpoints';

const ratingBase = `${apiBase}/ratings`;

export const ratingEndpoints = {
  create: `${ratingBase}/:id`,
  getUserRatings: `${ratingBase}/me`,
};
