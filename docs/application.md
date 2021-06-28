# The Application

The application is very simple. Users can create teams where other users can join, and they can run discussions on different topics between each other.

## Data model

The development of this project is driven by mocking API server and the data with msw. It contains the following models:

- User - can have one of these roles:

  - `ADMIN` can:
    - create/edit/delete discussions
    - create/delete own comments
    - delete users
    - edit own profile
  - `USER` - can:
    - edit own profile
    - create discussions
    - create/delete own comments

- Team: represents a team that has 1 admin and many users that can create discussions between each other.

- Discussion: represents discussions created by team members.

- Comment: represents all the messages in a discussion.
