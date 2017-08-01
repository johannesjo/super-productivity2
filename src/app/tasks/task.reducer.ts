// import { Action } from '@ngrx/store';
import {ADD_TASK, DELETE_TASK, RELOAD_FROM_LS, TOGGLE_DONE, UPDATE_TASK} from './task.actions';

// export function TaskReducer(state = [], action: Action) {
export function TaskReducer(state = [], action: any) {
  switch (action.type) {
    case RELOAD_FROM_LS:
      const LS_KEY = 'tasks';

      const LS_INITIAL = JSON.parse(localStorage.getItem(LS_KEY));
      if (!LS_INITIAL || !Array.isArray(LS_INITIAL)) {
        localStorage.setItem(LS_KEY, JSON.stringify([]));
      }
      const lsTasks = JSON.parse(localStorage.getItem(LS_KEY));
      console.log('RELOAD', localStorage.tasks, lsTasks, state);
      return [...lsTasks];

    case ADD_TASK:
      console.log(state);
      return [action.payload, ...state];
    case DELETE_TASK:
      return state.filter((item, index) => index !== action.payload);
    case UPDATE_TASK:
      return state.map((item, index) => {
        return index === action.payload.index
          ? Object.assign({}, item, {title: action.payload.newValue})
          : item;
      });
    case TOGGLE_DONE:
      return state.map((item, index) => {
        return index === action.payload.index
          ? Object.assign({}, item, {done: !action.payload.done})
          : item;
      });
    default:
      return state;
  }
}