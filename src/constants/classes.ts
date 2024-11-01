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

interface WaterType {
  date: Date
  goal: number
  step: number
  progress: number
  created_at?: Date
  updated_at?: Date
}

export class Water {
  date: Date
  goal: number
  step: number
  progress: number
  created_at?: Date
  updated_at?: Date

  constructor(waterType: WaterType) {
    this.date = waterType.date
    this.goal = waterType.goal
    this.step = waterType.step
    this.progress = waterType.progress
    this.created_at = waterType.created_at || new Date()
    this.updated_at = waterType.updated_at || new Date()
  }
}
