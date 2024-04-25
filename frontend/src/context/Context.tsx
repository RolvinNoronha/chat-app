import {
  UserInfoActionType,
  UserInfoStateType,
  WsConnActionType,
  WsConnStateType,
  userInfoReducer,
  wsConnReducer,
} from "./Reducer";
import { Dispatch, createContext, ReactNode, useReducer } from "react";

type AuthContextType = {
  userState: UserInfoStateType;
  userDispatch: Dispatch<UserInfoActionType>;
  connState: WsConnStateType | null;
  connDispatch: Dispatch<WsConnActionType>;
};

const InitialAuthState = {
  isAuthenticated: false,
  userInfo: null,
};

const Auth = createContext<AuthContextType>({
  userState: InitialAuthState,
  userDispatch: () => null,
  connState: null,
  connDispatch: () => null,
});

const AuthContext = ({ children }: { children: ReactNode }) => {
  const [userState, userDispatch] = useReducer(
    userInfoReducer,
    InitialAuthState
  );

  const [connState, connDispatch] = useReducer(wsConnReducer, { conn: null });

  return (
    <Auth.Provider value={{ userState, userDispatch, connState, connDispatch }}>
      {children}
    </Auth.Provider>
  );
};

export { Auth, AuthContext };
