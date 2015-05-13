'use strict';
import Cycle from 'cycle-react';
import {ENTER_KEY, ESC_KEY} from '../utils';

export default function intent(interactions) {
  return {
    changeRoute$: Cycle.Rx.Observable.fromEvent(window, 'hashchange')
      .map(ev => ev.newURL.match(/\#[^\#]*$/)[0].replace('#', ''))
      .startWith(window.location.hash.replace('#', '')),

    changeInput$: interactions.get('#new-todo', 'input')
      .map(ev => ev.target.value),

    clearInput$: interactions.get('#new-todo', 'keyup')
      .filter(ev => ev.keyCode === ESC_KEY),

    insertTodo$: interactions.get('#new-todo', 'keyup')
      .filter(ev => {
        let trimmedVal = String(ev.target.value).trim();
        return ev.keyCode === ENTER_KEY && trimmedVal;
      })
      .map(ev => String(ev.target.value).trim()),

    editTodo$: interactions.get('.TodoItem', 'newContent').map(ev => ev.data),

    toggleTodo$: interactions.get('.TodoItem', 'toggle').map(ev => ev.data),

    toggleAll$: interactions.get('#toggle-all', 'click'),

    deleteTodo$: interactions.get('.TodoItem', 'destroy').map(ev => ev.data),

    deleteCompleteds$: interactions.get('#clear-completed', 'click')
  };
}
