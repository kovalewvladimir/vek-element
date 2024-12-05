import { isNull } from '../../utils'

type Role = 'RW' | 'RO'
type Roles = { [key: string]: Role }

interface IUserInfo {
  id: number
  username: string
  name: string
  surname: string
  patronymic: string
  avatar: string
  roles: Roles
}

interface IUserStore {
  loadUser: () => Promise<void>
  user: IUserInfo | null
}

class UserStore implements IUserStore {
  user: IUserInfo | null = null

  async loadUser() {
    const user = await this.getUser()
    this.user = user
  }

  constructor(private getUser: () => Promise<IUserInfo>) {}
}

let userStore: IUserStore | null = null

const initializeUserStore = (getUser: () => Promise<IUserInfo>) => {
  if (!isNull(userStore)) {
    throw new Error('UserStore is already initialized')
  }
  userStore = new UserStore(getUser)
}

const useUserStore = (): IUserStore => {
  if (isNull(userStore)) {
    throw new Error('UserStore is not initialized')
  }
  return userStore
}

export { initializeUserStore, useUserStore }
export type { IUserInfo, Roles }
