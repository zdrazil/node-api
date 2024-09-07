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
    cancellationToken,
    movieId,
    rating,
    userId,
  }: {
    cancellationToken: boolean;
    movieId: string;
    rating: number;
    userId: string;
  }): Promise<boolean> {
    const movieExists = await movieRepository.existsById({
      cancellationToken,
      id: movieId,
    });

    if (!movieExists) {
      return false;
    }

    return ratingRepository.rateMovie({
      cancellationToken,
      movieId,
      rating,
      userId,
    });
  }

  return {
    deleteRating: ratingRepository.deleteRating,
    getRatingsForUser: ratingRepository.getRatingsForUser,
    rateMovie,
  };
};
