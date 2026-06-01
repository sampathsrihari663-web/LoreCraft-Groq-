import { NodeData } from "../types";

export const csharpNodes: NodeData[] = [
  {
    id: 400,
    name: 'Class Coast',
    territory: 'The C# Realm',
    emoji: '#️⃣',
    status: 'cleared',
    xp: 190,
    gold: 75,
    desc: 'Get comfortable with modern C# paradigms and properties.',
    monster: 'The Getter Goblin',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter I \u00B7 Class Coast',
        title: 'Properties',
        subtitle: 'Goodbye boilerplate.',
        content: `
          <p class="prose"><strong>Theory:</strong> C# is heavily influenced by Java but is designed to reduce boilerplate. Instead of writing massive <code>getName()</code> and <code>setName()</code> methods, C# introduces <strong>Properties</strong> that look like direct variables but secretly act as encapsulated methods.</p>
          <div class="code-block">
            <div class="code-lang">C#</div>
            <span class="code-kw">public class</span> Player {<br>
            &nbsp;&nbsp;<span class="code-comment">// Auto-implemented Property! Safe and clean.</span><br>
            &nbsp;&nbsp;<span class="code-kw">public int</span> Score { <span class="code-kw">get; set;</span> }<br>
            }
          </div>
        `
      }
    ],
    x: 15,
    y: 20,
  },
  {
    id: 401,
    name: 'Collection Cove',
    territory: 'The C# Realm',
    emoji: '🎒',
    status: 'locked',
    xp: 240,
    gold: 100,
    desc: 'Master Lists, Dictionaries, and Data Structures in .NET.',
    monster: 'The Index Imp',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter II \u00B7 Collection Cove',
        title: 'Lists and Dictionaries',
        subtitle: 'The generic heroes.',
        content: `
          <p class="prose"><strong>Theory:</strong> Like Java's ArrayList, C# uses <code>List&lt;T&gt;</code> for dynamic sequences, and <code>Dictionary&lt;TKey, TValue&gt;</code> for Key-Value pairs (Java's HashMap). They are extremely optimized inside the .NET runtime memory model.</p>
          <div class="analogy-box">
             <div class="analogy-emoji">📚</div>
             <div>
               <div class="analogy-title">The Dictionary Analogy</div>
               <div class="analogy-text">A <code>List</code> is like a novel; you read it page by page (index 0, 1, 2) to find what you want. A <code>Dictionary</code> is exactly what it sounds like. You don't read every page; you look up the exact Key ("Apple") to instantly find the Value ("A red fruit").</div>
             </div>
          </div>
          <div class="code-block">
            <div class="code-lang">C#</div>
            <span class="code-comment">// Super clean initialization syntax in C#</span><br>
            <span class="code-kw">var</span> scores = <span class="code-kw">new</span> Dictionary&lt;<span class="code-type">string</span>, <span class="code-type">int</span>&gt; {<br>
            &nbsp;&nbsp;{ <span class="code-str">"Arthur"</span>, <span class="code-num">200</span> },<br>
            &nbsp;&nbsp;{ <span class="code-str">"Enemy"</span>, <span class="code-num">50</span> }<br>
            };
          </div>
        `
      }
    ],
    x: 45,
    y: 15,
  },
  {
    id: 402,
    name: 'Interface Islands',
    territory: 'The C# Realm',
    emoji: '🔌',
    status: 'locked',
    xp: 300,
    gold: 130,
    desc: 'Unleash polymorphism correctly using Interfaces.',
    monster: 'The Contract Crusader',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter III \u00B7 Interface Islands',
        title: 'Contracts in .NET',
        subtitle: 'I for Interface.',
        content: `
          <p class="prose"><strong>Theory:</strong> An Interface defines a strict contract that classes must follow. By convention in C#, all interfaces start with the letter I (<code>IEnumerable</code>, <code>IDisposable</code>, <code>IPlayer</code>).</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🔌</div>
             <div>
               <div class="analogy-title">The Wall Socket Analogy</div>
               <div class="analogy-text">An Interface is just the holes in the wall socket (2-prong or 3-prong). The wall socket doesn't care if you plug in a toaster, a TV, or a lamp (the Classes). As long as the plug perfectly matches the holes (the Contract/Interface), power will flow!</div>
             </div>
          </div>
        `
      }
    ],
    x: 75,
    y: 25,
  },
  {
    id: 403,
    name: 'LINQ Labyrinth',
    territory: 'The C# Realm',
    emoji: '🔍',
    status: 'locked',
    xp: 350,
    gold: 150,
    desc: 'Master querying data directly within C#.',
    monster: 'The Enumerator Entity',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter IV \u00B7 LINQ Labyrinth',
        title: 'LINQ',
        subtitle: 'SQL power inside your collections.',
        content: `
          <p class="prose"><strong>Theory:</strong> LINQ (Language Integrated Query) is a killer feature of C#. It allows you to query arrays, lists, and databases natively using a syntax that looks incredibly similar to SQL.</p>
          <div class="code-block">
            <div class="code-lang">C#</div>
            <span class="code-kw">var</span> adults = users.Where(u => u.Age >= <span class="code-num">18</span>).ToList();
          </div>
        `
      }
    ],
    x: 85,
    y: 55,
  },
  {
    id: 404,
    name: 'Async Ascent',
    territory: 'The C# Realm',
    emoji: '⏳',
    status: 'locked',
    xp: 420,
    gold: 200,
    desc: 'Unblock your main thread with async and await.',
    monster: 'The Deadlock Demon',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter V \u00B7 Async Ascent',
        title: 'Async / Await',
        subtitle: 'Keep the UI responsive.',
        content: `
          <p class="prose"><strong>Theory:</strong> When downloading a big file, you don't want your entire application to freeze. C# pioneered the <code>async/await</code> pattern. It tells the compiler "go do this heavy Task, and wake me up when it's done, but let everything else keep running in the meantime."</p>
          <div class="analogy-box">
             <div class="analogy-emoji">🍕</div>
             <div>
               <div class="analogy-title">The Pizza Delivery Analogy</div>
               <div class="analogy-text">If you order a pizza (a slow Task), you don't just stand completely frozen at the door staring at the peephole for 45 minutes (Blocking the thread). You <b>await</b> the pizza, meaning you pause your eating-pizza task, and go watch TV or do laundry. When the doorbell rings, you resume exactly where you left off!</div>
             </div>
          </div>
        `
      }
    ],
    x: 70,
    y: 80,
  },
  {
    id: 405,
    name: 'Generics Glacier',
    territory: 'The C# Realm',
    emoji: '❄️',
    status: 'locked',
    xp: 500,
    gold: 250,
    desc: 'Write robust, type-safe, reusable logic with Generics.',
    monster: 'The Type Terminator',
    monsterHp: 90,
    lessons: [
      {
        eyebrow: 'Chapter VI \u00B7 Generics Glacier',
        title: 'Generics',
        subtitle: 'Type safety without repetition.',
        content: `
          <p class="prose"><strong>Theory:</strong> Generics (<code>&lt;T&gt;</code>) allow you to define classes or methods with placeholders for the types they use. Unlike Java, C# Generics exist at runtime, which avoids nasty performance hits (boxing/unboxing) when dealing with primitive value types!</p>
          <div class="code-block">
            <div class="code-lang">C#</div>
            <span class="code-comment">// T can be literally anything. A generic backpack.</span><br>
            <span class="code-kw">public class</span> Backpack&lt;<span class="code-type">T</span>&gt; {<br>
            &nbsp;&nbsp;<span class="code-kw">public</span> <span class="code-type">T</span> Item { get; set; }<br>
            }
          </div>
        `
      }
    ],
    x: 40,
    y: 85,
  },
  {
    id: 406,
    name: 'Delegate Dominion',
    territory: 'The C# Realm',
    emoji: '🎯',
    status: 'locked',
    xp: 600,
    gold: 350,
    desc: 'Master Actions, Funcs, Events, and Callbacks.',
    monster: 'The Event Emitter',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter VII \u00B7 Delegate Dominion',
        title: 'Delegates and Events',
        subtitle: 'Function pointers but safer.',
        content: `
          <p class="prose"><strong>Theory:</strong> A Delegate is basically a strong-typed, object-oriented function pointer. It allows you to pass logic around. C# provides built-in <code>Action</code> (void return) and <code>Func</code> (returns a value) delegates to make this incredibly easy!</p>
          <div class="code-block">
            <div class="code-lang">C#</div>
            <span class="code-kw">public void</span> ExecuteCallback(<span class="code-type">Action</span> callback) {<br>
            &nbsp;&nbsp;Console.WriteLine(<span class="code-str">"Before..."</span>);<br>
            &nbsp;&nbsp;callback(); <span class="code-comment">// Runs the passed-in logic!</span><br>
            }
          </div>
        `
      }
    ],
    x: 15,
    y: 70,
  },
  {
    id: 407,
    name: 'Advanced Plateau',
    territory: 'The C# Realm',
    emoji: '🏔️',
    status: 'locked',
    xp: 700,
    gold: 450,
    desc: 'Records, Pattern Matching, and cutting-edge features.',
    monster: 'The Pattern Phantom',
    monsterHp: 80,
    lessons: [
      {
        eyebrow: 'Chapter VIII \u00B7 Advanced Plateau',
        title: 'Records & Pattern Matching',
        subtitle: 'The bleeding edge.',
        content: `
          <p class="prose"><strong>Theory:</strong> Modern C# introduces <strong>Records</strong> — an amazingly clean way to define immutable data structures in a single line. Pattern Matching provides incredibly powerful, clean, and declarative <code>switch</code> expressions.</p>
          <div class="code-block">
            <div class="code-lang">C#</div>
            <span class="code-comment">// Defines a fully-featured immutable class!</span><br>
            <span class="code-kw">public record</span> Player(<span class="code-type">string</span> Name, <span class="code-type">int</span> Score);
          </div>
        `
      }
    ],
    x: 25,
    y: 45,
  },
  {
    id: 408,
    name: 'The Endless Void',
    territory: 'The Unknown',
    emoji: '🌌',
    status: 'locked',
    xp: 2000,
    gold: 1000,
    desc: 'An AI dynamically asks you questions from everything you learned. Prove your ultimate mastery.',
    monster: 'The Task Beast',
    monsterHp: 900,
    lessons: [],
    x: 50,
    y: 50,
    isMystery: true
  }
];
