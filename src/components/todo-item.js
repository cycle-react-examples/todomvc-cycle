'use strict';
import Cycle, {Rx} from 'cycle-react';
import React from 'react';
import cx from 'classnames';
import {ENTER_KEY, ESC_KEY} from '../utils';

let options = {bindThis: true};
let TodoItem = Cycle.createReactClass('TodoItem', function (interactions, props, self) {
  let intent = {
    destroy$: interactions.get('.destroy', 'click'),
    toggle$: interactions.get('.toggle', 'change'),
    startEdit$: interactions.get('label', 'dblclick'),
    changeEdit$: interactions.get('.edit', 'input')
      .map(ev => ev.target.value),
    stopEdit$: interactions.get('.edit', 'keyup')
      .filter(ev => ev.keyCode === ESC_KEY || ev.keyCode === ENTER_KEY)
      .merge(interactions.get('.edit', 'blur'))
      .map(ev => ev.currentTarget.value)
      .share()
  };

  let startEditSubscription = intent.startEdit$.subscribe(() => {
    let editField = React.findDOMNode(self.refs.editField);
    editField.focus();
    editField.setSelectionRange(0, editField.value.length);
  });

  let propId$ = props.get('todoid').startWith(0).shareReplay(1);
  let content$ = props.get('content').merge(intent.changeEdit$);
  let completed$ = props.get('completed');
  let editing$ = Rx.Observable.merge(
    intent.startEdit$.map(() => true),
    intent.stopEdit$.map(() => false)
  ).startWith(false);

  let vtree$ = Rx.Observable.combineLatest(
    content$,
    completed$,
    editing$,
    function (content, completed, editing) {
      let className = cx(
        'todoRoot',
        'TodoItem',
        {completed: completed},
        {editing: editing}
      );
      return () => <li className={className}>
        <div className="view">
          <input className="toggle" type="checkbox" checked={completed} />
          <label>{content}</label>
          <button className="destroy" />
        </div>
        <input ref="editField" className="edit" type="text" value={content} />
      </li>;
    }
  );

  return {
    vtree$,
    destroy$: intent.destroy$.withLatestFrom(propId$, (ev, id) => id),
    toggle$: intent.toggle$.withLatestFrom(propId$, (ev, id) => id),
    newContent$: intent.stopEdit$
      .withLatestFrom(propId$, (content, id) => ({content, id})),
    dispose: startEditSubscription
  };
}, options);

export default TodoItem;
