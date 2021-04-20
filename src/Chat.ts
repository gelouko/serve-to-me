import { AppState, User } from "./Interfaces";

const appState: AppState = {
  users: [],
}

const getDistances = (currentUser: User): { [key:string]:number; } => {
  return appState.users.reduce((acc, user) => ({
    ...acc,
    [user.name]: Math.abs(currentUser.position[0] - user.position[0]) + Math.abs(currentUser.position[1] - user.position[1])
  }), {})
}

const addUser = (currentUser: User): User[] => {
  const { name, position, message } = currentUser;
  
  appState.users.push({ name, position, message, distances: getDistances(currentUser) });

  console.log('usersqty', appState.users.length);
  return appState.users;
}

const sendMessage = (currentUser: User): User[] => {
  appState.users.forEach((user: User) => {
    if (user.name === currentUser.name) {
      console.log('currentUserSendingMessage:', currentUser);

      user.message = currentUser.message;
    }
  });

  console.log('usersqtymsg', appState.users.length);

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
  addUser, sendMessage, removeUser
}
