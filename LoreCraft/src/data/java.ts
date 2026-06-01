import { NodeData } from "../types";

export const javaNodes: NodeData[] = [
  {
    id: 0,
    name: 'Variables Village',
    territory: 'The Kingdom of Java',
    emoji: '📜',
    status: 'cleared',
    xp: 180,
    gold: 60,
    desc: 'Master primitive types, variable declarations, and the art of naming things.',
    monster: 'The Declaration Wraith',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter I \u00B7 Variables Village',
        title: 'What is a Variable?',
        subtitle: 'The foundation of all programs — storing and naming data.',
        content: `
          <p class="prose"><strong>Theory:</strong> In software development, programs need a way to store and manipulate states, inputs, and calculations during execution. Without a temporary place to remember information, a program would forget everything it just computed.</p>
          <p class="prose"><strong>Definition:</strong> A <strong>variable</strong> is a declared, reserved memory location with an assigned name, used to store a specific piece of data like a number or text that can change or be read later.</p>
          <div class="analogy-box">
            <div class="analogy-emoji">🏺</div>
            <div>
              <div class="analogy-title">The Jar Analogy</div>
              <div class="analogy-text">Imagine a row of jars on a shelf. Each jar has a label (the variable name) and holds something inside (the value). You can look inside, replace the contents, or read what's written on the label.</div>
            </div>
          </div>
          
          <div class="callout info">
            <div class="callout-label">The Golden Rules of Naming</div>
            <div class="callout-body">
              <ul style="margin-left: 1.5rem; list-style-type: disc; margin-top: 0.5rem; margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <li><strong>camelCase:</strong> Start with a lowercase letter, and capitalize the first letter of each subsequent word (e.g., <code>myFavoriteColor</code>).</li>
                <li><strong>No Spaces:</strong> You cannot have spaces in variable names. Use camelCase instead.</li>
                <li><strong>Meaningful Names:</strong> Don't name a variable <code>x</code> if it stores the player's health. Name it <code>playerHealth</code>!</li>
              </ul>
            </div>
          </div>

          <p class="prose">In Java, every variable must have a <strong>type</strong> declared upfront (Static Typing). The type tells Java exactly what kind of data the jar can hold — you can't put watery juice in a jar specifically designed for solid cookies!</p>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-type">int</span> age = <span class="code-num">21</span>; <span class="code-comment">// A whole number</span><br>
            <span class="code-type">double</span> gpa = <span class="code-num">3.8</span>; <span class="code-comment">// A decimal number</span><br>
            <span class="code-type">String</span> name = <span class="code-str">"Arthur"</span>; <span class="code-comment">// Text (always in double quotes)</span><br>
            <span class="code-type">boolean</span> isStudent = <span class="code-kw">true</span>; <span class="code-comment">// true or false</span>
          </div>
        `
      },
      {
        eyebrow: 'Chapter I \u00B7 Variables Village',
        title: 'Primitive Types vs Objects',
        subtitle: 'The two great dynasties of data in Java.',
        content: `
          <p class="prose"><strong>Theory:</strong> When managing memory, programming languages can store simple, predictable data directly where they're needed to maximize speed. For complex, dynamically sized data (like strings or custom objects), the language creates the data in a dedicated memory pool and simply hands you a reference (a pointer map) to find it.</p>
          <p class="prose"><strong>Definition:</strong> In Java, <strong>primitive types</strong> hold simple real values directly in memory block, whereas <strong>object types (or reference types)</strong> hold the memory address pointing to where the complex object actually lives.</p>
          
          <div class="analogy-box">
            <div class="analogy-emoji">📬</div>
            <div>
              <div class="analogy-title">The Book vs Library Card Analogy</div>
              <div class="analogy-text">Imagine two ways of giving someone a book. A <strong>primitive</strong> is like handing them a physical pocket-sized short story — they have the actual information right in their hand. An <strong>object</strong> is like handing them a library card with a call number on it. The card (reference) is small, but it points to a massive book sitting miles away on a shelf.</div>
            </div>
          </div>
          
          <div class="concept-grid">
            <div class="concept-card">
              <div class="cc-icon">⚡</div>
              <div class="cc-title">Primitives</div>
              <div class="cc-body">The simple, fast workers. They are stored directly in memory by their actual value. Include: <code>int, double, boolean, char, long, float, byte, short</code>. (Notice they start with a completely lowercase letter!)</div>
            </div>
            <div class="concept-card">
              <div class="cc-icon">📦</div>
              <div class="cc-title">Objects (Reference Types)</div>
              <div class="cc-body">The complex VIPs. They are stored as a <em>reference</em> (a map or address) pointing to a location in memory where the real data lives. Include: <code>String, Arrays</code>, and any custom class. (Notice they start with a Capital letter!)</div>
            </div>
          </div>

          <div class="callout danger">
            <div class="callout-label">⚠ The String Comparison Trap</div>
            <div class="callout-body">Because Strings are objects, comparing them with the <code>==</code> operator compares their <strong>memory addresses</strong> (are they the exact same VIP box?), not their actual text content. Always use <code>.equals()</code> to compare the text inside!</div>
          </div>
          
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-comment">// ✗ DANGER — tests if they live at the same address!</span><br>
            <span class="code-kw">if</span> (name1 == name2) { ... }<br><br>
            <span class="code-comment">// ✓ SAFE — tests if they contain the identical letters</span><br>
            <span class="code-kw">if</span> (name1.equals(name2)) { ... }
          </div>
        `
      },
      {
        eyebrow: 'Chapter I \u00B7 Variables Village',
        title: 'Variable Scope',
        subtitle: 'Where does a variable live and die?',
        content: `
          <p class="prose"><strong>Theory:</strong> If every variable created could be accessed from anywhere in a program, the computer's memory would be cluttered, and naming conflicts would cause constant bugs (imagine two different "age" variables overwriting each other!). Languages restrict variables to specific "safe zones" to manage memory and prevent chaos.</p>
          <p class="prose"><strong>Definition:</strong> <strong>Scope</strong> is the region of the code where a variable is accessible and valid. In Java, scope is primarily defined by grouping curly braces <code>{}</code>.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🏰</div>
             <div>
               <div class="analogy-title">The Kingdom and The House Analogy</div>
               <div class="analogy-text">Imagine a kingdom (your class). The King is a global variable—everyone in the kingdom knows who he is. Now imagine a small house inside the kingdom (a method or loop). A secret hidden in the house (a local variable) is only known to the people inside the house. Once you step out of the door (the closing curly brace <code>}</code>), the secret is lost and forgotten!</div>
             </div>
          </div>
          <div class="callout danger">
            <div class="callout-label">⚠ Local Variable Lifespan</div>
            <div class="callout-body">When a block of code <code>{ ... }</code> finishes executing, all the local variables created specifically inside it are completely destroyed to free up memory. You cannot access them from outside!</div>
          </div>
        `
      }
    ],
    x: 15,
    y: 20
  },
  {
    id: 1,
    name: 'Looping Labyrinth',
    territory: 'The Kingdom of Java',
    emoji: '🔁',
    status: 'cleared',
    xp: 200,
    gold: 70,
    desc: 'Survive the infinite corridors — master for, while, and do-while loops.',
    monster: 'The Infinite Loop Daemon',
    monsterHp: 100,
    lessons: [
      {
        eyebrow: 'Chapter II \u00B7 Looping Labyrinth',
        title: 'Why Do We Loop?',
        subtitle: 'Repeating actions without repeating yourself.',
        content: `
          <p class="prose"><strong>Theory:</strong> Programs often perform incredibly repetitive tasks, such as processing hundreds of text files, summing millions of database entries, or updating thousands of pixels on a screen. Hard-coding exactly the same instructions over and over is impossible and highly inefficient.</p>
          <p class="prose"><strong>Definition:</strong> A <strong>loop</strong> is a control flow structure that allows a block of code to be executed repeatedly, either for a set number of times or continually until a certain condition is finally met.</p>
          <div class="analogy-box">
            <div class="analogy-emoji">🌀</div>
            <div>
              <div class="analogy-title">The Labyrinth Analogy</div>
              <div class="analogy-text">If you are lost in a maze, you don't instruct someone by saying "Take one step. Then take another step. Then take another..." You give them a dynamic rule: "<strong>WHILE</strong> you haven't found the exit, keep walking."</div>
            </div>
          </div>

          <p class="prose">In Java, there are three main types of loops, each suited for a different scenario:</p>
          
          <div class="concept-grid">
            <div class="concept-card" style="grid-column: span 2;">
              <div class="cc-icon">🎯</div>
              <div class="cc-title">The <code>for</code> Loop</div>
              <div class="cc-body">Use this when you know <strong>exactly how many times</strong> you want to repeat something. It's perfectly structured with a counter built right in. <br/><br/><em>Example: Print numbers 1 through 10.</em></div>
            </div>
            <div class="concept-card">
              <div class="cc-icon">🚦</div>
              <div class="cc-title">The <code>while</code> Loop</div>
              <div class="cc-body">Use this when you want to repeat <strong>until a specific condition changes</strong>, and you don't know how many times it takes. <br/><br/><em>Example: Keep reading a file until the end.</em></div>
            </div>
            <div class="concept-card">
              <div class="cc-icon">🤸</div>
              <div class="cc-title">The <code>do-while</code> Loop</div>
              <div class="cc-body">Just like the <code>while</code> loop, but it guarantees the code inside will <strong>execute at least once</strong> before checking the condition. <br/><br/><em>Example: Prompt a user for a password at least once.</em></div>
            </div>
          </div>

          <div class="callout danger">
            <div class="callout-label">⚠ The Infinite Loop Nightmare</div>
            <div class="callout-body">If your loop's exit condition is never met (e.g., you forget to increase your counter), it'll run forever, freezing your program and draining the computer's soul. Always double-check your exit strategy!</div>
          </div>
        `
      },
      {
         eyebrow: 'Chapter II \u00B7 Looping Labyrinth',
         title: 'The Great Escapes',
         subtitle: 'Controlling the flow inside your loops.',
         content: `
          <p class="prose"><strong>Theory:</strong> Sometimes, even if a loop is scheduled to run 100 times, you might find what you're looking for on the 5th try. Continuing the loop 95 more times wastes CPU cycles. Other times, you might want to skip over bad data without stopping the whole process.</p>
          <p class="prose"><strong>Definition:</strong> The <strong>break</strong> keyword abruptly ends the entire loop immediately. The <strong>continue</strong> keyword skips the rest of the current iteration and jumps instantly to the next iteration.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🏃</div>
             <div>
               <div class="analogy-title">The Assembly Line Analogy</div>
               <div class="analogy-text">Imagine you are inspecting a conveyor belt of apples.<br><br><strong>Continue:</strong> You see a rotten apple. You toss it in the bin and immediately look at the <em>next</em> apple. The belt keeps moving.<br><br><strong>Break:</strong> You see a bomb on the belt! You hit the emergency stop button. The whole belt completely shuts down.</div>
             </div>
          </div>
         `
      }
    ],
    x: 45,
    y: 15
  },
  {
    id: 2,
    name: 'The Array Citadel',
    territory: 'The Kingdom of Java',
    emoji: '🏰',
    status: 'active',
    xp: 240,
    gold: 80,
    desc: 'Breach the fortress of indexed memory. Learn arrays, their limits, and why indexes start at zero.',
    monster: 'The Null Pointer Spectre',
    monsterHp: 80,
    lessons: [
       {
        eyebrow: 'Chapter III \u00B7 The Array Citadel',
        title: 'The Continuous Block',
        subtitle: 'Storing multiple items sequentially.',
        content: `
          <p class="prose"><strong>Theory:</strong> Managing thousands of individual variables (like <code>score1</code>, <code>score2</code>, <code>score3</code>) is slow and clunky. Computers prefer to store collections of related data closely together in memory so the CPU can calculate offsets and jump through them in exact sequences very quickly.</p>
          <p class="prose"><strong>Definition:</strong> An <strong>array</strong> is a single, strongly-typed data structure that holds a fixed number of items contiguously (perfectly side-by-side) in memory.</p>
          
          <div class="analogy-box">
            <div class="analogy-emoji">🏢</div>
            <div>
              <div class="analogy-title">The Apartment Building Analogy</div>
              <div class="analogy-text">Think of a single variable like a standalone house perfectly fit for one family. An array is an apartment building. The building has one name (like "The Skyline"), and it holds many identical apartments inside. To deliver mail to a specific apartment, you just need the building's name and the apartment number (the index).</div>
            </div>
          </div>

          <div class="callout info">
            <div class="callout-label">Key Rules of Arrays</div>
            <div class="callout-body">
              <ul style="margin-left: 1.5rem; list-style-type: disc; margin-top: 0.5rem; margin-bottom: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <li><strong>Fixed Size:</strong> Once you build the apartment building with 5 apartments, you can't magically add a 6th. You have to demolish it and build a new, bigger one.</li>
                <li><strong>Same Type:</strong> Every apartment must hold the exact same type of data. If it's an array for integers (<code>int</code>), it can only hold whole numbers—no text or decimals!</li>
              </ul>
            </div>
          </div>

          <p class="prose">Let's look at how we declare and use this in Java:</p>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-comment">// Create a new array that can hold exactly 5 integers</span><br>
            <span class="code-type">int[]</span> scores = <span class="code-kw">new</span> <span class="code-type">int</span>[<span class="code-num">5</span>];<br><br>
            <span class="code-comment">// Store the value 95 inside the very first apartment (index 0)</span><br>
            scores[<span class="code-num">0</span>] = <span class="code-num">95</span>;
          </div>
        `
      },
      {
        eyebrow: 'Chapter III \u00B7 The Array Citadel',
        title: 'Zero-Based Indexing',
        subtitle: 'Why do we start counting from zero?',
        content: `
          <p class="prose"><strong>Theory:</strong> In low-level computer architecture, finding an item in memory requires knowing only two things: the starting memory address, and how far forward you have to "jump" to reach the next item. The index technically represents the number of jumps.</p>
          <p class="prose"><strong>Definition:</strong> <strong>Zero-based indexing</strong> means the absolute first element of an array lives at position 0, because it is exactly 0 jumps away from the beginning of the memory block.</p>
          
          <div class="analogy-box">
            <div class="analogy-emoji">📏</div>
            <div>
              <div class="analogy-title">The Measuring Tape Analogy</div>
              <div class="analogy-text">Think of an array like a measuring tape. The very beginning starting point isn't 1 inch — it's the absolute 0 mark. To find the first inch, you effectively start right at 0. To reach the very first item in the array memory, you travel 0 steps from the start. That's why the first item is index 0!</div>
            </div>
          </div>
          
          <div class="concept-grid">
            <div class="concept-card">
              <div class="cc-icon">🎯</div>
              <div class="cc-title">Index 0</div>
              <div class="cc-body">Zero steps away from the start. This is the very first element.</div>
            </div>
            <div class="concept-card">
              <div class="cc-icon">📏</div>
              <div class="cc-title">Index 4</div>
              <div class="cc-body">Four steps away from the start. In a size 5 array, this is the final element.</div>
            </div>
          </div>

          <div class="callout danger">
            <div class="callout-label">⚠ Array Index Out Of Bounds</div>
            <div class="callout-body">If you create an array of size 5 and try to access <code>scores[5]</code>, Java will throw a legendary error and crash your program. Why? Because 5 steps away from the start takes you completely outside the array's memory!</div>
          </div>
        `
      },
      {
         eyebrow: 'Chapter III \u00B7 The Array Citadel',
         title: 'Arrays & Loops',
         subtitle: 'The dynamic duo of programming.',
         content: `
          <p class="prose"><strong>Theory:</strong> Arrays hold massive amounts of data, but without an efficient way to read through them, they are just dead weight. Because array indexes are perfectly sequential (0, 1, 2...), they are mathematically perfect matches for <code>for</code> loops.</p>
          <p class="prose"><strong>Definition:</strong> <strong>Array Traversal</strong> is the process of visiting every single element in an array over time, typically done using a <code>for</code> loop where the loop counter perfectly acts as the array index.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🔦</div>
             <div>
               <div class="analogy-title">The Night Watchman Analogy</div>
               <div class="analogy-text">If an array is a long row of 100 locked doors along a hallway, a <code>for</code> loop is the night watchman. The watchman starts at room 0, checks the door, takes a step, checks room 1, takes a step... and mechanically visits every room until the end of the hall.</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-type">int[]</span> scores = {<span class="code-num">95</span>, <span class="code-num">80</span>, <span class="code-num">100</span>};<br><br>
            <span class="code-comment">// The loop counter 'i' elegantly glides from 0 to 2</span><br>
            <span class="code-kw">for</span>(<span class="code-type">int</span> i = <span class="code-num">0</span>; i < scores.length; i++) {<br>
            &nbsp;&nbsp;System.out.println(scores[i]);<br>
            }
          </div>
         `
      }
    ],
    x: 75,
    y: 25
  },
  {
    id: 3,
    name: 'Object-Oriented Oracle',
    territory: 'The Kingdom of Java',
    emoji: '🔮',
    status: 'locked',
    xp: 300,
    gold: 150,
    desc: 'Discover the secrets of Classes, Objects, Inheritance, and Polymorphism.',
    monster: 'The Polymorphic Hydra',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter IV \u00B7 Object-Oriented Oracle',
        title: 'Classes and Objects',
        subtitle: 'The Blueprints and the Buildings of Java.',
        content: `
          <p class="prose"><strong>Theory:</strong> As programs grow to hundreds of thousands of lines of code, simply listing commands chronologically top-to-bottom becomes entirely unmanageable. To keep things sane, we need to organize code around complex "things" rather than just isolated "actions."</p>
          <p class="prose"><strong>Definition:</strong> <strong>Object-Oriented Programming (OOP)</strong> is a paradigm that models software around unified data (attributes or variables) and behaviors (methods or functions) folded neatly into reusable entities called <strong>Objects</strong>.</p>
          
          <div class="analogy-box">
            <div class="analogy-emoji">🏗️</div>
            <div>
              <div class="analogy-title">The Blueprint Analogy</div>
              <div class="analogy-text">A <strong>Class</strong> is just a paper blueprint. You can't live inside a blueprint. But, you can use that blueprint to build real, physical houses. Those houses are the <strong>Objects</strong>. Every house built from the blueprint has the same structure, but they might have different things inside them (like different paint colors or owners).</div>
            </div>
          </div>
          
          <div class="concept-grid">
            <div class="concept-card">
              <div class="cc-icon">📜</div>
              <div class="cc-title">The Class</div>
              <div class="cc-body">The concept, the definition, the mould. It defines what attributes (variables) and behaviors (methods) the objects will have.</div>
            </div>
            <div class="concept-card">
              <div class="cc-icon">🏠</div>
              <div class="cc-title">The Object</div>
              <div class="cc-body">The real, tangible realization of the class. Resides in the computer's memory and holds actual, varied data. Often called an <strong>Instance</strong>.</div>
            </div>
          </div>

          <p class="prose">Here's how we define a blueprint, and then conjure an object from it:</p>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-comment">// 1. The Blueprint (Class)</span><br>
            <span class="code-kw">class</span> Dog {<br>
            &nbsp;&nbsp;<span class="code-type">String</span> name;<br>
            &nbsp;&nbsp;<span class="code-kw">void</span> bark() { System.out.println(<span class="code-str">"Woof!"</span>); }<br>
            }<br><br>
            <span class="code-comment">// 2. The Real Object (Instance) created in another method/file</span><br>
            Dog myDog = <span class="code-kw">new</span> Dog();<br>
            myDog.name = <span class="code-str">"Rex"</span>;<br>
            myDog.bark();
          </div>
        `
      },
      {
         eyebrow: 'Chapter IV \u00B7 Object-Oriented Oracle',
         title: 'Encapsulation',
         subtitle: 'Protecting your data from the outside world.',
         content: `
          <p class="prose"><strong>Theory:</strong> An object shouldn't let completely random code change its internal state however it wants. If you have a BankAccount object, another piece of code shouldn't be able to just change the balance to -1000 directly. Objects need defense mechanisms.</p>
          <p class="prose"><strong>Definition:</strong> <strong>Encapsulation</strong> is the bundling of data with the methods that operate on that data, and firmly restricting direct external access to some of the object's components to prevent misuse.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">💊</div>
             <div>
               <div class="analogy-title">The Pharmacy Analogy</div>
               <div class="analogy-text">Think of a pharmacy. You (another program) can't just walk behind the counter and grab any pills you want (the variables). That's dangerous! Instead, the medicine is safely stored and hidden (private). You must talk to the Pharmacist (the public methods). The Pharmacist validates your request and hands you the correct medicine safely.</div>
             </div>
          </div>
          <div class="callout info">
             <div class="callout-label">Access Modifiers</div>
             <div class="callout-body">
               We use visibility keywords like <strong>private</strong> (visible only inside the class) and <strong>public</strong> (visible to anyone) to build these protective walls in Java.
             </div>
          </div>
         `
      },
      {
         eyebrow: 'Chapter IV \u00B7 Object-Oriented Oracle',
         title: 'Inheritance',
         subtitle: 'Families of code and passing down traits.',
         content: `
          <p class="prose"><strong>Theory:</strong> Writing new code from scratch every time is slow. If you already wrote a "Vehicle" class that handles moving and stopping, and now you want to code a "Car" and a "Truck", you shouldn't have to rewrite the moving and stopping code!</p>
          <p class="prose"><strong>Definition:</strong> <strong>Inheritance</strong> is a mechanism where a new class (the Child) inherits all the attributes and methods of an existing predefined class (the Parent). The child can then add its own unique features on top of what it inherited.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🧬</div>
             <div>
               <div class="analogy-title">The Genetics Analogy</div>
               <div class="analogy-text">Just like a child inherits traits from their parents (eye color, height), a Child Class inherits capabilities from its Parent Class. The child gets everything the parent has for free, but can also learn totally new skills that the parent never knew!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-kw">class</span> Vehicle {<br>
            &nbsp;&nbsp;<span class="code-kw">void</span> move() { ... }<br>
            }<br><br>
            <span class="code-comment">// Car inherits the 'move' method automatically using 'extends'!</span><br>
            <span class="code-kw">class</span> Car <span class="code-kw">extends</span> Vehicle {<br>
            &nbsp;&nbsp;<span class="code-kw">void</span> honk() { ... }<br>
            }
          </div>
         `
      },
      {
         eyebrow: 'Chapter IV \u00B7 Object-Oriented Oracle',
         title: 'Polymorphism',
         subtitle: 'Many forms, one interface.',
         content: `
          <p class="prose"><strong>Theory:</strong> Sometimes, even though objects share a parent, they need to perform the exact same action in completely different ways. You don't want to write a different method name for each object; you want them all to understand the same command but execute it correctly based on who they are.</p>
          <p class="prose"><strong>Definition:</strong> <strong>Polymorphism</strong> (Greek for "many forms") allows objects of different classes to be treated as objects of a common parent class. It allows a single method call to behave totally differently depending on the specific child object invoking it.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🎭</div>
             <div>
               <div class="analogy-title">The "Speak!" Analogy</div>
               <div class="analogy-text">Imagine you are commanding three different pet objects: a Dog, a Cat, and a Duck. You issue the exact same instruction: <strong>"Speak!"</strong><br><br>You don't need to say "Bark", "Meow", or "Quack". You just say "Speak!". The Dog barks, the Cat meows, and the Duck quacks. They each know <em>how</em> to fulfill the command in their own specific way (Method Overriding).</div>
             </div>
          </div>
         `
      }
    ],
    x: 85,
    y: 55
  },
  {
    id: 4,
    name: 'The Exception Expanse',
    territory: 'The Kingdom of Java',
    emoji: '⚠️',
    status: 'locked',
    xp: 300,
    gold: 150,
    desc: 'Survive errors and prevent your code from crashing using try, catch, and throw.',
    monster: 'The Null Pointer Fiend',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter V \u00B7 The Exception Expanse',
        title: 'Handling Errors',
        subtitle: 'Don\'t let your program crash and burn.',
        content: `
          <p class="prose"><strong>Theory:</strong> No matter how perfectly you write your code, things go out of your control. Files go missing, networks fail, or users type text when you asked for a number. A robust program anticipates these problems and handles them without crashing.</p>
          <p class="prose"><strong>Definition:</strong> An <strong>Exception</strong> is an event that disrupts the normal flow of your program. We use a <code>try-catch</code> block to "try" risky code and "catch" the exception if it falls, recovering gracefully.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🪂</div>
             <div>
               <div class="analogy-title">The Parachute Analogy</div>
               <div class="analogy-text">Jumping out of a plane is the <strong>try</strong> block. Usually, it's fine. But if your main chute fails (an <strong>Exception</strong> is thrown), you don't just hit the ground (program crashes). You deploy your reserve chute (the <strong>catch</strong> block) to land safely!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-kw">try</span> {<br>
            &nbsp;&nbsp;<span class="code-type">int</span> result = <span class="code-num">10</span> / <span class="code-num">0</span>; <span class="code-comment">// This will fail!</span><br>
            } <span class="code-kw">catch</span> (<span class="code-type">ArithmeticException</span> e) {<br>
            &nbsp;&nbsp;System.out.println(<span class="code-str">"You can't divide by zero!"</span>);<br>
            }
          </div>
        `
      }
    ],
    x: 60,
    y: 80
  },
  {
    id: 5,
    name: 'The Collection Catacombs',
    territory: 'The Kingdom of Java',
    emoji: '📚',
    status: 'locked',
    xp: 400,
    gold: 200,
    desc: 'Unearth Lists, Sets, and Maps to store and manipulate massive datasets dynamically.',
    monster: 'The Index Out Of Bounds Beast',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter VI \u00B7 The Collection Catacombs',
        title: 'Beyond Standard Arrays',
        subtitle: 'Dynamic storage for dynamic programs.',
        content: `
          <p class="prose"><strong>Theory:</strong> Standard arrays are fast, but their size is fixed permanently when you create them. If you create an array of size 10 and try to add an 11th item, it breaks. In the real world, you rarely know exactly how many items you need to store (e.g., adding items indefinitely to a shopping cart).</p>
          <p class="prose"><strong>Definition:</strong> The <strong>Collections Framework</strong> is a unified architecture representing and manipulating collections of objects dynamically. The three main families are <strong>Lists</strong> (ordered, duplicates allowed), <strong>Sets</strong> (unordered, no duplicates), and <strong>Maps</strong> (Key-Value pairs).</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🎒</div>
             <div>
               <div class="analogy-title">The Magic Backpack Analogy</div>
               <div class="analogy-text">A standard array is like a metal briefcase — it only holds exactly what fits inside its rigid walls. An <strong>ArrayList</strong> is like a magic backpack — no matter how much you put inside, it automatically stretches and grows to make room for more!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">Java</div>
            <span class="code-comment">// Creating a dynamic list of Strings</span><br>
            ArrayList&lt;<span class="code-type">String</span>&gt; cart = <span class="code-kw">new</span> ArrayList&lt;&gt;();<br>
            cart.add(<span class="code-str">"Apple"</span>);<br>
            cart.add(<span class="code-str">"Banana"</span>);<br>
            cart.remove(<span class="code-num">0</span>); <span class="code-comment">// Removes "Apple" automatically!</span>
          </div>
        `
      }
    ],
    x: 25,
    y: 75
  },
  {
    id: 6,
    name: 'The Endless Void',
    territory: 'The Unknown',
    emoji: '🌌',
    status: 'locked',
    xp: 2000,
    gold: 1000,
    desc: 'An AI dynamically asks you questions from everything you learned. Prove your ultimate mastery.',
    monster: 'The Omniscient Core',
    monsterHp: 900,
    lessons: [],
    x: 50,
    y: 50,
    isMystery: true
  }
];
