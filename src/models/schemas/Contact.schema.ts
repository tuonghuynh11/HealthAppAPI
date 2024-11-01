import { ObjectId } from 'mongodb'
import { ContactStatus } from '~/constants/enums'

interface ContactType {
  _id?: ObjectId
  from: ObjectId
  to: ObjectId
  title: string
  message: string
  image?: string
  status: ContactStatus
  created_at?: Date
  updated_at?: Date
}

export default class Contacts {
  _id?: ObjectId
  from: ObjectId
  to: ObjectId
  title: string
  message: string
  image?: string
  status: ContactStatus
  created_at?: Date
  updated_at?: Date

  constructor(contactType: ContactType) {
    const date = new Date()
    this._id = contactType._id
    this.from = contactType.from
    this.to = contactType.to
    this.title = contactType.title
    this.message = contactType.message
    this.image = contactType.image || undefined
    this.status = contactType.status || ContactStatus.Unread
    this.created_at = contactType.created_at || date
    this.updated_at = contactType.updated_at || date
  }
}
