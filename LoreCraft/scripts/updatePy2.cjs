const fs = require('fs');

const pyFile = 'src/data/python.ts';
let pyContent = fs.readFileSync(pyFile, 'utf-8');

pyContent = pyContent.replace(
  `          <p class="prose"><strong>Theory:</strong> Python simplifies the classic "for" loop. Instead of manually maintaining a counter variable, you use the <code>for item in sequence:</code> syntax, which intuitively steps through a collection (or a range of numbers) one by one.</p>`,
  `          <p class="prose"><strong>Theory:</strong> Python simplifies the classic "for" loop. Instead of manually maintaining a counter variable, you use the <code>for item in sequence:</code> syntax, which intuitively steps through a collection (or a range of numbers) one by one.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🎡</div>
             <div>
               <div class="analogy-title">The Ferris Wheel Analogy</div>
               <div class="analogy-text">A while loop is like waiting in line until a condition is met. A Python for-in loop is like boarding a Ferris Wheel with your friends. You don't count how many friends you have; you just say "for every friend in my group, let them ride."</div>
             </div>
          </div>`
);

pyContent = pyContent.replace(
  `          <p class="prose"><strong>Theory:</strong> Python has powerful built-in data structures. <strong>Lists</strong> are ordered collections, <strong>Tuples</strong> are ordered but unchangeable (immutable), and <strong>Dictionaries</strong> (Dicts) store data in key-value pairs.</p>`,
  `          <p class="prose"><strong>Theory:</strong> Python has powerful built-in data structures. <strong>Lists</strong> are ordered collections, <strong>Tuples</strong> are ordered but unchangeable (immutable), and <strong>Dictionaries</strong> (Dicts) store data in key-value pairs.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📖</div>
             <div>
               <div class="analogy-title">The Book Analogy</div>
               <div class="analogy-text">A <b>List</b> is like a notebook where you append pages in order. A <b>Tuple</b> is a printed book—once printed, you can't change the words. A <b>Dictionary</b> is an index at the back—you don't read it page-by-page, you jump straight to the keyword!</div>
             </div>
          </div>`
);

pyContent = pyContent.replace(
  `          <p class="prose"><strong>Theory:</strong> The <code>def</code> keyword is used to define functions. Functions allow you to bundle code into reusable blocks. They can take parameters and return values using the <code>return</code> keyword.</p>`,
  `          <p class="prose"><strong>Theory:</strong> The <code>def</code> keyword is used to define functions. Functions allow you to bundle code into reusable blocks. They can take parameters and return values using the <code>return</code> keyword.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🏭</div>
             <div>
               <div class="analogy-title">The Factory Analogy</div>
               <div class="analogy-text">A function is like a micro-factory. You define (def) what the factory does. When you give it raw materials (parameters), it processes them and ships out a finished product (return value).</div>
             </div>
          </div>`
);

pyContent = pyContent.replace(
  `          <p class="prose"><strong>Theory:</strong> Python uses <code>class</code> for templates. The constructor is always a special method named <code>__init__</code>. Unlike Java, Python requires you to explicitly pass <code>self</code> as the first parameter to all instance methods!</p>`,
  `          <p class="prose"><strong>Theory:</strong> Python uses <code>class</code> for templates. The constructor is always a special method named <code>__init__</code>. Unlike Java, Python requires you to explicitly pass <code>self</code> as the first parameter to all instance methods!</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🪞</div>
             <div>
               <div class="analogy-title">The Self Mirror Analogy</div>
               <div class="analogy-text">Why does Python need <b>self</b>? Imagine 10 identical dog robots. When you yell "Bark!", how does a specific dog know to trigger its own voice box and not its neighbor's? "self" is a mirror each dog holds up to recognize "Oh, you mean ME!"</div>
             </div>
          </div>`
);

fs.writeFileSync(pyFile, pyContent);
console.log('Python analogies updated');
