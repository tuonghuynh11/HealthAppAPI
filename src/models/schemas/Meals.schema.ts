import { ObjectId } from 'mongodb'
import { GeneralStatus, MealType } from '~/constants/enums'
import Dishes from './Dishes.schema'

interface IMeals {
  _id?: ObjectId
  user_id?: ObjectId
  description: string
  calories: number
  pre_time: number // seconds
  meal_type: MealType
  date: Date
  status?: GeneralStatus
  created_at?: Date
  updated_at?: Date
  dishes: Dishes[]
}

export default class Meals {
  _id?: ObjectId
  user_id?: ObjectId
  description: string
  calories: number
  pre_time: number // seconds
  meal_type: MealType
  date: Date
  status?: GeneralStatus
  created_at?: Date
  updated_at?: Date
  dishes: Dishes[]

  constructor(meal: IMeals) {
    const date = new Date()
    this._id = meal._id
    this.user_id = meal.user_id
    this.description = meal.description
    this.calories = meal.calories
    this.pre_time = meal.pre_time
    this.meal_type = meal.meal_type
    this.date = meal.date
    this.status = meal.status || GeneralStatus.Undone
    this.created_at = meal.created_at || date
    this.updated_at = meal.updated_at || date
    this.dishes = meal.dishes || []
  }
}
