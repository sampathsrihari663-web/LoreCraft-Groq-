import { NodeData } from "../types";

export const cppNodes: NodeData[] = [
  {
    id: 300,
    name: 'Object Oasis',
    territory: 'The C++ Citadel',
    emoji: '🧱',
    status: 'cleared',
    xp: 220,
    gold: 80,
    desc: 'Dive into Classes and OOP features built on top of C.',
    monster: 'The Class Construct',
    monsterHp: 100,
    lessons: [
      {
        eyebrow: 'Chapter I \u00B7 Object Oasis',
        title: 'Classes in C++',
        subtitle: 'OOP comes to C.',
        content: `
          <p class="prose"><strong>Theory:</strong> C++ was originally named "C with Classes". It takes the raw power of C and adds Object-Oriented paradigms. Unlike Java, where you must use <code>new</code> to create objects, C++ lets you place objects directly on the ultra-fast Stack memory without pointers!</p>
          <div class="code-block">
            <div class="code-lang">C++</div>
            <span class="code-kw">class</span> Dog {<br>
            <span class="code-kw">public:</span><br>
            &nbsp;&nbsp;<span class="code-type">void</span> bark() { std::cout << <span class="code-str">"Woof!"</span>; }<br>
            };<br><br>
            <span class="code-comment">// Created instantly on the stack! No 'new' needed.</span><br>
            Dog myDog;<br>
            myDog.bark();
          </div>
        `
      }
    ],
    x: 15,
    y: 20,
  },
  {
    id: 301,
    name: 'Reference Ridge',
    territory: 'The C++ Citadel',
    emoji: '🔗',
    status: 'locked',
    xp: 280,
    gold: 120,
    desc: 'Master C++ References: Pointers without the pain.',
    monster: 'The Address Wraith',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter II \u00B7 Reference Ridge',
        title: 'References',
        subtitle: 'The safer pointer.',
        content: `
          <p class="prose"><strong>Theory:</strong> While C relies heavily on pure pointers (<code>*</code>), C++ introduced <strong>References</strong> (<code>&amp;</code>). A reference is basically a constant alias (a secondary name) for an existing variable. It acts exactly like the variable it aliases, without requiring you to use messy dereferencing syntax.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📛</div>
             <div>
               <div class="analogy-title">The Alias Analogy</div>
               <div class="analogy-text">If someone's legal name is "Jonathan", but everyone calls him "Jon", both names refer to the exact same physical person. A reference in C++ is just assigning "Jon" as an official nickname to the variable "Jonathan". Modifying one modifies the other!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">C++</div>
            <span class="code-type">int</span> original = <span class="code-num">10</span>;<br>
            <span class="code-type">int</span> &amp;nickname = original; <span class="code-comment">// Reference created</span><br>
            nickname = <span class="code-num">20</span>;<br>
            std::cout &lt;&lt; original; <span class="code-comment">// Prints 20!</span>
          </div>
        `
      }
    ],
    x: 45,
    y: 15,
  },
  {
    id: 302,
    name: 'RAII Ruins',
    territory: 'The C++ Citadel',
    emoji: '🛡️',
    status: 'locked',
    xp: 350,
    gold: 160,
    desc: 'Resource Acquisition Is Initialization \u2014 the core of modern C++ safely.',
    monster: 'The Memory Leak Minotaur',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter III \u00B7 RAII Ruins',
        title: 'RAII',
        subtitle: 'Auto-magic cleanup.',
        content: `
          <p class="prose"><strong>Theory:</strong> C++ doesn't have a garbage collector like Java. RAII means that you tie resource management (like memory or file handles) to an object's lifespan. When the object's scope ends, C++ <em>automatically</em> calls the object's <strong>Destructor</strong> <code>~ClassName()</code> to safely free the memory.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🛡️</div>
             <div>
               <div class="analogy-title">The Knight's Oath Analogy</div>
               <div class="analogy-text">RAII is like an honorable knight. When the knight is born (Constructor), they grab a sword (allocate memory). When their quest is over and they die (scope ends), their final dying breath (Destructor) automatically returns the sword to the armory. You never have to ask them to drop it!</div>
             </div>
          </div>
        `
      }
    ],
    x: 75,
    y: 25,
  },
  {
    id: 303,
    name: 'Polymorphism Peaks',
    territory: 'The C++ Citadel',
    emoji: '🎭',
    status: 'locked',
    xp: 400,
    gold: 200,
    desc: 'Inheritance and Virtual Methods: Mastering Virtual Tables.',
    monster: 'The V-Table Vampire',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter IV \u00B7 Polymorphism Peaks',
        title: 'Virtual Functions',
        subtitle: 'Late binding in C++.',
        content: `
          <p class="prose"><strong>Theory:</strong> By default, C++ binds methods at compile-time (Static Binding) for speed. To get Java-like Polymorphism (meaning the program decides which method to run based on the object's runtime class), you MUST mark the parent method as <code>virtual</code>. The compiler will generate a V-Table to look up the correct method.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📋</div>
             <div>
               <div class="analogy-title">The Master List (V-Table) Analogy</div>
               <div class="analogy-text">When you yell "Speak!" at an animal, how does it know whether to bark or meow? In C++, marking "Speak" as <code>virtual</code> forces the compiler to create a secret master lookup table (the V-Table). Before making a sound, the animal checks the table to see specifically what its species is supposed to sound like.</div>
             </div>
          </div>
        `
      }
    ],
    x: 85,
    y: 55,
  },
  {
    id: 304,
    name: 'STL Sanctuary',
    territory: 'The C++ Citadel',
    emoji: '📚',
    status: 'locked',
    xp: 450,
    gold: 220,
    desc: 'Master the Standard Template Library containers.',
    monster: 'The Vector Vanguard',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter V \u00B7 STL Sanctuary',
        title: 'Vectors and Types',
        subtitle: 'C++ dynamic storage.',
        content: `
          <p class="prose"><strong>Theory:</strong> The Standard Template Library (STL) provides incredibly powerful tools. The star is <code>std::vector</code>, which is a dynamic array (like Java's ArrayList) but optimized directly for performance and cached memory.</p>
          <div class="code-block">
            <div class="code-lang">C++</div>
            #include &lt;vector&gt;<br><br>
            std::vector&lt;<span class="code-type">int</span>&gt; scores;<br>
            scores.push_back(<span class="code-num">100</span>);<br>
            scores.push_back(<span class="code-num">200</span>);<br>
            <span class="code-comment">// Automatically cleans up its own memory!</span>
          </div>
        `
      }
    ],
    x: 70,
    y: 80,
  },
  {
    id: 305,
    name: 'Template Tower',
    territory: 'The C++ Citadel',
    emoji: '🧬',
    status: 'locked',
    xp: 500,
    gold: 250,
    desc: 'Write code that completely writes itself. Generics on steroids.',
    monster: 'The Meta-Compiler',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter VI \u00B7 Template Tower',
        title: 'Templates',
        subtitle: 'Code generating code.',
        content: `
          <p class="prose"><strong>Theory:</strong> <code>template &lt;typename T&gt;</code> allows you to write a single function or class that works with any data type. Unlike Java Generics (which erase the type at runtime), C++ Templates physically generate new, optimized versions of your code for every unique type you call it with during compilation!</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🏭</div>
             <div>
               <div class="analogy-title">The Factory Blueprint</div>
               <div class="analogy-text">A template isn't actual code; it's a blueprint for code. If you ask for a "Steel Sword" and a "Wooden Sword", the factory doesn't wait until runtime to figure out the differences. It stamps out two completely separate, perfectly optimized pipelines at the compile stage!</div>
             </div>
          </div>
        `
      }
    ],
    x: 40,
    y: 85,
  },
  {
    id: 306,
    name: 'Exception Echo',
    territory: 'The C++ Citadel',
    emoji: '⚠️',
    status: 'locked',
    xp: 550,
    gold: 300,
    desc: 'Handle disasters and unwinding the stack.',
    monster: 'The Uncaught Beast',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter VII \u00B7 Exception Echo',
        title: 'Try/Catch and Unwinding',
        subtitle: 'Graceful exits.',
        content: `
          <p class="prose"><strong>Theory:</strong> C++ adopted the <code>try-catch</code> syntax. The most beautiful part of C++ Exceptions is "Stack Unwinding". As the exception flies up the call stack looking for a catch block, C++ automatically calls the destructors for all local objects in its path. RAII at its finest!</p>
        `
      }
    ],
    x: 15,
    y: 70,
  },
  {
    id: 307,
    name: 'Smart Pointer Summit',
    territory: 'The C++ Citadel',
    emoji: '🧠',
    status: 'locked',
    xp: 650,
    gold: 400,
    desc: 'Modern C++: unique_ptr and shared_ptr. The end of manual delete.',
    monster: 'The Modern C++ Mind',
    monsterHp: 450,
    lessons: [
      {
        eyebrow: 'Chapter VIII \u00B7 Smart Pointer Summit',
        title: 'Modern Memory',
        subtitle: 'No more malloc or delete.',
        content: `
          <p class="prose"><strong>Theory:</strong> Modern C++ (C++11 and beyond) strongly discourages using raw pointers with <code>new</code> and <code>delete</code>. Instead, we use Smart Pointers (<code>unique_ptr</code>, <code>shared_ptr</code>) which automatically <code>delete</code> the memory they wrap when they go out of scope, using the magic of RAII!</p>
          <div class="code-block">
            <div class="code-lang">C++</div>
            #include &lt;memory&gt;<br><br>
            <span class="code-kw">void</span> play() {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-comment">// The modern, safe way to allocate heap memory</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;std::unique_ptr&lt;Dog&gt; myDog = std::make_unique&lt;Dog&gt;();<br>
            &nbsp;&nbsp;&nbsp;&nbsp;myDog->bark();<br>
            }<span class="code-comment"> // Memory is automatically freed right here!</span>
          </div>
        `
      }
    ],
    x: 25,
    y: 45,
  },
  {
    id: 308,
    name: 'The Endless Void',
    territory: 'The Unknown',
    emoji: '🌌',
    status: 'locked',
    xp: 2000,
    gold: 1000,
    desc: 'An AI dynamically asks you questions from everything you learned. Prove your ultimate mastery.',
    monster: 'The NullReference Titan',
    monsterHp: 900,
    lessons: [],
    x: 50,
    y: 50,
    isMystery: true
  }
];
