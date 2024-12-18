import databaseService from './database.services'
import { ErrorWithStatus } from '~/models/Errors'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ObjectId } from 'mongodb'
import { recommendCalorieAndTimeToAchieveGoal } from '~/utils/recommend'
import { ActivityLevel, Gender, GoalDetailStatus } from '~/constants/enums'
import { GoalDetail } from '~/models/schemas/GoalDetail.schema'

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
}
const recommendService = new RecommendService()
export default recommendService
