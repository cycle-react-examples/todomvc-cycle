'use strict';
/* eslint-disable no-unused-vars */
import React from 'react';
import TodoItem from '../components/todo-item';
/* eslint-enable no-unused-vars */

function vrenderHeader(todosData) {
  return <header id="header">
    <h1>todos</h1>
    <input id="new-todo"
           type="text"
           value={todosData.input}
           placeholder="What needs to be done"
           autofocus="true"
           name="newTodo"/>
  </header>;
}

function vrenderMainSection(todosData) {
  let allCompleted = todosData.list.reduce((x, y) => x && y.completed, true);
  let style = {'display': todosData.list.length ? null : 'none'};
  return <section id="main" style={style}>
    <input id="toggle-all" type="checkbox" checked={allCompleted} />
    <ul id="todo-list">
      {todosData.list
        .filter(todosData.filterFn)
        .map(todoData =>
          <TodoItem key={todoData.id}
                    todoid={todoData.id}
                    content={todoData.title}
                    completed={todoData.completed}/>
        )}
    </ul>
  </section>;
}

function vrenderFooter(todosData) {
  let amountCompleted = todosData.list
    .filter(todoData => todoData.completed)
    .length;
  let amountActive = todosData.list.length - amountCompleted;
  let style = {'display': todosData.list.length ? null : 'none'};

  return <footer id="footer" style={style}>
    <span id="todo-count"><strong>{amountActive}</strong>
      <span> item{amountActive !== 1 ? 's' : ''} left</span>
    </span>
    <ul id="filters">
      <li>
        <a className={todosData.filter === '' ? '.selected' : ''}
           href="#/">
          All
        </a>
      </li>
      <li>
        <a className={todosData.filter === 'active' ? '.selected' : ''}
           href="#/active">
          Active
        </a>
      </li>
      <li>
        <a className={todosData.filter === 'completed' ? '.selected' : ''}
           href="#/completed">
          Completed
        </a>
      </li>
    </ul>
    {amountCompleted > 0 ?
      <button id="clear-completed">
        Clear completed ({amountCompleted})
      </button> :
      null}
  </footer>;
}

export default function view(todos$) {
  return todos$.map(todos =>
    <div>
      {vrenderHeader(todos)}
      {vrenderMainSection(todos)}
      {vrenderFooter(todos)}
    </div>
  );
}
