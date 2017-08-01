import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Store} from '@ngrx/store';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/startWith';
// import 'rxjs/add/operator/switchMap';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/withLatestFrom';
import {ADD_TASK, DELETE_TASK, TOGGLE_DONE, UPDATE_TASK} from "./task.actions";

const LS_KEY = 'SUP';
const TASK_KEY = 'TASKS';


// helper fn
function syncToLs(state) {
  console.log('SYNC');
  const stateReducer = state[1];
  const tasks = stateReducer.TaskReducer;
  localStorage.setItem(LS_KEY + TASK_KEY, JSON.stringify(tasks));
}

@Injectable()
export class TaskEffects {
  constructor(private actions$: Actions,
              private store$: Store<any>) {
  }

  @Effect({dispatch: false}) addTask$: any = this.actions$
    .ofType(ADD_TASK)
    .withLatestFrom(this.store$)
    .do(syncToLs);

  @Effect({dispatch: false}) updateTask$: any = this.actions$
    .ofType(UPDATE_TASK)
    .withLatestFrom(this.store$)
    .do(syncToLs);

  @Effect({dispatch: false}) deleteTask$: any = this.actions$
    .ofType(DELETE_TASK)
    .withLatestFrom(this.store$)
    .do(syncToLs);

  @Effect({dispatch: false}) toggleDone$: any = this.actions$
    .ofType(TOGGLE_DONE)
    .withLatestFrom(this.store$)
    .do(syncToLs);
}