import { checkSchema } from 'express-validator'
import { MealQueryType, MealQueryTypeFilter } from '~/constants/enums'
import { MEALS_MESSAGES } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const mealsSearchValidator = validate(
  checkSchema(
    {
      search: {
        optional: true,
        isString: true
      }, // meal name

      type: {
        optional: false,
        notEmpty: true,
        isString: true,
        isIn: {
          options: [MealQueryTypeFilter],
          errorMessage: MEALS_MESSAGES.INVALID_MEAL_TYPE_FILTER
        }
      },
      meal_type: {
        optional: false,
        notEmpty: true,
        isString: true,
        isIn: {
          options: [MealQueryType],
          errorMessage: MEALS_MESSAGES.INVALID_MEAL_TYPE
        }
      }
    },
    ['query']
  )
)
