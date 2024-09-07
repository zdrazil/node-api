-- migrate:up
INSERT INTO movies(id, slug, title, year_of_release)
    VALUES ('8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3', 'movie-1', 'Movie 1', 2020),
('e7619e47-ff83-4523-8fe8-83404739457d', 'movie-2', 'Movie 2', 2019),
('a780a7a4-af4c-4a23-a49f-644573503bef', 'movie-3', 'Movie 3', 2021);

INSERT INTO genres(movie_id, name)
    VALUES ('8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3', 'Action'),
('8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3', 'Thriller'),
('e7619e47-ff83-4523-8fe8-83404739457d', 'Comedy'),
('a780a7a4-af4c-4a23-a49f-644573503bef', 'Drama');

INSERT INTO ratings(user_id, movie_id, rating)
    VALUES ('2ee75e90-f4c6-4de2-8580-300f76fff238', '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3', 4),
('2ee75e90-f4c6-4de2-8580-300f76fff238', 'e7619e47-ff83-4523-8fe8-83404739457d', 3),
('e40b1a3c-6818-4279-b5dc-b5e934ae0a9c', '8f2cdb0e-6a9b-4bbb-a339-e05aa0be5af3', 5),
('e40b1a3c-6818-4279-b5dc-b5e934ae0a9c', 'a780a7a4-af4c-4a23-a49f-644573503bef', 4);

-- migrate:down
