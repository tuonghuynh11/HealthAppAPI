import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from './jwt'
import { envConfig } from '~/constants/config'
import databaseService from '~/services/database.services'
import { SetType } from '~/constants/enums'

interface ExerciseData {
  calories_per_rep: number
  reps_per_round: number
  time_per_round: number // in minutes
  rest_time_per_round: number // in minutes
}

interface ExercisePlan {
  exercise_name: string
  calories_to_burn: number
  total_reps_needed: number
  rounds_needed: number
  total_time_needed: number // in minutes
  rest_time_per_round: number // in minutes
}
export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.jwtSecretAccessToken
    })
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: 'Access Token Error:' + capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  return true
}

export const numberOfDaysBetweenTwoDates = (date1: Date, date2: Date) => {
  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(date2.getTime() - date1.getTime())

  // Convert the time difference to days
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return Number(diffDays)
}

export const secondsToTime = (seconds: number) => {
  const hours: string = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes: string = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const secs: string = (seconds % 60).toString().padStart(2, '0')

  return `${hours}:${minutes}:${secs}`
}

export const generateOTP = (length: number): string => {
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10) // Generates a digit from 0 to 9
  }
  return otp
}

export const generatePassword = (length: number): string => {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?'

  const allChars = upperCaseChars + lowerCaseChars + numberChars + symbolChars
  let password = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length)
    password += allChars[randomIndex]
  }

  return password
}

export const getNowDateWithoutTime = () => {
  //YYYY-MM-DD
  const now = new Date()
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  return formattedDate
}

export const IsEmailExist = async (email: string) => {
  const user = await databaseService.users.findOne({ email })
  return !!user
}
export const IsUsernameExisted = async (username: string) => {
  const user = await databaseService.users.findOne({ username })
  return !!user
}
export const IsPasswordValid = async (password: string) => {
  // Example Google-like format requirements:
  // - At least 8 characters
  // - Contains at least one uppercase letter
  // - Contains at least one lowercase letter
  // - Contains at least one digit
  // - Contains at least one special character (!@#$%^&* etc.)
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

  return passwordRegex.test(password)
}

export const IsHeightValid = async (height: number) => {
  return height > 0
}
export const IsWeightValid = async (weight: number) => {
  return weight > 0
}
export const IsWeightGoalValid = async (weightGoal: number) => {
  return weightGoal > 0
}

function calculateExercisePlan(exerciseName: string, caloriesToBurn: number): ExercisePlan {
  // Predefined values for exercises
  const exerciseData: { [key: string]: ExerciseData } = {
    'Push Up': { calories_per_rep: 0.25, reps_per_round: 20, time_per_round: 5, rest_time_per_round: 1 },
    "Deadlift": { calories_per_rep: 0.5, reps_per_round: 10, time_per_round: 6, rest_time_per_round: 1 },
    "Squats": { calories_per_rep: 0.3, reps_per_round: 15, time_per_round: 4, rest_time_per_round: 1 },
    "Plank": { calories_per_rep: 0.1, reps_per_round: 1, time_per_round: 30, rest_time_per_round: 1 }, // Plank held for time
    "Burpees": { calories_per_rep: 0.6, reps_per_round: 10, time_per_round: 8, rest_time_per_round: 1 },
    'Jumping Jacks': { calories_per_rep: 0.2, reps_per_round: 30, time_per_round: 3, rest_time_per_round: 1 },
    'Mountain Climbers': { calories_per_rep: 0.3, reps_per_round: 20, time_per_round: 5, rest_time_per_round: 1 },
    'Pull Up': { calories_per_rep: 0.8, reps_per_round: 8, time_per_round: 7, rest_time_per_round: 1 },
    'Bicycle Crunches': { calories_per_rep: 0.15, reps_per_round: 20, time_per_round: 4, rest_time_per_round: 1 },
    'Leg Raise': { calories_per_rep: 0.2, reps_per_round: 15, time_per_round: 5, rest_time_per_round: 1 }
  }

  // Get data for the specified exercise
  const data = exerciseData[exerciseName]
  if (data) {
    const { calories_per_rep, reps_per_round, time_per_round, rest_time_per_round } = data

    // Calculate total reps needed
    const total_reps_needed = caloriesToBurn / calories_per_rep

    // Calculate number of rounds needed
    const rounds_needed = total_reps_needed / reps_per_round

    // Calculate total time needed (including rest time)
    const total_time_needed = rounds_needed * (time_per_round + rest_time_per_round)

    return {
      exercise_name: exerciseName,
      calories_to_burn: caloriesToBurn,
      total_reps_needed: total_reps_needed,
      rounds_needed: rounds_needed,
      total_time_needed: total_time_needed,
      rest_time_per_round: rest_time_per_round
    }
  } else {
    return {
      exercise_name: '',
      calories_to_burn: 0,
      total_reps_needed: 0,
      rounds_needed: 0,
      total_time_needed: 0,
      rest_time_per_round: 0
    }
  }
}

export const getSetExercises = ({
  exercise_list,
  total_calories,
  number_of_sets = 3,
  number_exercise_of_set = 1
}: {
  exercise_list: any[]
  total_calories: number
  number_of_sets: number
  number_exercise_of_set: number
}) => {
  const caloriesPerSets = total_calories / number_of_sets
  const caloriesPerExercise = caloriesPerSets / number_exercise_of_set
  const exercisePlan: any[] = []
  for (let i = 0; i < number_of_sets; i++) {
    const exercises = []
    let index = 0
    for (let j = 0; j < number_exercise_of_set; j++) {
      if (index >= exercise_list.length) {
        index = 0
      }
      const exercise = exercise_list[index]
      const { total_reps_needed, rounds_needed, total_time_needed, rest_time_per_round } = calculateExercisePlan(
        exercise.name,
        caloriesPerExercise
      )
      exercises.push({
        exercise_id: exercise.id,
        duration: total_time_needed, // minutes
        reps: total_reps_needed,
        round: rounds_needed,
        rest_per_round: rest_time_per_round, // minutes
        estimated_calories_burned: caloriesPerExercise // kcal
      })
      index++
    }
    // Remove the first two elements (1 and 2)
    const removedElements = exercise_list.splice(0, number_exercise_of_set)

    // Add the removed elements to the end of the original array
    exercise_list.push(...removedElements)
    exercisePlan.push({
      name: `Set ${i + 1}`,
      type: SetType.Beginner,
      number_of_exercises: number_exercise_of_set,
      set_exercises: exercises
    })
  }

  return exercisePlan
}
