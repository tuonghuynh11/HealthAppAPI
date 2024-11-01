import { Request } from 'express'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { verifyToken } from './jwt'
import { envConfig } from '~/constants/config'

export const numberEnumToArray = (numberEnum: { [key: string]: string | number }) => {
  return Object.values(numberEnum).filter((value) => typeof value === 'number') as number[]
}

export const verifyAccessToken = async (access_token: string, req?: Request) => {
  if (!access_token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  try {
    const decoded_authorization = await verifyToken({
      token: access_token,
      secretOrPublicKey: envConfig.jwtSecretAccessToken
    })
    if (req) {
      ;(req as Request).decoded_authorization = decoded_authorization
      return true
    }
    return decoded_authorization
  } catch (error) {
    throw new ErrorWithStatus({
      message: 'Access Token Error:' + capitalize((error as JsonWebTokenError).message),
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  return true
}

export const numberOfDaysBetweenTwoDates = (date1: Date, date2: Date) => {
  // Calculate the time difference in milliseconds
  const timeDiff = Math.abs(date2.getTime() - date1.getTime())

  // Convert the time difference to days
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24))

  return Number(diffDays)
}

export const secondsToTime = (seconds: number) => {
  const hours: string = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, '0')
  const minutes: string = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, '0')
  const secs: string = (seconds % 60).toString().padStart(2, '0')

  return `${hours}:${minutes}:${secs}`
}

export const generateOTP = (length: number): string => {
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10) // Generates a digit from 0 to 9
  }
  return otp
}

export const generatePassword = (length: number): string => {
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const numberChars = '0123456789'
  const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?'

  const allChars = upperCaseChars + lowerCaseChars + numberChars + symbolChars
  let password = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length)
    password += allChars[randomIndex]
  }

  return password
}
