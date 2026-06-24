export type User = {
  id: string;

  username: string;

  email: string;

  avatar?: string;

  isOnline: boolean;

  createdAt?: string;
};

export type UserResponse = {
  success: boolean;
  data: User;
};