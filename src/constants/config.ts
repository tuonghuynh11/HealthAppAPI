import dotenv from 'dotenv'
dotenv.config()
export const envConfig = {
  port: (process.env.PORT as string) || 4000,
  host: process.env.HOST as string,
  dbName: process.env.DB_NAME as string,
  dbUsername: process.env.DB_USERNAME as string,
  dbPassword: process.env.DB_PASSWORD as string,
  dbUsersCollection: process.env.DB_USERS_COLLECTION as string,
  dbHealthTrackingsCollection: process.env.DB_HEALTH_TRACKING_COLLECTION as string,
  dbHealthTrackingDetailsCollection: process.env.DB_HEALTH_TRACKING_DETAIL_COLLECTION as string,
  dbWatersCollection: process.env.DB_WATER_COLLECTION as string,
  dbMealsCollection: process.env.DB_MEAL_COLLECTION as string,
  dbRefreshTokensCollection: process.env.DB_REFRESH_TOKENS_COLLECTION as string,
  dbChallengesCollection: process.env.DB_CHALLENGES_COLLECTION as string,

  passwordSecret: process.env.PASSWORD_SECRET as string,
  jwtSecretAccessToken: process.env.JWT_SECRET_ACCESS_TOKEN as string,
  jwtSecretRefreshToken: process.env.JWT_SECRET_REFRESH_TOKEN as string,
  jwtSecretEmailVerifyToken: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
  jwtSecretForgotPasswordToken: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
  emailVerifyTokenExpiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN as string,
  forgotPasswordTokenExpiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN as string,
  cloud_name: process.env.CLOUD_NAME as string,
  api_key: process.env.API_KEY as string,
  api_secret: process.env.API_SECRET as string
  // awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  // awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  // awsRegion: process.env.AWS_REGION as string,
  // sesFromAddress: process.env.SES_FROM_ADDRESS as string,
  // s3BucketName: process.env.S3_BUCKET_NAME as string
}
