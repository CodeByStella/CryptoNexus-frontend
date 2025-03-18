import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';

// Add proper typing to NoopStorage
const createNoopStorage = () => {
  return {
    getItem: (_key: string): Promise<string | null> => Promise.resolve(null),
    setItem: (_key: string, value: string): Promise<string> => Promise.resolve(value),
    removeItem: (_key: string): Promise<void> => Promise.resolve(),
  };
};

const storage = typeof window !== 'undefined'
  ? createWebStorage('local')
  : createNoopStorage();

const authPersistConfig = {
  key: 'auth',
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;