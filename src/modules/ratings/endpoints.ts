export const apiBase = '/api';

const ratingBase = `${apiBase}/ratings`;

export const ratingEndpoints = {
  create: `${ratingBase}/:id`,
  getUserRatings: `${ratingBase}/me`,
};
