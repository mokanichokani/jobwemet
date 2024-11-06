// import { Roles } from '@/types/globals'
///@ts-nocheck
import { auth } from '@clerk/nextjs/server'

export const checkRole = (role: Roles) => {
  const { sessionClaims } = auth()

  return sessionClaims?.metadata.role ===role;
}