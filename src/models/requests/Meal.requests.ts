import { MealQueryType, MealQueryTypeFilter, MealType } from '~/constants/enums'
import Dishes from '../schemas/Dishes.schema'
import { PaginationReqQuery } from './Pagination.requests'
import { Filter } from './Index.request'

export interface MealReqBody {
  name: string
  date: string
  description: string
  calories: number
  pre_time: number
  meal_type: MealType
  dishes: Dishes[]
}
export interface MealReqQuery extends PaginationReqQuery, Filter {
  type: MealQueryTypeFilter
  meal_type: MealQueryType
}
