// Тип для ролей пользователя
export type UserRole = 'admin' | 'user';

// Основной интерфейс пользователя
export interface IUser {
  id: number;
  email: string;
  login: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt?: Date; // Необязательное поле
}

// Интерфейс для данных в JSON-файле
export interface IUsersData {
  users: IUser[];
}

// Интерфейс для данных входа (без пароля)
export interface IPublicUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}