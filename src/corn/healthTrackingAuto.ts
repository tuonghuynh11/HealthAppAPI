import { HealthTrackingType, UserRole, UserVerifyStatus } from '~/constants/enums'
import HealthTracking from '~/models/schemas/HealthTrackings.schema'
import databaseService from '~/services/database.services'
import { getNowDateWithoutTime } from '~/utils/commons'

export const healthTrackingAuto = async () => {
  const { date, goal, step }: any = {
    date: getNowDateWithoutTime(),
    value: 0,
    target: 0
  }

  const users = await databaseService.users
    .find({
      role: UserRole.User,
      verify: UserVerifyStatus.Verified
    })
    .toArray()

  const [healthTrackingBurnedInserted, healthTrackingConsumedInserted] = await Promise.all([
    databaseService.healthTrackings.insertMany(
      users.map((user: any) => {
        return new HealthTracking({
          user_id: user._id,
          date,
          type: HealthTrackingType.Calories_Burned,
          value: 0,
          target: 0
        })
      })
    ),
    databaseService.healthTrackings.insertMany(
      users.map((user: any) => {
        return new HealthTracking({
          user_id: user._id,
          date,
          type: HealthTrackingType.Calories_Consumed,
          value: 0,
          target: 0
        })
      })
    )
  ])
  await Promise.all(
    users.map((user: any, index: number) => {
      return databaseService.users.updateOne(
        {
          _id: user._id
        },
        {
          $push: {
            healthTrackings: {
              $each: [
                healthTrackingBurnedInserted.insertedIds[index],
                healthTrackingConsumedInserted.insertedIds[index]
              ]
            }
          }
        }
      )
    })
  )
  console.log('health tracking inserted')
}
