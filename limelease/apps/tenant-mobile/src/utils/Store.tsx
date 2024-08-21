import {create} from 'zustand';
import {
  createJSONStorage,
  devtools,
  persist,
  StateStorage,
} from 'zustand/middleware';
import {Maybe, User, UserBaseFragment} from '../graphql/generated';

import {MMKV} from 'react-native-mmkv';

const storage = new MMKV();

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

interface GlobalState {
  user: Maybe<User>;
  token: Maybe<string>;
  setUserData: (user: Maybe<UserBaseFragment>) => void;
  setToken: (token: string) => void;
}

export const useGlobalStore = create<GlobalState>()(
  devtools(
    persist(
      set => ({
        user: null,
        token: null,
        setUserData: (user: Maybe<UserBaseFragment>) => set({user}),
        setToken: (token: string) => set({token}),
      }),
      {
        name: 'occupie-storage',
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);
