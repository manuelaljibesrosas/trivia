import { Question } from '../types/Question';

let questions: Array<Question> = [];

let token: string = '';

fetch('https://opentdb.com/api_token.php?command=request')
  .then((response) => response.json())
  .then((data) => {
    token = data.token;
    updateQuestions();
  });

const removeLongQuestions = (qs: Array<Question>): Array<Question> => (
  qs.filter(({ question }) => question.length <= 100)
);

const fetchQuestions = (amount) => fetch(
  `https://opentdb.com/api.php?amount=${amount}&type=boolean&token=${token}`,
).then((response) => {
  if (!response.ok)
    return Promise.resolve({ results: [] });
  return response.json();
}).then(({ results }) => removeLongQuestions(results));

async function updateQuestions() {
  while (questions.length < 10) {
    const result = await fetchQuestions(10 - questions.length);
    questions = questions.concat(result);
    console.log(questions);
  }
}

export { questions };
