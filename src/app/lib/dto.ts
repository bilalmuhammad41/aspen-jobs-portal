// import 'server-only'
// import { getUser } from '@/app/lib/dal'
// import { Role, User } from '@prisma/client'

// function canSeeUsername(viewer: User) {
//   return true
// }

// function canSeePhoneNumber(viewer: User, team: string) {
//   return viewer.role === Role.ADMIN
// }

// export async function getProfileDTO(slug: string) {
//   const data = await db.query.users.findMany({
//     where: eq(users.slug, slug),
//     // Return specific columns here
//   })
//   const user = data[0]

//   const currentUser = await getUser(user.id)

//   // Or return only what's specific to the query here
//   return {
//     username: canSeeUsername(currentUser) ? user.username : null,
//     phonenumber: canSeePhoneNumber(currentUser, user.team)
//       ? user.phonenumber
//       : null,
//   }
// }
