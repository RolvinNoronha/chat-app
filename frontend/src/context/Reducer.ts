export type UserInfoType = {
  username: string;
  id: string;
};

export type UserInfoStateType = {
  isAuthenticated: boolean;
  userInfo: UserInfoType | null;
};

export type UserInfoActionType = {
  type: string;
  payload: UserInfoType;
};

export type WsConnStateType = {
  conn: WebSocket | null;
};

export type WsConnActionType = {
  type: string;
  payload: WebSocket | null;
};

export const userInfoReducer = (
  state: UserInfoStateType,
  action: UserInfoActionType
) => {
  const user = action.payload;
  switch (action.type) {
    case "ADD_USER":
      return { ...state, userInfo: user, isAuthenticated: true };
    case "REMOVE_USER":
      return { ...state, userInfo: null, isAuthenticated: false };
    default:
      return state;
  }
};

export const wsConnReducer = (
  state: WsConnStateType,
  action: WsConnActionType
) => {
  const conn = action.payload;
  switch (action.type) {
    case "CONNECTED":
      return { ...state, conn: conn };
    case "DISCONNECTED":
      return { ...state, conn: null };
    default:
      return state;
  }
};
