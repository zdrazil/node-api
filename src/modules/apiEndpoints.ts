export const apiBase = '/api';

const ratingBase = `${apiBase}/ratings`;
export const ratingEndpoints = {
  getUserRatings: `${ratingBase}/me`,
};
