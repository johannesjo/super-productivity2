// import { Action } from '@ngrx/store';
import {
  ADD_SUB_TASK,
  ADD_TASK,
  DELETE_TASK,
  RELOAD_FROM_LS,
  REORDER_TASKS,
  SET_CURRENT_TASK,
  TOGGLE_DONE,
  UNSET_CURRENT_TASK,
  UPDATE_TASK
} from './task.actions';
import {LS_TASKS} from '../app.constants'
import shortid from 'shortid'

const INITIAL_TASK_STATE = [];

// export function TaskReducer(state = INITIAL_TASK_STATE, action: Action) {
export function TaskReducer(state = INITIAL_TASK_STATE, action: any) {
  switch (action.type) {
    case RELOAD_FROM_LS:
      const LS_INITIAL = JSON.parse(localStorage.getItem(LS_TASKS));
      if (!LS_INITIAL || !Array.isArray(LS_INITIAL)) {
        localStorage.setItem(LS_TASKS, JSON.stringify([]));
      }
      const lsTasks = JSON.parse(localStorage.getItem(LS_TASKS));
      return [...lsTasks];

    case ADD_TASK:
      const newTask = Object.assign(action.payload, {id: shortid()});
      return [newTask, ...state];

    case DELETE_TASK:
      return state
        .filter((item) => item.id !== action.payload)
        .map((item) => {
          if (item.subTasks) {
            let taskCopy;
            item.subTasks.forEach((subItem, index) => {
              if (subItem.id === action.payload) {
                taskCopy = Object.assign({}, item);
                taskCopy.subTasks.splice(index, 1);
              }
            });
            return taskCopy || item;
          } else {
            return item;
          }
        });

    case UPDATE_TASK:
      return state.map((item) => {
        if (item.id === action.payload.id) {
          return Object.assign({}, item, action.payload.changedFields);
        } else if (item.subTasks) {
          let taskCopy;

          item.subTasks.forEach((subItem, index) => {
            if (subItem.id === action.payload.id) {
              taskCopy = Object.assign({}, item);
              taskCopy.subTasks[index] = Object.assign({}, subItem, action.payload.changedFields);
            }
          });
          return taskCopy || item;
        } else {
          return item;
        }

      });

    case TOGGLE_DONE:
      return state.map((item) => {
        return item.id === action.payload.id
          ? Object.assign({}, item, {done: !action.payload.isDone})
          : item;
      });

    case SET_CURRENT_TASK:
      return state.map((item) => {
        if (item.id === action.payload) {
          return Object.assign({}, item, {isCurrent: true});
        } else if (item.subTasks) {
          let taskCopy;
          item.subTasks.forEach((subItem, index) => {
            // console.log( action.payload,subItem);
            if (subItem.id === action.payload) {
              taskCopy = Object.assign({}, item);
              taskCopy.subTasks[index] = Object.assign({}, subItem, {isCurrent: true});
            } else if (subItem.isCurrent) {
              delete subItem.isCurrent;
            }
          });

          return taskCopy || item;
        } else {
          const taskCopy = Object.assign({}, item);
          if (taskCopy.hasOwnProperty('isCurrent')) {
            delete taskCopy.isCurrent;
            return taskCopy;
          } else {
            return item;
          }
        }
      });

    case UNSET_CURRENT_TASK:
      return state.map((item) => {
        const taskCopy = Object.assign({}, item);
        if (taskCopy.hasOwnProperty('isCurrent')) {
          delete taskCopy.isCurrent;
          return taskCopy;
        } else {
          return item;
        }
      });

    case ADD_SUB_TASK:
      return state.map((item) => {
        if (item.id === action.payload.id) {
          const updatedTask = Object.assign({}, item);
          if (!updatedTask.subTasks) {
            updatedTask.subTasks = [];
          }
          updatedTask.subTasks.push({
            id: shortid(),
            parentId: item.id,
            title: '',
            isDone: false
          });

          return updatedTask;
        } else {
          return item;
        }
      });

    case REORDER_TASKS:
      return state;
    // return action.payload;

    // case GET_CURRENT_TASK:

    default:
      return state;
  }
}