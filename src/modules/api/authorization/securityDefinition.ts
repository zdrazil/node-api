export const securityDefinitions = {
  JwtToken: {
    description: 'Authorization header token, sample: "Bearer #TOKEN#"',
    in: 'header',
    name: 'Authorization',
    type: 'apiKey',
  },
};
