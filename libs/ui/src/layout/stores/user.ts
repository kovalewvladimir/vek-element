import { isNull } from '@vek-element/ui/utils'

type Role = 'RW' | 'RO'
type Roles = { [key: string]: Role }

/** Интерфейс для работы с авторизацией */
interface IAuth {
  /** Получение данных о пользователя */
  getUser: () => Promise<IUserInfo>

  /**
   * Выход из системы
   *
   * Нужно реализовать метод, который заставит метод getUser вернуть ошибку
   * */
  logout: () => void
}

interface IUserInfo {
  /** Пользовательский id */
  id: number

  /** Логин пользователя */
  username: string

  /** Имя пользователя */
  name: string

  /** Фамилия пользователя */
  surname: string

  /** Отчество пользователя */
  patronymic: string

  /** Ссылка на аватар пользователя */
  avatar?: string

  /** Роли пользователя */
  roles: Roles
}

class UserStore {
  private _defaultAvatar: string
  private _user: IUserInfo | null = null

  constructor(
    private _auth: IAuth,
    defaultAvatar: string
  ) {
    this._defaultAvatar = defaultAvatar
  }

  /** Ссылка на default аватар */
  get defaultAvatar() {
    return this._defaultAvatar
  }

  /** Информация о пользователе */
  get user() {
    return this._user
  }

  /** Метод для загрузки пользователя */
  loadUser = async (): Promise<void> => {
    this._user = await this._auth.getUser()
  }

  /** Метод для сброса пользователя */
  resetUser = (): void => {
    this._auth.logout()
    this._user = null
  }
}

let userStore: UserStore | null = null

const initializeUserStore = (auth: IAuth, defaultAvatar: string) => {
  if (!isNull(userStore)) {
    throw new Error('UserStore is already initialized')
  }
  userStore = new UserStore(auth, defaultAvatar)
}

const useUserStore = (): UserStore => {
  if (isNull(userStore)) {
    throw new Error('UserStore is not initialized')
  }
  return userStore
}

export { initializeUserStore, useUserStore }
export type { IAuth, IUserInfo, Role, Roles }
