import { ObjectId } from 'mongodb'
import Ingredients from './Ingredients.schema'

interface DishesIngredientsType {
  _id?: ObjectId
  ingredient: Ingredients
  quantity: number
  unit: string
  created_at?: Date
  updated_at?: Date
}

export default class DishesIngredients {
  _id?: ObjectId
  ingredient: Ingredients
  quantity: number
  unit: string
  created_at?: Date
  updated_at?: Date

  constructor(dishesIngredientsType: DishesIngredientsType) {
    const date = new Date()
    this._id = dishesIngredientsType._id
    this.ingredient = dishesIngredientsType.ingredient
    this.quantity = dishesIngredientsType.quantity
    this.unit = dishesIngredientsType.unit
    this.created_at = dishesIngredientsType.created_at || date
    this.updated_at = dishesIngredientsType.updated_at || date
  }
}
