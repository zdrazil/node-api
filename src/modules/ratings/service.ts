import { MovieRepository } from '../movies/repository';
import { RatingRepository } from './repository';

export type ratingService = ReturnType<typeof createRatingService>;

export const createRatingService = ({
  ratingRepository,
  movieRepository,
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
    if (rating <= 0 || rating > 5) {
      throw new ValidationException([
        {
          PropertyName: 'Rating',
          ErrorMessage: 'Rating must be between 1 and 5.',
        },
      ]);
    }

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
