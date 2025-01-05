import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
import { recommendCalorieAndTimeToAchieveGoal } from '~/utils/recommend'
import { ActivityLevel, Gender, GoalDetailStatus, WorkoutType } from '~/constants/enums'
import { GoalDetail } from '~/models/schemas/GoalDetail.schema'
import { DishRecommendReqBody, DishRecommendReqQuery } from '~/models/requests/Recommend.requests'
import axios from 'axios'
import FormData from 'form-data'
import { getSetExercises } from '~/utils/commons'

class RecommendService {
  async createCalorieAndTimeToGoalRecommendForUser({ user_id }: { user_id: string }) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const isPossibleToRecommend =
      user?.weight && user.goal_weight && user.height && user.date_of_birth && user.activityLevel
    if (!isPossibleToRecommend) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_ENOUGH_INFO,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    if (isPossibleToRecommend) {
      const age = new Date().getFullYear() - user.date_of_birth!.getFullYear()
      const recommend = recommendCalorieAndTimeToAchieveGoal({
        currentWeight: Number(user.weight),
        desiredWeight: Number(user.goal_weight),
        height: Number(user.height),
        age,
        gender: user.gender as Gender,
        activityLevel: user.activityLevel as ActivityLevel
      })
      const goalDetail = new GoalDetail({
        days: recommend.daysToGoal,
        goal: recommend.totalCalories, // Tổng thâm hụt caloies
        progress: 0,
        status: GoalDetailStatus.UnStart
      })
      await databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            goalDetail: goalDetail
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
      return goalDetail
    }
  }

  async getDishRecommend({ body, query }: { body: DishRecommendReqBody; query: DishRecommendReqQuery }) {
    const dishRecommend = await axios.post(
      'https://dishes-recommendation-api.onrender.com/recommend',
      { ...body },
      {
        params: {
          query: {
            ...query
          }
        }
      }
    )
    return dishRecommend.data
  }
  async getWorkoutPlanRecommend({ body }: { body: any }) {
    const formData = new FormData()
    formData.append('height', body.height)
    formData.append('weight', body.weight)
    formData.append('age', body.age)
    formData.append('gender', body.gender)
    formData.append('image', body.image)
    formData.append('diseases_info', body.diseases_info)
    formData.append('num_of_exercises', body.num_of_exercises)
    formData.append('dream_weight', body.dream_weight)

    const exercisesRecommend = await axios.post('https://personalized-fitness-recommender-system.onrender.com/api', {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    })
    const result = exercisesRecommend.data.workout_plan.filter(
      (item: any, index: number, self: any) => index === self.findIndex((t: any) => t.id === item.id)
    )

    // Average amount of calories consumed per day
    const calorie_average = body.gender === 'Male' ? 2500 : 2000

    // calo change per day (calories consumed per day)
    const calorieChangePerDay = 200
    //  Recommend Calorie And Time To Achieve Goal
    const { totalCalories, daysToGoal } = recommendCalorieAndTimeToAchieveGoal({
      currentWeight: Number(body.weight),
      desiredWeight: Number(body.dream_weight),
      height: Number(body.height),
      age: Number(body.age),
      gender: body.gender as Gender,
      activityLevel: body?.activityLevel || ActivityLevel.Light
    })

    // totalCalories là tổng lượng calories thâm hụt
    //  Lượng calories cần thâm hụt mỗi ngày

    const calorie_burned_per_day = calorieChangePerDay

    const workout_plan_details = []

    let maxPracticeDays = 5
    const daysToGoalInt = Math.round(daysToGoal)
    for (let i = 1; i <= daysToGoalInt; i++) {
      // Calculate the week number based on the current day
      const week = Math.ceil(i / 7) + 1
      if (maxPracticeDays === 0) {
        workout_plan_details.push({
          sets: [],
          day: i,
          week
        })
        if (i + 1 <= daysToGoalInt) {
          workout_plan_details.push({
            sets: [],
            day: i + 1,
            week
          })
        }
        maxPracticeDays = 5
        i += 2
      }
      workout_plan_details.push({
        sets: getSetExercises({
          exercise_list: result,
          total_calories: calorie_burned_per_day,
          number_of_sets: 2,
          number_exercise_of_set: 2
        }),
        day: i,
        week
      })
      maxPracticeDays--
    }

    let estimated_calories_burned = 0
    workout_plan_details.forEach((detail) => {
      detail.sets.forEach((set) => {
        estimated_calories_burned += set.estimated_calories_burned
      })
    })

    const today = new Date() // Get the current date
    const futureDate = new Date() // Create a copy of the current date
    futureDate.setDate(today.getDate() + daysToGoalInt) // Add 10 days to the current date
    return {
      need: exercisesRecommend.data.need,
      workout_plan: {
        name: 'Plan ' + new Date().getTime(),
        description: '',
        number_of_set: workout_plan_details.length,
        estimated_calories_burned,
        type: WorkoutType.Beginner,
        start_date: today.toISOString(),
        end_date: futureDate.toISOString(),
        estimate_date: daysToGoalInt,
        details: workout_plan_details
      }
    }
  }
}
const recommendService = new RecommendService()
export default recommendService
