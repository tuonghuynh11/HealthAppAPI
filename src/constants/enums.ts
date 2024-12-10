export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa,
}
export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
export enum UserRole {
  User,
  Admin
}

export enum MediaType {
  Image,
  Video,
  HLS
}
export enum MediaTypeQuery {
  Image = 'image',
  Video = 'video'
}
export enum TweetAudience {
  Everyone, // 0
  TwitterCircle // 1
}
export enum TweetType {
  Tweet,
  Retweet,
  Comment,
  QuoteTweet
}

export enum EncodingStatus {
  Pending, //Đang chờ ở hàng đợi
  Processing, //Đang encode
  Success, // Encode thành công
  Failed // Encode thất bại
}
export enum Gender {
  Male = 'Male',
  Female = 'Female'
}
export enum UserStatus {
  Normal = 'Normal',
  Ban = 'Ban'
}

export enum NewWordStatus {
  Pending = 'Pending', //Đang chờ ở hàng đợi
  Publishing = 'Publishing', //Đang xuất bản
  Approved = 'Approved', //Đã duyệt
  Rejected = 'Rejected' //Từ bị từ chối
}

export enum FeedbackStatus {
  Pending = 'Pending',
  Answered = 'Answered'
}

export enum LevelType {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}
export enum SetType {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}
export enum WorkoutType {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}
export enum ExerciseCategories {
  Cardio = 'Cardio',
  Strength = 'Strength'
}
export enum GeneralStatus {
  Done = 'Done',
  Undone = 'Undone'
}
export enum MealType {
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner'
}
export enum ChallengeType {
  Fitness = 'Fitness',
  Eating = 'Eating',
  Combo = 'Combo'
}
export enum ChallengeTarget {
  WeightLoss = 'Weight Loss',
  MuscleGain = 'Muscle Gain',
  Maintain = 'Maintain',
  BuildBody = 'Build Body'
}
export enum ChallengeStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Expired = 'Expired'
}
export enum NotificationType {
  Challenge = 'Challenge',
  Eating = 'Eating',
  Workout = 'Workout',
  Water = 'Water',
  Admin = 'Admin',
  Health = 'Health'
}
export enum ContactStatus {
  Read = 'Read',
  Unread = 'Unread',
  Responded = 'Responded'
}
export enum HealthTrackingType {
  Calories_Consumed = 'Calories Consumed',
  Calories_Burned = 'Calories Burned'
}
export enum HealthActivityQueryType {
  All = 'all',
  Water = 'water',
  Consumed = 'consumed',
  Burned = 'burned'
}

export enum MealQueryType {
  All = 'All',
  Breakfast = 'Breakfast',
  Lunch = 'Lunch',
  Dinner = 'Dinner'
}

export enum RoleTypeQueryFilter {
  All = 'All',
  System = 'System',
  Me = 'Me'
}
export enum ExerciseQueryTypeFilter {
  All = 'All',
  Cardio = 'Cardio',
  Strength = 'Strength'
}

export enum WorkoutPlanQueryTypeFilter {
  All = 'All',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced'
}
export enum GeneralQueryStatusFilter {
  All = 'All',
  Done = 'Done',
  Undone = 'Undone'
}
export enum ChallengeQueryTypeFilter {
  All = 'All',
  Fitness = 'Fitness',
  Eating = 'Eating',
  Combo = 'Combo'
}
