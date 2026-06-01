import { NodeData } from "../types";

export const cNodes: NodeData[] = [
  {
    id: 200,
    name: 'Memory Meadows',
    territory: 'The C Catacombs',
    emoji: '💾',
    status: 'cleared',
    xp: 180,
    gold: 60,
    desc: 'Uncover the foundational concepts of C and raw variables.',
    monster: 'The Segfault Skeleton',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter I \u00B7 Memory Meadows',
        title: 'The Metal',
        subtitle: 'Close to the hardware.',
        content: `
          <p class="prose"><strong>Theory:</strong> C is a procedural language that runs extremely close to the hardware. There are no built-in classes or objects. Variables map almost directly to memory addresses and sizes.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">⚙️</div>
             <div>
               <div class="analogy-title">The Engine Room Analogy</div>
               <div class="analogy-text">Writing in C is like working in the engine room of a ship. You have access to the raw valves and gears. It's incredibly fast and powerful, but if you turn the wrong valve, the whole ship sinks (segmentation fault).</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">C</div>
            <span class="code-type">int</span> age = <span class="code-num">25</span>;<br>
            <span class="code-type">char</span> grade = <span class="code-str">'A'</span>;<br>
            <span class="code-comment">// C strings are just arrays of characters!</span><br>
            <span class="code-type">char</span> name[] = <span class="code-str">"Arthur"</span>;
          </div>
        `
      }
    ],
    x: 15,
    y: 20,
  },
  {
    id: 201,
    name: 'Control Caverns',
    territory: 'The C Catacombs',
    emoji: '🛤️',
    status: 'locked',
    xp: 220,
    gold: 70,
    desc: 'Master the rigorous C control flow constructs.',
    monster: 'The Switch Sentinel',
    monsterHp: 100,
    lessons: [
      {
        eyebrow: 'Chapter II \u00B7 Control Caverns',
        title: 'Truth in Numbers',
        subtitle: '0 is false, everything else is true.',
        content: `
          <p class="prose"><strong>Theory:</strong> Historically, C didn't have a boolean (true/false) type. Instead, conditional statements just evaluating integers. The value <code>0</code> means false, and literally any other value (like <code>1</code> or <code>-5</code>) means true. (Modern C uses <code>&lt;stdbool.h&gt;</code>).</p>
          <div class="analogy-box">
             <div class="analogy-emoji">💡</div>
             <div>
               <div class="analogy-title">The Light Switch Analogy</div>
               <div class="analogy-text">In C, 0 is the exact "off" position of a light switch. Any other number, whether it's 1, 99, or -42, means the switch has been flipped "on". There's no true/false, only Off and Not-Off!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">C</div>
            <span class="code-type">int</span> isAlive = <span class="code-num">1</span>;<br>
            <span class="code-kw">if</span> (isAlive) { <span class="code-comment">// Evaluates to TRUE</span><br>
            &nbsp;&nbsp;&nbsp;&nbsp;printf(<span class="code-str">"Player is breathing!"</span>);<br>
            }
          </div>
        `
      }
    ],
    x: 45,
    y: 15,
  },
  {
    id: 202,
    name: 'Pointers Peak',
    territory: 'The C Catacombs',
    emoji: '👉',
    status: 'locked',
    xp: 300,
    gold: 100,
    desc: 'The ultimate rite of passage. Master memory addresses.',
    monster: 'The Dangling Pointer',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter III \u00B7 Pointers Peak',
        title: 'Pointers',
        subtitle: 'Maps to the treasure.',
        content: `
          <p class="prose"><strong>Theory:</strong> A pointer is simply a variable whose value is the <strong>memory address</strong> of another variable.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🗺️</div>
             <div>
               <div class="analogy-title">The Treasure Map Analogy</div>
               <div class="analogy-text">A normal variable is the actual treasure chest full of gold. A <strong>pointer</strong> is a piece of paper (a map) that tells you exactly where the chest is buried (address). <code>&amp;</code> creates the map. <code>*</code> digs it up to get the gold!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">C</div>
            <span class="code-type">int</span> score = <span class="code-num">100</span>;<br>
            <span class="code-type">int</span> *mapToScore = &amp;score; <span class="code-comment">// &amp; Gets the memory address</span><br>
            printf(<span class="code-str">"Value: %d"</span>, *mapToScore); <span class="code-comment">// * Digs up the 100!</span>
          </div>
        `
      }
    ],
    x: 75,
    y: 25,
  },
  {
    id: 203,
    name: 'Allocation Abyss',
    territory: 'The C Catacombs',
    emoji: '🧱',
    status: 'locked',
    xp: 350,
    gold: 150,
    desc: 'Use malloc and free to claim and release heap memory.',
    monster: 'The Segfault Reaper',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter IV \u00B7 Allocation Abyss',
        title: 'Dynamic Allocation',
        subtitle: 'Borrowing space from the system.',
        content: `
          <p class="prose"><strong>Theory:</strong> When arrays need a size that isn't known until the program is running, you must ask the operating system for a chunk of the "Heap" memory using <code>malloc()</code> or <code>calloc()</code>. <strong>CRITICAL:</strong> You MUST give the memory back using <code>free()</code>, or your program will hold onto it forever (Memory Leak).</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🏨</div>
             <div>
               <div class="analogy-title">The Hotel Room Analogy</div>
               <div class="analogy-text"><code>malloc</code> is you checking into a hotel room. The hotel gives you the keys to Room 210. <code>free</code> is you returning the keys when you check out. If you lose the keys and never check out (a Memory Leak), the hotel can never rent the room to anyone else, and eventually, the entire hotel is booked out and the system crashes!</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">C</div>
            <span class="code-comment">// Ask OS for memory to hold 5 integers</span><br>
            <span class="code-type">int</span> *scores = (<span class="code-type">int</span>*) malloc(<span class="code-num">5</span> * <span class="code-kw">sizeof</span>(<span class="code-type">int</span>));<br>
            <span class="code-comment">// YOU MUST RETURN IT!</span><br>
            free(scores);
          </div>
        `
      }
    ],
    x: 85,
    y: 55,
  },
  {
    id: 204,
    name: 'Array Archipelago',
    territory: 'The C Catacombs',
    emoji: '🛶',
    status: 'locked',
    xp: 400,
    gold: 200,
    desc: 'Strings are just arrays. Arrays decay to pointers.',
    monster: 'The Buffer Overrun',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter V \u00B7 Array Archipelago',
        title: 'Strings and Null-Termination',
        subtitle: 'When text is just numbers.',
        content: `
          <p class="prose"><strong>Theory:</strong> C has no built-in String object! Text in C is simply an array of <code>char</code> values. To let functions know where the text ends, C places an invisible "Null Terminator" (<code>\\0</code>) at the end of the text. Because an array name is just a pointer to its first element, strings are usually passed around as <code>char *</code>.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🚂</div>
             <div>
               <div class="analogy-title">The Train Caboose Analogy</div>
               <div class="analogy-text">A string is a physical train of characters. The function reading it walks down the train car by car. How does it know when to stop? The Null Terminator (<code>\\0</code>) is the red caboose at the end of the train. Without it, the function keeps walking right off the tracks into random memory (Buffer Overrun)!</div>
             </div>
          </div>
        `
      }
    ],
    x: 70,
    y: 80,
  },
  {
    id: 205,
    name: 'Struct Stronghold',
    territory: 'The C Catacombs',
    emoji: '🧱',
    status: 'locked',
    xp: 450,
    gold: 250,
    desc: 'Group distinct data types together using Structs.',
    monster: 'The Typedef Terror',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter VI \u00B7 Struct Stronghold',
        title: 'Structs and Typedefs',
        subtitle: 'The precursor to objects.',
        content: `
          <p class="prose"><strong>Theory:</strong> C lacks OOP and classes. If you want to group a player's Score, Health, and Name into one "thing", you create a <code>struct</code>. Structs bundle data, but unlike classes, they cannot naturally contain functions.</p>
          <div class="code-block">
            <div class="code-lang">C</div>
            <span class="code-kw">struct</span> Player {<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-type">int</span> score;<br>
            &nbsp;&nbsp;&nbsp;&nbsp;<span class="code-type">int</span> health;<br>
            };<br><br>
            <span class="code-kw">struct</span> Player p1;<br>
            p1.score = <span class="code-num">100</span>;
          </div>
        `
      }
    ],
    x: 40,
    y: 85,
  },
  {
    id: 206,
    name: 'Preprocessor Pinnacle',
    territory: 'The C Catacombs',
    emoji: '⚙️',
    status: 'locked',
    xp: 500,
    gold: 300,
    desc: 'Macros, Header Files, and the Compilation Process.',
    monster: 'The Macro Mutant',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter VII \u00B7 Preprocessor Pinnacle',
        title: 'The C Preprocessor',
        subtitle: 'Find and Replace on steroids.',
        content: `
          <p class="prose"><strong>Theory:</strong> Anything starting with a <code>#</code> is an instruction to the Preprocessor. <code>#include</code> literally copies and pastes the contents of a header file into your code! <code>#define</code> performs pure text substitution before the compiler even sees the code. It is incredibly powerful but dangerous if misused!</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📝</div>
             <div>
               <div class="analogy-title">The Copy Editor Analogy</div>
               <div class="analogy-text">The compiler is a very strict math professor. But the preprocessor is a simple copy editor armed with Find-and-Replace. When it sees <code>#define PI 3.14</code>, it quickly scans the whole document and blindly replaces every "PI" with "3.14" before handing the final essay to the professor.</div>
             </div>
          </div>
        `
      }
    ],
    x: 15,
    y: 70,
  },
  {
    id: 207,
    name: 'Function Pointer Fortress',
    territory: 'The C Catacombs',
    emoji: '🎯',
    status: 'locked',
    xp: 600,
    gold: 400,
    desc: 'Treat functions like data. The core of callbacks.',
    monster: 'The Pointer To Pointer',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter VIII \u00B7 Function Pointer Fortress',
        title: 'Code is Data',
        subtitle: 'Pointers that execute.',
        content: `
          <p class="prose"><strong>Theory:</strong> Just like variables live in memory, executable code lives in memory. You can create a pointer that holds the exact address of a function, allowing you to pass functions around like variables and invoke them dynamically (Callbacks and Event Handlers)!</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🕹️</div>
             <div>
               <div class="analogy-title">The Remote Control Analogy</div>
               <div class="analogy-text">A function is a machine that does something. A function pointer is a wireless remote control for that machine. You can hand the remote control to another completely different part of your program, and it can push the button (execute the function) without knowing how the machine was built!</div>
             </div>
          </div>
        `
      }
    ],
    x: 25,
    y: 45,
  },
  {
    id: 208,
    name: 'The Endless Void',
    territory: 'The Unknown',
    emoji: '🌌',
    status: 'locked',
    xp: 2000,
    gold: 1000,
    desc: 'An AI dynamically asks you questions from everything you learned. Prove your ultimate mastery.',
    monster: 'The System Panic',
    monsterHp: 900,
    lessons: [],
    x: 50,
    y: 50,
    isMystery: true
  }
];
