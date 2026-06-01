const fs = require('fs');

const pyFile = 'src/data/python.ts';
let pyContent = fs.readFileSync(pyFile, 'utf-8');

// Chapter 2
pyContent = pyContent.replace(
  `        question: 'How does Python determine what code is inside an if block?',
        answers: [
          { text: 'Curly braces {}', correct: false, dmg: 0 },
          { text: 'Indentation (spaces or tabs)', correct: true, dmg: 100 },
          { text: 'The end keyword', correct: false, dmg: 0 },
          { text: 'Parentheses ()', correct: false, dmg: 0 }
        ]
      }
    ],`,
  `        question: 'How does Python determine what code is inside an if block?',
        answers: [
          { text: 'Curly braces {}', correct: false, dmg: 0 },
          { text: 'Indentation (spaces or tabs)', correct: true, dmg: 100 },
          { text: 'The end keyword', correct: false, dmg: 0 },
          { text: 'Parentheses ()', correct: false, dmg: 0 }
        ]
      },
      {
        question: 'What is the correct syntax for checking if a equals b?',
        answers: [
          { text: 'if a = b:', correct: false, dmg: 0 },
          { text: 'if (a equals b)', correct: false, dmg: 0 },
          { text: 'if a == b:', correct: true, dmg: 100 },
          { text: 'if a is equal to b', correct: false, dmg: 0 }
        ]
      }
    ],`
);

// Chapter 3
pyContent = pyContent.replace(
  `        question: 'How do you loop from 0 to 4 in Python?',
        answers: [
          { text: 'for i = 0 to 4:', correct: false, dmg: 0 },
          { text: 'for (int i=0; i<5; i++)', correct: false, dmg: 0 },
          { text: 'for i in range(5):', correct: true, dmg: 100 },
          { text: 'loop 5 times:', correct: false, dmg: 0 }
        ]
      }
    ],`,
  `        question: 'How do you loop from 0 to 4 in Python?',
        answers: [
          { text: 'for i = 0 to 4:', correct: false, dmg: 0 },
          { text: 'for (int i=0; i<5; i++)', correct: false, dmg: 0 },
          { text: 'for i in range(5):', correct: true, dmg: 100 },
          { text: 'loop 5 times:', correct: false, dmg: 0 }
        ]
      },
      {
        question: 'What does the break statement do inside a loop?',
        answers: [
          { text: 'Pauses the loop temporarily.', correct: false, dmg: 0 },
          { text: 'Skips the current iteration and moves to the next.', correct: false, dmg: 0 },
          { text: 'Exits the entire loop immediately.', correct: true, dmg: 100 },
          { text: 'Ends the Python script.', correct: false, dmg: 0 }
        ]
      }
    ],`
);

pyContent = pyContent.replace(/monsterHp:\s*900/g, 'monsterHp: 1500');

fs.writeFileSync(pyFile, pyContent);
console.log('Python updated');
