interface User {
  name: string,
  position: number[],
  distances?: { [key:string]:number },
  message: string
}

interface AppState {
  users: User[]
}

export {
  User,
  AppState
};
