enum Answers {
  TRUE: 'True';
  FALSE: 'False';
}

type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: Answers;
  incorrect_answers: Array<Answers>;
};

export {
  Answers,
  Question,
};
