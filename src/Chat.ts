import { AppState, User } from "./Interfaces";

const appState: AppState = {
  users: [],
}

const getDistance = (user: User, currentUser: User): number => 
  Math.abs(currentUser.position[0] - user.position[0]) + Math.abs(currentUser.position[1] - user.position[1])

const getDistances = (currentUser: User): { [key:string]:number; } => {
  return appState.users.reduce((acc, user) => ({
    ...acc,
    [user.name]: getDistance(user, currentUser)
  }), {})
}

const addUser = (currentUser: User): User[] => {
  const { name, position, message } = currentUser;
  
  appState.users.push({ name, position, message, distances: getDistances(currentUser) });

  return appState.users;
}

const updateUser = (currentUser: User): User[] => {
  appState.users.forEach((user: User) => {
    if (!user.distances) {
      user.distances = {}
    }
    user.distances[currentUser.name] = getDistance(user, currentUser);

    if (user.name === currentUser.name) {
      user.message = currentUser.message;
      user.position = currentUser.position;
    }
  });

  return appState.users;
}

const sendMessage = (currentUser: User): User[] => {
  appState.users.forEach((user: User) => {
    if (user.name === currentUser.name) {
      user.message = currentUser.message;
    }
  });

  return appState.users;
}

const removeUser = (currentUser: User) => {
  appState.users.forEach((user: User, i: number) => {
    if (user.name === currentUser.name) {
      appState.users.splice(i, 1);
    } else {
      if (user.distances) {
        delete user.distances[user.name]
      }
    }
  });

  return appState.users;
}

export {
  addUser, sendMessage, removeUser, updateUser
}
