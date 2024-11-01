// Swagger UI Express Comment Format

interface UserSettingsType {
  isChallenge?: boolean
  isEating?: boolean
  isWorkout?: boolean
  isWater?: boolean
  isAdmin?: boolean
  isHealth?: boolean
}

export class UserSettings {
  isChallenge?: boolean
  isEating?: boolean
  isWorkout?: boolean
  isWater?: boolean
  isAdmin?: boolean
  isHealth?: boolean

  constructor(userSetting?: UserSettingsType) {
    this.isChallenge = userSetting?.isChallenge || false
    this.isEating = userSetting?.isEating || false
    this.isWorkout = userSetting?.isWorkout || false
    this.isWater = userSetting?.isWater || false
    this.isAdmin = userSetting?.isAdmin || true
    this.isHealth = userSetting?.isHealth || false
  }
}
