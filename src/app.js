'use strict';
import Cycle from 'cycle-react';
import source from './sources/todos';
import intent from './intents/todos';
import model from './models/todos';
import view from './views/todos';
import localStorageSink from './sinks/local-storage.js';

function app(interactions) {
  let todos$ = model(intent(interactions), source);
  todos$.subscribe(localStorageSink);
  return view(todos$);
}

Cycle.applyToDOM('#todoapp', app);
