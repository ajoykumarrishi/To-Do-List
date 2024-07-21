# To-Do App

A simple, responsive to-do list application built with HTML, CSS, JavaScript, Bootstrap, and jQuery. This app allows users to add, delete, and toggle the completion status of tasks.

## Features

- Add new tasks.
- Delete existing tasks.
- Mark tasks as completed.
- Filter tasks by all, active, or completed.

## Table of Contents

- [Demo](#demo)
- [Usage](#usage)
- [API](#api)
- [Technologies](#technologies)
- [License](#license)

## Demo

You can see a live demo of the application [here](https://669d8c2d59d0155e2760b2b3--celebrated-centaur-cf98da.netlify.app/).

## Usage

1. Open `index.html` in your web browser.

## API

The app uses an external API to manage tasks.

### API Methods

- `POST /tasks` - Add a new task.
- `DELETE /tasks/:id` - Delete a task.
- `PUT /tasks/:id/mark_complete` - Mark a task as complete.
- `PUT /tasks/:id/mark_active` - Mark a task as active.
- `GET /tasks` - Retrieve all tasks.

## Technologies

- HTML
- CSS
- JavaScript
- Bootstrap
- jQuery

## License

This project is licensed under the MIT License.
