import { NodeData } from "../types";

export const pythonNodes: NodeData[] = [
  {
    id: 100,
    name: 'Variables Valley',
    territory: 'The Python Highlands',
    emoji: '🐍',
    status: 'cleared',
    xp: 180,
    gold: 60,
    desc: 'Master dynamic typing and basic structures.',
    monster: 'The Indentation Wraith',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter I \u00B7 Variables Valley',
        title: 'Dynamic Typing',
        subtitle: 'Variables without labels.',
        content: `
          <p class="prose"><strong>Theory:</strong> Unlike Java, Python is dynamically typed. This means you do not have to declare a variable's type when you create one. Python figures it out for you when the code runs.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📦</div>
             <div>
               <div class="analogy-title">The Magic Box Analogy</div>
               <div class="analogy-text">In Python, a variable is just a name tag you slap onto a box. If you put a number in the box, Python knows it's a number. If you take the number out and put a string in, Python is totally fine with that!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-comment"># No int or String keywords!</span><br>
            my_age = <span class="code-num">25</span><br>
            my_age = <span class="code-str">"Twenty Five"</span> <span class="code-comment"># Totally legal in Python!</span>
          </div>
        `
      }
    ],
    x: 15,
    y: 20,
  },
  {
    id: 101,
    name: 'Conditionals Cave',
    territory: 'The Python Highlands',
    emoji: '⚖️',
    status: 'locked',
    xp: 220,
    gold: 70,
    desc: 'Master if, elif, and else statements.',
    monster: 'The Elif Enigma',
    monsterHp: 100,
    lessons: [
      {
        eyebrow: 'Chapter II \u00B7 Conditionals Cave',
        title: 'Indentation is Law',
        subtitle: 'No curly braces here.',
        content: `
          <p class="prose"><strong>Theory:</strong> Control flow determines which blocks of code run. Instead of using curly braces <code>{}</code> to group blocks of code, Python heavily relies on <strong>indentation</strong>. The amount of whitespace at the start of a line is actually part of the language's syntax.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📏</div>
             <div>
               <div class="analogy-title">The Staircase Analogy</div>
               <div class="analogy-text">Think of your code like a staircase. Everything that belongs inside an <code>if</code> statement must take one step to the right (indent). When you step back to the left, you've exited the statement.</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-kw">if</span> age >= <span class="code-num">18</span>:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;print(<span class="code-str">"You are an adult!"</span>) <span class="code-comment"># Indented!</span><br>
            <span class="code-kw">elif</span> age > <span class="code-num">12</span>:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;print(<span class="code-str">"You are a teen!"</span>)<br>
            <span class="code-kw">else</span>:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;print(<span class="code-str">"You are a kid!"</span>)
          </div>
        `
      }
    ],
    x: 45,
    y: 15,
  },
  {
    id: 102,
    name: 'Looping Loch',
    territory: 'The Python Highlands',
    emoji: '🔁',
    status: 'locked',
    xp: 250,
    gold: 80,
    desc: 'Iterate effortlessly with for-in and while loops.',
    monster: 'The Infinite Serpent',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter III \u00B7 Looping Loch',
        title: 'The For-In Loop',
        subtitle: 'Iterating made elegant.',
        content: `
          <p class="prose"><strong>Theory:</strong> Python simplifies the classic "for" loop. Instead of manually maintaining a counter variable, you use the <code>for item in sequence:</code> syntax, which intuitively steps through a collection (or a range of numbers) one by one.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🎡</div>
             <div>
               <div class="analogy-title">The Ferris Wheel Analogy</div>
               <div class="analogy-text">A while loop is like waiting in line until a condition is met. A Python for-in loop is like boarding a Ferris Wheel with your friends. You don't count how many friends you have; you just say "for every friend in my group, let them ride."</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-comment"># range(5) generates numbers 0, 1, 2, 3, 4</span><br>
            <span class="code-kw">for</span> i <span class="code-kw">in</span> range(<span class="code-num">5</span>):<br>
            &nbsp;&nbsp;&nbsp;&nbsp;print(i)
          </div>
        `
      }
    ],
    x: 75,
    y: 25,
  },
  {
    id: 103,
    name: 'List & Dict Dunes',
    territory: 'The Python Highlands',
    emoji: '📚',
    status: 'locked',
    xp: 300,
    gold: 100,
    desc: 'Navigate Python collections like Lists, Tuples, and Dictionaries.',
    monster: 'The KeyError Beast',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter IV \u00B7 List & Dict Dunes',
        title: 'Python Collections',
        subtitle: 'Lists, Tuples, Sets, and Dictionaries.',
        content: `
          <p class="prose"><strong>Theory:</strong> Python has powerful built-in data structures. <strong>Lists</strong> are ordered collections, <strong>Tuples</strong> are ordered but unchangeable (immutable), and <strong>Dictionaries</strong> (Dicts) store data in key-value pairs.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📖</div>
             <div>
               <div class="analogy-title">The Book Analogy</div>
               <div class="analogy-text">A <b>List</b> is like a notebook where you append pages in order. A <b>Tuple</b> is a printed book—once printed, you can't change the words. A <b>Dictionary</b> is an index at the back—you don't read it page-by-page, you jump straight to the keyword!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-comment"># A List (Uses square brackets)</span><br>
            fruits = [<span class="code-str">"apple"</span>, <span class="code-str">"banana"</span>]<br><br>
            <span class="code-comment"># A Dictionary (Uses curly braces, Key:Value)</span><br>
            person = {<span class="code-str">"name"</span>: <span class="code-str">"Arthur"</span>, <span class="code-str">"age"</span>: <span class="code-num">25</span>}<br>
            print(person[<span class="code-str">"name"</span>])
          </div>
        `
      }
    ],
    x: 85,
    y: 55,
  },
  {
    id: 104,
    name: 'Function Forest',
    territory: 'The Python Highlands',
    emoji: '🛠️',
    status: 'locked',
    xp: 350,
    gold: 150,
    desc: 'Organize logic with the def keyword.',
    monster: 'The Recursion Phantom',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter V \u00B7 Function Forest',
        title: 'Defining Functions',
        subtitle: 'Reusable logic.',
        content: `
          <p class="prose"><strong>Theory:</strong> Functions group code into reusable blocks. In Python, you define a function using the <code>def</code> keyword, followed by the function name, parentheses, and a colon.</p>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-kw">def</span> greet(name):<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">return</span> <span class="code-str">"Hello, "</span> + name
          </div>
        `
      }
    ],
    x: 70,
    y: 80,
  },
  {
    id: 105,
    name: 'Object Oasis',
    territory: 'The Python Highlands',
    emoji: '🏗️',
    status: 'locked',
    xp: 400,
    gold: 200,
    desc: 'Master Classes, Objects, and the magic of __init__.',
    monster: 'The Self Spectre',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter VI \u00B7 Object Oasis',
        title: 'Object-Oriented Python',
        subtitle: 'Classes and the importance of self.',
        content: `
          <p class="prose"><strong>Theory:</strong> Like Java, Python is an Object-Oriented language. You create a class and instantiate objects from it. But Python handles initialization a bit uniquely with "dunder" (double underscore) methods.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">👋</div>
             <div>
               <div class="analogy-title">The "Self" Analogy</div>
               <div class="analogy-text">When an object performs an action, it needs to know "who" is performing the action. In Java, this is implicit (using <code>this</code> if needed). In Python, you must explicitly pass a reference to the object itself as the first parameter of every class method. By strong convention, we call this parameter <code>self</code>.</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-kw">class</span> Dog:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">def</span> __init__(<span class="code-kw">self</span>, name):<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">self</span>.name = name<br><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">def</span> bark(<span class="code-kw">self</span>):<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">print</span>(<span class="code-kw">self</span>.name + <span class="code-str">" says Woof!"</span>)
          </div>
        `
      }
    ],
    x: 40,
    y: 85,
  },
  {
    id: 106,
    name: 'Exception Estuary',
    territory: 'The Python Highlands',
    emoji: '⚠️',
    status: 'locked',
    xp: 450,
    gold: 250,
    desc: 'Handle crashes gracefully with try, except, and finally blocks.',
    monster: 'The ZeroDivision Zombie',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter VII \u00B7 Exception Estuary',
        title: 'Try and Except',
        subtitle: 'It is easier to ask for forgiveness than permission.',
        content: `
          <p class="prose"><strong>Theory:</strong> When something goes wrong (e.g. dividing by zero or opening a missing file), Python raises an Exception. Instead of letting the program crash, you can "catch" it using <code>try-except</code> blocks. (Note: Java uses <code>catch</code>, Python uses <code>except</code>).</p>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-kw">try</span>:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;result = <span class="code-num">10</span> / <span class="code-num">0</span><br>
            <span class="code-kw">except</span> ZeroDivisionError:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">print</span>(<span class="code-str">"You cannot divide by zero!"</span>)
          </div>
        `
      }
    ],
    x: 15,
    y: 70,
  },
  {
    id: 107,
    name: 'Decorator Depths',
    territory: 'The Python Highlands',
    emoji: '✨',
    status: 'locked',
    xp: 600,
    gold: 400,
    desc: 'Wield meta-programming with Decorators and Generators.',
    monster: 'The Meta Mage',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter VIII \u00B7 Decorator Depths',
        title: 'Decorators',
        subtitle: 'Wrapping functions with functions.',
        content: `
          <p class="prose"><strong>Theory:</strong> Python allows you to pass functions as arguments to other functions. A <strong>Decorator</strong> is a design pattern that allows you to add new functionality to an existing object or function without modifying its structure.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🎁</div>
             <div>
               <div class="analogy-title">The Gift Wrapping Analogy</div>
               <div class="analogy-text">A decorator takes a standard box (your function), wraps it in beautiful wrapping paper with a bow (the decorator function), and gives it back. The box is exactly the same, but it looks a lot nicer and has extra features!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Python</div>
            <span class="code-kw">@timer_decorator</span><br>
            <span class="code-kw">def</span> calculate_huge_number():<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-kw">pass</span>
          </div>
        `
      }
    ],
    x: 25,
    y: 45,
  },
  {
    id: 108,
    name: 'The Endless Void',
    territory: 'The Unknown',
    emoji: '🌌',
    status: 'locked',
    xp: 2000,
    gold: 1000,
    desc: 'An AI dynamically asks you questions from everything you learned. Prove your ultimate mastery.',
    monster: 'The Omniscient Python',
    monsterHp: 1500,
    lessons: [],
    x: 50,
    y: 50,
    isMystery: true
  }
];
