import { MovieRepository } from '../movies/repository/repository';
import { RatingRepository } from './repository/repository';

export type RatingService = ReturnType<typeof createRatingService>;

export const createRatingService = ({
  movieRepository,
  ratingRepository,
}: {
  movieRepository: MovieRepository;
  ratingRepository: RatingRepository;
}) => {
  async function rateMovie({
    movieId,
    rating,
    userId,
  }: {
    movieId: string;
    rating: number;
    userId: string;
  }): Promise<boolean> {
    const movieExists = await movieRepository.existsById({ id: movieId });

    if (!movieExists) {
      return false;
    }

    return ratingRepository.rateMovie({ movieId, rating, userId });
  }

  const deleteRating = ratingRepository.deleteRating;

  const getRatingsForUser = ratingRepository.getRatingsForUser;

  return {
    deleteRating,
    getRatingsForUser,
    rateMovie,
  };
};
