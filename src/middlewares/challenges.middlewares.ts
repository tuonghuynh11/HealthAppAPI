import { checkSchema } from 'express-validator'
import { ObjectId } from 'mongodb'
import { ChallengeTarget, ChallengeType, ExerciseCategories, ExerciseQueryTypeFilter } from '~/constants/enums'
import HTTP_STATUS from '~/constants/httpStatus'
import { CHALLENGE_MESSAGES, EXERCISE_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import { validate } from '~/utils/validation'

export const exercisesSearchValidator = validate(
  checkSchema(
    {
      search: {
        optional: true,
        isString: true
      }, // exercise name

      type: {
        optional: false,
        notEmpty: true,
        isString: true,
        isIn: {
          options: [ExerciseQueryTypeFilter],
          errorMessage: EXERCISE_MESSAGES.INVALID_EXERCISE_TYPE
        }
      }
    },
    ['query']
  )
)

export const addChallengeValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: false,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isExist = await databaseService.challenges.findOne({
              name: value
            })
            if (isExist) {
              throw new ErrorWithStatus({
                message: CHALLENGE_MESSAGES.CHALLENGE_EXISTS,
                status: HTTP_STATUS.FORBIDDEN
              })
            }
            return true
          }
        }
      },
      description: {
        notEmpty: false,
        trim: true
      },
      type: {
        notEmpty: true,
        isString: true,
        isIn: {
          options: [ChallengeType],
          errorMessage: CHALLENGE_MESSAGES.INVALID_CHALLENGE_TYPE
        }
      },
      prize_image: {
        notEmpty: true,
        isString: true
      },
      prize_title: {
        notEmpty: true,
        isString: true
      },
      target: {
        notEmpty: true,
        isString: true,
        isIn: {
          options: [ChallengeTarget],
          errorMessage: CHALLENGE_MESSAGES.INVALID_CHALLENGE_TARGET
        }
      },
      target_image: {
        notEmpty: false,
        isString: true
      },
      fat_percent: {
        notEmpty: false,
        isNumeric: true
      },
      weight_loss_target: {
        notEmpty: false,
        isNumeric: true
      },
      image: {
        notEmpty: true,
        isString: true
      },
      start_date: {
        optional: true,
        isISO8601: {
          options: {
            strict: true, //Chặn định dạng YYYY-MM-Đ
            strictSeparator: true // KHông có chữ T trong chuỗi date string
          },
          errorMessage: CHALLENGE_MESSAGES.START_DATE_MUST_BE_ISO8601
        }
      },
      end_date: {
        optional: true,
        isISO8601: {
          options: {
            strict: true, //Chặn định dạng YYYY-MM-Đ
            strictSeparator: true // KHông có chữ T trong chuỗi date string
          },
          errorMessage: CHALLENGE_MESSAGES.END_DATE_MUST_BE_ISO8601
        }
      }
    },
    ['body']
  )
)
export const updateExerciseValidator = validate(
  checkSchema(
    {
      name: {
        optional: true,
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isExist = await databaseService.exercises.findOne({
              name: value,
              _id: { $ne: new ObjectId(req.params?.id) }
            })
            if (isExist) {
              throw new ErrorWithStatus({
                message: EXERCISE_MESSAGES.EXERCISE_EXISTS,
                status: HTTP_STATUS.FORBIDDEN
              })
            }
            return true
          }
        }
      },
      description: {
        optional: true,
        trim: true
      },
      category: {
        optional: true,
        isString: true,
        isIn: {
          options: [ExerciseCategories],
          errorMessage: EXERCISE_MESSAGES.INVALID_EXERCISE_TYPE
        }
      },
      calories_burn_per_minutes: {
        optional: true,
        isNumeric: true
      },
      image: {
        optional: true,
        isString: true
      },
      video: {
        optional: true,
        isString: true
      }
    },
    ['body']
  )
)
