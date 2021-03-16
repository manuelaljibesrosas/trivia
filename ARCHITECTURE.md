# Architecture

### State
Each of the leaf subdirectories in the `src/state` directory are to be considered as isolated entities, each can be interpreted as a group of actions, selectors and state which together implement a feature. The shape of the actual state object mimics the structure of the `src/state` directory

inside each of these entities, there exists a `reducer.ts` file, which holds the reducer function associated with that particular feature, as well as the data types used by this state slice; there also exists an `actions.ts` file which exports the Redux actions that this module listens to, and a `selectors.ts` file which holds functions which answer common queries about the state of the feature; if necessary, an `epics.ts` file may be included to handle complex action sequences

#### `state/game`

The state of the game is represented by the following interface

```typescript
// /state/trivia/reducer.ts
interface State {
  queue: Array<Question>;
  current: Question | null;
  answers: Array<[Question, Answers]>;
}
```

This is our core business logic

#### `state/resources`

Here we put the code that fetches data from external sources, the state of each resource consists of a single `status` entry which reports the status of the request

#### `state/resources/questions`

API requests are carried out using an algorithm which will make sure that the list consists of questions less than 80 characters long, we use session tokens to make sure that the player doesn't get the same question twice during a session, we also omit the difficulty constraint as it doesn't accurately reflect the difficulty of the questions retrieved and it reduces the pool of questions available
