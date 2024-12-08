import { ObjectId } from 'mongodb'
import databaseService from './database.services'
import Meals from '~/models/schemas/Meals.schema'
import { ExerciseQueryTypeFilter, MealType, UserRole } from '~/constants/enums'
import { EXERCISE_MESSAGES, MEALS_MESSAGES } from '~/constants/messages'
import { UpdateExerciseReqBody } from '~/models/requests/Exercise.requests'
import { ChallengeReqBody } from '~/models/requests/Challenge.requests'
import WorkoutPlans from '~/models/schemas/WorkoutPlans.schema'
import { omit } from 'lodash'
import workoutPlanDetailsService from './workout-plan-details.services'

class ChallengesService {
  async search({
    search,
    page,
    limit,
    sort_by = 'name',
    order_by = 'ASC',
    type
  }: {
    search?: string
    type: ExerciseQueryTypeFilter
    page?: number
    limit?: number
    sort_by: string
    order_by: string
  }) {
    const conditions: any = {}
    if (search) {
      conditions.name = {
        $regex: search,
        $options: 'i'
      }
    }

    if (type !== ExerciseQueryTypeFilter.All) {
      conditions.category = type
    }

    const [exercises, total] = await Promise.all([
      databaseService.exercises
        .find(conditions, {
          skip: page && limit ? (page - 1) * limit : undefined,
          limit: limit,
          sort: {
            [sort_by]: order_by === 'ASC' ? 1 : -1
          }
        })
        .toArray(),
      await databaseService.exercises.countDocuments(conditions)
    ])
    return {
      exercises,
      total
    }
  }

  async getAll() {
    const exercises = await databaseService.exercises
      .find(
        {},
        {
          projection: {
            id: 1,
            name: 1
          }
        }
      )
      .toArray()
    return exercises
  }

  async getById({ id }: { id: string }) {
    const exercise = await databaseService.exercises.findOne({
      _id: new ObjectId(id)
    })
    if (!exercise) {
      throw new Error(EXERCISE_MESSAGES.EXERCISE_NOT_FOUND)
    }
    return exercise
  }
  async getMealByDate({ date, user_id }: { date: string; user_id: string }) {
    const inputDate = new Date(date)

    // Get start and end of the day for date range search
    const startOfDay = new Date(inputDate)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(inputDate)
    endOfDay.setUTCHours(23, 59, 59, 999)

    const meals = await databaseService.meals
      .find(
        {
          user_id: new ObjectId(user_id),
          date: { $gte: startOfDay, $lte: endOfDay }
        },
        {
          projection: {
            dishes: 0
          },
          sort: {
            calories: 1
          }
        }
      )
      .toArray()
    if (!meals) {
      throw new Error(MEALS_MESSAGES.MEAL_NOT_FOUND)
    }
    const breakfasts = meals.filter((meal: Meals) => meal.meal_type === MealType.Breakfast)
    const lunches = meals.filter((meal: Meals) => meal.meal_type === MealType.Lunch)
    const dinners = meals.filter((meal: Meals) => meal.meal_type === MealType.Dinner)
    return {
      breakfasts,
      lunches,
      dinners
    }
  }
  async add({ challenge, role, userId }: { challenge: ChallengeReqBody; role: UserRole; userId: string }) {
    let newMeal: Meals | undefined = undefined
    let newWorkoutPlan: WorkoutPlans | undefined = undefined
    if (challenge.meal) {
      newMeal = new Meals({
        user_id: undefined,
        ...challenge.meal,
        _id: new ObjectId()
      })
    }
    if (challenge.workout_plan) {
      newWorkoutPlan = new WorkoutPlans({
        ...omit(challenge.workout_plan, ['details']),
        details: [],
        user_id: undefined,
        _id: new ObjectId()
      })
      const workoutPlanInserted = await databaseService.workoutPlans.insertOne(newWorkoutPlan)

      const workoutPlanDetails = await Promise.all(
        challenge.workout_plan.details.map((workout_plan_detail) =>
          workoutPlanDetailsService.add({
            workout_plan_detail,
            user_id: userId,
            role,
            workoutPlanId: workoutPlanInserted.insertedId.toString()
          })
        )
      )

      newWorkoutPlan.details = workoutPlanDetails
      newWorkoutPlan._id = workoutPlanInserted.insertedId

      await databaseService.workoutPlans.deleteOne({ _id: workoutPlanInserted.insertedId })
    }

    const challengeInserted = await databaseService.challenges.insertOne({
      ...challenge,
      meal: newMeal || undefined,
      workout_plan: newWorkoutPlan || undefined
    })

    return {
      ...challenge,
      meal: newMeal,
      workout_plan: newWorkoutPlan,
      _id: challengeInserted.insertedId
    }
  }
  async update({ id, updateExercise }: { id: string; updateExercise: UpdateExerciseReqBody }) {
    const exercise = await databaseService.exercises.findOne({ _id: new ObjectId(id) })
    if (!exercise) {
      throw new Error(EXERCISE_MESSAGES.EXERCISE_NOT_FOUND)
    }
    const result = await databaseService.exercises.findOneAndUpdate(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          ...updateExercise
        },
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after' // Trả về giá trị mới
      }
    )

    return result
  }
  async delete({ id }: { id: string }) {
    const exercise = await databaseService.exercises.findOne({ _id: new ObjectId(id) })
    if (!exercise) {
      throw new Error(EXERCISE_MESSAGES.EXERCISE_NOT_FOUND)
    }

    const isUsedBySetExercise = await databaseService.set_exercises
      .find({
        exercises: {
          _id: new ObjectId(id)
        }
      })
      .toArray()

    if (isUsedBySetExercise.length > 0) {
      throw new Error(EXERCISE_MESSAGES.EXERCISE_IS_USED)
    }

    const result = await databaseService.exercises.deleteOne({ _id: new ObjectId(id) })

    return result
  }
}
const challengesService = new ChallengesService()
export default challengesService
