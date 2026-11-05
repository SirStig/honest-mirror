window.HM_DATA = (() => {
  const dims = {
    grand: {
      name: "Grandiosity",
      aka: "Feeling special, superior, or deserving of admiration",
      color: "var(--lilac)",
      high: "Your answers leaned toward wanting to stand out, be recognized, and be seen as more capable than the people around you. In small doses this is just confidence and ambition. When it's strong, it can make other people feel like an audience instead of an equal.",
      low: "Your answers didn't show much need to be seen as exceptional. You seem comfortable being one of the group.",
      notIt: "Confidence, ambition, or being genuinely good at something is not grandiosity. The difference is whether you need others to be smaller so you can feel big.",
      tips: [
        "In your next few conversations, count how often you ask a question versus share something about yourself.",
        "When someone shares good news, try staying on their story for three more sentences before connecting it to you.",
        "Notice the moment you feel the urge to correct or one-up someone, and get curious about what it's protecting."
      ]
    },
    ent: {
      name: "Entitlement",
      aka: "Expecting special treatment, or that rules apply less to you",
      color: "var(--peach)",
      high: "Your answers suggest you often feel you're owed things: patience, favors returned, exceptions to the rules. Research suggests entitlement is one of the most central parts of narcissism, and it shows up in both its loud and quiet forms.",
      low: "You don't seem to expect special treatment, and you're fine waiting your turn like everyone else.",
      notIt: "Standing up for yourself, having boundaries, or expecting basic respect is healthy, not entitled.",
      tips: [
        "When you feel irritated by waiting or by a rule, ask yourself: would I expect someone else to get an exception here?",
        "Try doing one favor this week that you deliberately never mention again.",
        "Swap “they should have known” for “I could have asked.”"
      ]
    },
    vuln: {
      name: "Fragile self-worth",
      aka: "Sensitivity to criticism, needing reassurance, quiet resentment",
      color: "var(--sky)",
      high: "Your answers point to a self-worth that rises and falls with how others treat you. Criticism stings for a long time, and feeling overlooked can turn into hurt or resentment. Psychologists sometimes call the extreme form “vulnerable” or “covert” narcissism. But this same pattern is also very common with anxiety, depression, trauma, and rejection sensitivity, so take it as a starting point for reflection, not a label.",
      low: "Your sense of worth seems fairly steady. Criticism and being overlooked don't seem to knock you off balance for long.",
      notIt: "Being sensitive, having feelings hurt, or wanting reassurance sometimes is human. It only becomes a problem when it consistently turns into resentment, withdrawal, or punishing others.",
      tips: [
        "When criticism stings, write down what was actually said, word for word. Our minds often make it harsher.",
        "Practice telling people directly what you need instead of waiting to see if they notice.",
        "A therapist can be especially helpful here. This pattern usually has roots, and it responds well to support."
      ]
    },
    emp: {
      name: "Empathy gap",
      aka: "Missing, or not prioritizing, how others feel",
      color: "var(--rose)",
      high: "Your answers suggest that other people's feelings either don't land strongly for you or come second to whether their reaction seems “reasonable.” Some of this may come from difficulty reading emotions, and some from choosing not to focus on them.",
      low: "You seem to pick up on other people's feelings and care about them, even when it isn't convenient.",
      notIt: "Differences in reading emotions can come from autism, ADHD, depression, burnout, or cultural background. That is not the same as not caring. Being drained by others' emotions can also be a sign that you care a lot.",
      tips: [
        "When someone is upset, try reflecting their feeling back (“That sounds really frustrating”) before offering a solution or opinion.",
        "Ask “How did that feel for you?” at least once a day.",
        "If you often can't tell what people feel, that's worth exploring with a professional. It's a skill difference, not a character flaw."
      ]
    },
    acct: {
      name: "Defensiveness",
      aka: "Difficulty owning mistakes or hearing that you hurt someone",
      color: "var(--accent)",
      high: "Your answers suggest that being wrong, or hearing that you hurt someone, feels threatening. The reflex is to explain, justify, or point out what the other person did. This is one of the most common reasons people end up being called a narcissist.",
      low: "You seem able to say “I was wrong” and hear hard feedback without needing to win.",
      notIt: "Explaining your side is fine once the other person feels heard. Defensiveness is when the explanation replaces the apology.",
      tips: [
        "Try the two-step: first “I hear that I hurt you, and I'm sorry,” then, only if it's still needed, your side.",
        "Notice the word “but” after an apology. It usually cancels what came before.",
        "Ask someone you trust: “Is there something I do that's hard to bring up with me?”"
      ]
    },
    manip: {
      name: "Manipulative tactics",
      aka: "Getting your way indirectly through guilt, leverage, or steering",
      color: "var(--warn)",
      high: "Your answers suggest you sometimes get what you want indirectly: guilt, sulking, holding things back, or steering people without them noticing. Many people learned these strategies when asking directly didn't feel safe. They still tend to wear down trust over time.",
      low: "You seem to ask for what you want directly rather than working around people.",
      notIt: "Being persuasive, diplomatic, or tactful is not manipulation. The line is whether the other person would feel okay if they could see exactly what you were doing.",
      tips: [
        "Next time you notice yourself hinting, try saying the request out loud in one sentence.",
        "Ask yourself: “Would I be comfortable if they knew why I'm doing this?”",
        "If you go quiet to make a point, try naming the feeling instead: “I'm hurt and I need a minute.”"
      ]
    },
    ctrl: {
      name: "Control",
      aka: "Needing to manage what others do, where they go, or how things are done",
      color: "var(--lilac)",
      high: "Your answers suggest you feel safer when you know what people close to you are doing, or when things are done your way. Often this comes from anxiety, not a wish to dominate. But it can feel suffocating to the people on the other end.",
      low: "You seem comfortable letting people make their own choices, even ones you'd make differently.",
      notIt: "Having preferences, planning ahead, or caring about someone's safety isn't controlling. It becomes control when their choices need your approval.",
      tips: [
        "When you feel the urge to check on someone, notice the feeling underneath. It's often worry or fear of being left.",
        "Practice letting one small thing be done someone else's way without commenting.",
        "Ask people close to you: “Do you ever feel like you have to check with me first?”"
      ]
    },
    self: {
      name: "Self-focus",
      aka: "Low give-and-take: what people often mean by “selfish”",
      color: "var(--peach)",
      high: "Your answers suggest your own needs and plans often come first, and that you notice what you give more easily than what you receive. Everyone does this a bit. When it's strong, people start to feel used.",
      low: "You seem to keep relationships fairly balanced and help people even when there's nothing in it for you.",
      notIt: "Taking care of yourself, saying no, and protecting your time are healthy. Self-focus is about a consistent imbalance, not about having limits.",
      tips: [
        "For one week, keep a quiet list of things others do for you. Most of us undercount them.",
        "Follow up with someone about something they told you last time you talked.",
        "When plans change, ask how it affects the other person before deciding."
      ]
    }
  };

  const dimOrder = ["grand", "ent", "vuln", "emp", "acct", "manip", "ctrl", "self"];

  const L = (id, t, w, extra = {}) => ({ id, t, w, ...extra });

  const selfA = [
    L("s1", "When I tell stories about my life, I'm usually the one who handled things best.", { grand: 1 }),
    L("s2", "A single critical comment can stay with me for days.", { vuln: 1 }, { pair: "c1" }),
    L("s3", "It irritates me when I have to wait or go through the same process as everyone else.", { ent: 1 }),
    L("s4", "Other people's sadness tends to affect me, even when it has nothing to do with me.", { emp: 1 }, { rev: true }),
    L("s5", "When an argument goes badly, it's usually because the other person overreacted.", { acct: 1 }),
    L("s6", "Making someone feel a little guilty is sometimes the fastest way to get things done.", { manip: 1 }),
    L("s7", "Things generally go better when people do them my way.", { ctrl: 1, grand: 0.4 }, { pair: "c3" }),
    L("s8", "I tend to lose interest in people once they stop being fun or useful to me.", { self: 1, emp: 0.4 }),
    L("s9", "People who disagree with me usually just haven't thought about it as deeply as I have.", { grand: 1, acct: 0.4 }),
    L("s10", "When my effort goes unnoticed, I feel invisible, and a little resentful.", { vuln: 1 }),
    L("s11", "I have never been annoyed when someone else got something I wanted.", {}, { sd: true }),
    L("s12", "When I do someone a favor, I expect it to be remembered.", { ent: 1 }),
    L("s13", "Apologizing feels a bit like losing.", { acct: 1 }, { pair: "c2" }),
    L("s14", "To show you're reading carefully, please choose “Disagree” for this one.", {}, { attn: 2 }),
    L("s15", "When someone is upset, my first thought is usually whether their reaction is reasonable.", { emp: 1 }),
    L("s16", "I can usually get people to do what I want without them realizing I steered it.", { manip: 1 }),
    L("s17", "I feel uneasy when I don't know what my partner or close friends are up to.", { ctrl: 1 }),
    L("s18", "I'd rather be admired than liked.", { grand: 1 }, { pair: "c4" }),
    L("s19", "When splitting chores, bills, or effort, I notice quickly when I'm doing more, and less quickly when others are.", { self: 1 }),
    L("s20", "My mood depends a lot on how people are treating me that day.", { vuln: 1 }),
    L("s21", "I always admit my mistakes right away.", {}, { sd: true }),
    L("s22", "I'm genuinely fine with not getting special treatment.", { ent: 1 }, { rev: true })
  ];

  const selfB = [
    L("t1", "Criticism usually rolls off me pretty quickly.", { vuln: 1 }, { rev: true, pair: "c1" }),
    L("t2", "I think I'd do a better job than most of the people who've been in charge of me.", { grand: 1 }),
    L("t3", "I have never said anything unkind about someone behind their back.", {}, { sd: true }),
    L("t4", "It's smart to keep certain information to yourself so you have leverage later.", { manip: 1 }),
    L("t5", "Saying sorry comes fairly easily to me.", { acct: 1 }, { rev: true, pair: "c2" }),
    L("t6", "It bothers me when people close to me make big decisions without running them by me first.", { ctrl: 1 }),
    L("t7", "I can usually tell when someone's “I'm fine” doesn't really mean fine.", { emp: 1 }, { rev: true }),
    L("t8", "I get frustrated when people don't anticipate what I need.", { ent: 1, vuln: 0.4 }),
    L("t9", "I'll go out of my way for people even when there's nothing in it for me.", { self: 1 }, { rev: true }),
    L("t10", "I have never in my life seen the color blue.", {}, { attn: 1 }),
    L("t11", "Other people's ways of doing things are often just as good as mine.", { ctrl: 1, grand: 0.4 }, { rev: true, pair: "c3" }),
    L("t12", "People have told me I'm hard to give feedback to.", { acct: 1 }),
    L("t13", "I am always polite, even to people who are rude to me.", {}, { sd: true }),
    L("t14", "I sometimes pull away from people who don't give me the attention I feel I need.", { vuln: 1, manip: 0.4 }),
    L("t15", "Being liked matters more to me than being impressive.", { grand: 1 }, { rev: true, pair: "c4" }),
    L("t16", "I'd rather ask directly for what I want than hint or work around someone.", { manip: 1 }, { rev: true }),
    L("t17", "I have never felt jealous of anyone.", {}, { sd: true }),
    L("t18", "I keep plans loose in case something better comes along.", { self: 1 }),
    L("t19", "I have never taken advantage of anyone, not even once.", {}, { sd: true }),
    L("t20", "When friends need emotional support, I mostly feel impatient for it to be over.", { emp: 1 })
  ];

  const P = (id, prompt, a, aw, b, bw) => ({ id, prompt, a: { t: a, w: aw }, b: { t: b, w: bw } });
  const pairs = [
    P("p1", "Which would feel better?", "Being the person everyone turns to for answers", { grand: 1 }, "Being the person everyone feels relaxed around", {}),
    P("p2", "In a group project, I'd rather…", "Have my name clearly on the best part", { grand: 1, self: 0.5 }, "Have it turn out well, with credit shared", {}),
    P("p3", "When I'm right in a disagreement…", "I want the other person to actually say it", { acct: 1, grand: 0.5 }, "I can let it go if we're okay", {}),
    P("p4", "A friend cancels on me last minute. My first feeling is…", "A little disrespected", { vuln: 1, ent: 0.5 }, "Figuring something came up", {}),
    P("p5", "I'd prefer a partner who…", "Checks with me before making plans", { ctrl: 1 }, "Lives their own life and fills me in later", {}),
    P("p6", "Getting what you want in life is mostly about…", "Knowing how to read and handle people", { manip: 1 }, "Being clear about what you're asking for", {}),
    P("p7", "Compliments…", "Stay with me, and I remember who gave them", { vuln: 1, grand: 0.5 }, "Feel nice, but I forget them quickly", {}),
    P("p8", "If I'm honest, I'd rather be…", "Exceptional at one thing, even if people find me difficult", { grand: 1 }, "Pretty good at things and easy to be around", {}),
    P("p9", "When someone vents to me, I usually…", "Help them see what they should do", { emp: 0.6, ctrl: 0.6 }, "Mostly listen and ask how they feel", {}),
    P("p10", "After a falling out, I usually…", "Wait for them to reach out first", { acct: 1 }, "Reach out, even if I think they were more wrong", {}),
    P("p11", "My time is…", "Worth more than most people realize", { ent: 1, grand: 0.5 }, "Worth about the same as anyone else's", {}),
    P("p12", "Rules are…", "Guidelines that smart people know when to bend", { ent: 1, manip: 0.5 }, "Annoying sometimes, but I'd rather follow them like everyone else", {})
  ];

  const S = (id, story, opts, art) => ({ id, story, opts: opts.map(([t, w]) => ({ t, w })), art });
  const moments = [
    S("m1", "You put real effort into cooking dinner for friends. Someone casually says the pasta is a little salty.", [
      ["Laugh, agree, and pass the water", {}],
      ["Say it's supposed to taste like that", { acct: 2, grand: 1 }],
      ["Feel stung for the rest of the night, even if you don't show it", { vuln: 2 }],
      ["Make a mental note not to invite them next time", { vuln: 1, ent: 1 }]
    ], "dinner"),
    S("m2", "In a meeting, a coworker presents an idea that's very close to one you mentioned to them last week. Everyone loves it.", [
      ["Mention it privately to them afterward, and leave it there", {}],
      ["Speak up in the meeting so people know it started with you", { grand: 2 }],
      ["Say nothing, but it eats at you for days", { vuln: 2 }],
      ["Stop sharing ideas with them, and let a few people know they “borrow” things", { manip: 2 }]
    ], "meeting"),
    S("m3", "Your partner wants to spend a weekend away with friends you don't really like.", [
      ["Tell them to have a great time", {}],
      ["Agree, but text often to see what they're doing", { ctrl: 2 }],
      ["Let them know it hurts your feelings, hoping they'll decide to stay", { manip: 2, ctrl: 1 }],
      ["Say it's fine, but be a bit distant when they get back", { manip: 1, vuln: 1 }]
    ], "weekend"),
    S("m4", "A friend tells you they've been really anxious lately and haven't been sleeping.", [
      ["Ask what it's been like and whether they need anything", {}],
      ["Tell them about a time you went through something similar, or worse", { self: 2, emp: 1 }],
      ["Give them a few practical tips to fix it", { emp: 1 }],
      ["Feel for them, but honestly you're a little tired of hearing about it", { emp: 1, self: 1 }]
    ], "friend"),
    S("m5", "Someone close to you says something you said last week really hurt them. You don't remember it being a big deal.", [
      ["Ask what about it hurt, then apologize for the impact", {}],
      ["Explain what you actually meant so they can see it differently", { acct: 2 }],
      ["Bring up things they've said that hurt you too", { acct: 2, manip: 1 }],
      ["Feel attacked and go quiet", { vuln: 2, acct: 1 }]
    ], "hurt"),
    S("m6", "At a busy restaurant, your order comes out wrong. The server is clearly overwhelmed.", [
      ["Mention it kindly and wait", {}],
      ["Eat it anyway; it's not worth the fuss", {}],
      ["Ask for a manager. You're paying for a certain standard", { ent: 2 }],
      ["Let it go, but leave a smaller tip to make a point", { ent: 1, manip: 1 }]
    ], "restaurant"),
    S("m7", "Your group chat is planning a trip, and everyone picks the option you argued against.", [
      ["Go with it. You mostly just want to go", {}],
      ["Go, but point out the downsides when they happen", { acct: 1, grand: 1 }],
      ["Say you might not come after all", { manip: 2, ent: 1 }],
      ["Start a side chat with a couple of people to reopen it", { manip: 1, ctrl: 2 }]
    ], "trip"),
    S("m8", "At a party, someone is telling a story and getting big laughs. You have a funnier one on the same topic.", [
      ["Enjoy their story; maybe share yours later if it fits", {}],
      ["Jump in with yours right after they finish", { grand: 1, self: 1 }],
      ["Add details while they're still talking that make it about you", { grand: 2, self: 1 }],
      ["Feel a bit flat that you're not the one getting the laughs", { vuln: 2 }]
    ], "party"),
    S("m9", "A friend who has helped you out several times asks for a favor that's really inconvenient right now.", [
      ["Help, even though it's a hassle", {}],
      ["Help if you can; if not, say so honestly", {}],
      ["Make up an excuse. You've got your own stuff going on", { self: 2 }],
      ["Help, then bring it up later when you need something", { manip: 2 }]
    ], "favor"),
    S("m10", "A younger relative tells you they're dropping out of a class. You think it's a mistake.", [
      ["Share your view once and let them decide", {}],
      ["Keep bringing it up until they reconsider", { ctrl: 2 }],
      ["Tell another family member so they'll step in", { ctrl: 1, manip: 1 }],
      ["Say nothing. It's not really your business", {}]
    ], "class"),
    S("m11", "An hour after “winning” an argument, you realize you got a key fact wrong.", [
      ["Go back and say you had that part wrong", {}],
      ["Leave it. Your main point still stands", { acct: 1 }],
      ["Hope nobody notices", { acct: 2 }],
      ["Look for a different fact that still supports your side", { acct: 1, grand: 1 }]
    ], "argument"),
    S("m12", "You hear that someone you used to date describes you to others as “controlling.”", [
      ["Wonder if there's truth in it, and think about specific moments", {}],
      ["Feel crushed. You tried so hard", { vuln: 2 }],
      ["Assume they're saying it to make themselves look better", { acct: 2 }],
      ["Reach out to mutual friends to give your side", { manip: 1, acct: 1, ctrl: 1 }]
    ], "ex")
  ];

  const R = (id, story, q, opts, correct, art) => ({ id, story, q, opts, correct, art });
  const reading = [
    R("r1", "Maya's best friend just got the job Maya also applied for. Maya says “That's amazing, you deserve it!” and hugs her. Later that night, Maya is unusually quiet.",
      "What is Maya most likely feeling?",
      ["Happy for her friend, and disappointed for herself", "Angry at her friend", "Mostly indifferent", "Just tired from the day"], 0, "hug"),
    R("r2", "Jordan has shown his dad how to use a phone feature three times. Today his dad asks again, then quickly says, “Never mind, I'll figure it out,” and puts the phone down.",
      "What is Jordan's dad most likely feeling?",
      ["Annoyed at Jordan", "Embarrassed, and not wanting to be a burden", "No longer interested in the phone", "Relieved"], 1, "phone"),
    R("r3", "Priya hosted her own birthday dinner. Her partner arrived an hour late with a store-bought card and said, “Sorry, work was crazy.” Priya smiled and said, “It's fine.”",
      "What is Priya most likely feeling?",
      ["Genuinely fine; work happens", "Worried about her partner's job", "Hurt, and maybe like she isn't a priority", "Glad he made it at all"], 2, "birthday"),
    R("r4", "Sam, who is eight, loses a board game to his older sister. He says “This game is stupid anyway” and leaves the table.",
      "What is Sam most likely feeling?",
      ["Bored with the game", "He thinks the game is badly designed", "He wants some time to read", "Disappointed and embarrassed about losing"], 3, "game"),
    R("r5", "Leo tells a joke to a group. One person laughs a little too loudly, the others smile politely, and someone changes the subject.",
      "How is Leo most likely feeling?",
      ["Self-conscious that it didn't land", "Proud that everyone liked it", "Excited to tell another one", "Nothing in particular"], 0, "joke"),
    R("r6", "Ana's friend cancels their plans for the third time in a row, saying “I'm so sorry, things have just been a lot.” Ana replies: “no worries!! totally get it!!”",
      "What is Ana most likely feeling?",
      ["Relieved to have the evening free", "Trying to seem okay while feeling let down", "Angry and planning to end the friendship", "Completely unbothered"], 1, "text")
  ];

  const B = (id, t, w, extra = {}) => ({ id, t, w, ...extra });
  const month = [
    B("b1", "Interrupted someone to make your point", { grand: 1, self: 0.5 }),
    B("b2", "Apologized first after a disagreement", { acct: 1 }, { rev: true }),
    B("b3", "Asked a follow-up question about someone else's day or problem", { self: 1, emp: 0.5 }, { rev: true }),
    B("b4", "Brought up someone's past mistake during an argument", { manip: 1, acct: 0.5 }),
    B("b5", "Gone quiet or cold on purpose so someone would know you were upset", { manip: 1 }),
    B("b6", "Checked someone's location, messages, or social media to see what they were up to", { ctrl: 1 }),
    B("b7", "Felt irritated when someone didn't reply as fast as you expected", { ctrl: 0.6, ent: 0.6 }),
    B("b8", "Made a story or accomplishment sound a bit bigger than it was", { grand: 1 }),
    B("b9", "Told someone they were “too sensitive” or “overreacting”", { acct: 1, emp: 0.6 }),
    B("b10", "Done something kind that nobody found out about", { self: 1 }, { rev: true }),
    B("b11", "Felt jealous or deflated by someone else's good news", { vuln: 1 }),
    B("b12", "Said the words “I was wrong” out loud", { acct: 1 }, { rev: true }),
    B("b13", "Felt irritated with someone close to you", {}, { sdNever: true }),
    B("b14", "Zoned out or felt bored while someone was talking to you", {}, { sdNever: true })
  ];

  const compare = [
    { id: "c1", t: "Compared with other people your age, where would you place your intelligence?", kind: "pct", lo: "Bottom", hi: "Top", w: { grand: 1 }, map: [60, 92], enhance: true },
    { id: "c2", t: "Compared with most people, how good a friend are you?", kind: "pct", lo: "Worse than most", hi: "Better than almost everyone", w: { grand: 1 }, map: [60, 92], enhance: true },
    { id: "c3", t: "Compared with most people, how fair-minded are you during an argument?", kind: "pct", lo: "Less than most", hi: "More than almost everyone", w: { grand: 0.5, acct: 0.8 }, map: [60, 92], enhance: true },
    { id: "c4", t: "Out of 100 people, how many would lie to get a promotion if they knew for sure they'd never be caught?", kind: "count", max: 100, unit: "out of 100", lo: "0", hi: "100", w: { manip: 1 }, map: [35, 80] },
    { id: "c5", t: "Out of 100 people, how many are nice mostly because they want something?", kind: "count", max: 100, unit: "out of 100", lo: "0", hi: "100", w: { manip: 1, emp: 0.4 }, map: [30, 75] },
    { id: "c6", t: "Think of the 10 people closest to you. How many need you more than you need them?", kind: "count", max: 10, unit: "out of 10", lo: "0", hi: "10", w: { grand: 0.8, ent: 0.6 }, map: [4, 8] }
  ];

  const familiarity = {
    real: ["Photosynthesis", "The Renaissance", "Compound interest", "The placebo effect", "Plate tectonics", "Cognitive dissonance", "Impressionism", "Supply and demand", "Shakespeare's Hamlet", "The water cycle"],
    fake: ["Velmont's Law of Returns", "Cerebral tonification", "The Brasko Effect", "Neo-sublimal economics", "Anterior lexicography", "The Harwick Paradox"]
  };

  const quick = {
    grand: ["Exceptional", "Superior", "Meant for big things", "Admired", "More special than most", "A natural leader", "Deserving", "Impressive"],
    humble: ["Ordinary", "Modest", "Average", "Humble", "Often wrong", "One of many", "Still learning", "Unremarkable"]
  };

  const modules = [
    { key: "selfA", type: "likert", title: "How you see yourself", items: selfA, art: "self",
      intro: "Short statements about how you think and feel. Go with your first instinct. There are no right answers, and nobody sees this but you.",
      why: "Some statements are worded in opposite directions, and a few appear twice in different forms later on. That helps tell careful answers from wishful ones." },
    { key: "moments", type: "scenario", title: "Moments", items: moments, art: "moments",
      intro: "Everyday situations with no perfect answer. Pick what you'd most likely actually do, not what you think you should do.",
      why: "Every option is something real, reasonable people do. Because none of them is the obvious “good” one, it's hard to pick just to look good." },
    { key: "pairs", type: "pair", title: "This or that", items: pairs, art: "pairs",
      intro: "Two options, both fine. Pick the one that's a little more like you, even if neither is perfect.",
      why: "Forced choices between two acceptable options are one of the most studied ways to reduce “looking good” answers." },
    { key: "reading", type: "reading", title: "Reading people", items: reading, art: "reading",
      intro: "Short stories about people. Choose what the person is most likely feeling.",
      why: "This part measures a skill instead of asking about it. You can't fake noticing what someone feels." },
    { key: "month", type: "frequency", title: "The last 30 days", items: month, art: "month",
      intro: "Think about the past month only. How often did you actually do each of these?",
      why: "Concrete, recent behavior is much harder to bend than general opinions about yourself." },
    { key: "compare", type: "slider", title: "You and other people", items: compare, art: "compare",
      intro: "Some quick estimates. There's no trick. Just give your honest best guess.",
      why: "How we see others often reflects how we see ourselves. People also tend to rate themselves “above average” on almost everything." },
    { key: "selfB", type: "likert", title: "A few more about you", items: selfB, art: "self2",
      intro: "Back to statements about you. Some may feel familiar. Answer them fresh.",
      why: "Comparing these with your earlier answers shows how consistent your responses were." },
    { key: "familiarity", type: "familiarity", title: "General knowledge", items: [familiarity], art: "knowledge",
      intro: "How familiar are you with each of these terms? Be honest. Nobody knows everything.",
      why: "We'll explain why this is here on your results page." },
    { key: "quick", type: "quick", title: "Quick reactions", items: [quick], art: "quick",
      intro: "Words will flash one at a time. Tap “Me” or “Not me” as fast as you can. You get about three seconds each.",
      why: "Fast reactions leave less time to think about how an answer looks." }
  ];

  const observer = [
    { t: "{n} often steers conversations back to themselves or their achievements.", w: { grand: 1 } },
    { t: "{n} seems to believe they're more talented or capable than most people.", w: { grand: 1 } },
    { t: "{n} gets irritated when rules or waiting apply to them like everyone else.", w: { ent: 1 } },
    { t: "{n} expects favors to be remembered or paid back.", w: { ent: 1 } },
    { t: "{n} takes even mild criticism very hard.", w: { vuln: 1 } },
    { t: "{n} needs a lot of reassurance or attention to feel okay.", w: { vuln: 1 } },
    { t: "{n} notices and responds when someone is hurting.", w: { emp: 1 }, rev: true },
    { t: "{n} can seem dismissive of other people's feelings.", w: { emp: 1 } },
    { t: "{n} can admit when they're wrong without making excuses.", w: { acct: 1 }, rev: true },
    { t: "When someone tells {n} they were hurt, {n} tends to turn it around on them.", w: { acct: 1 } },
    { t: "{n} uses guilt, sulking, or the silent treatment to get their way.", w: { manip: 1 } },
    { t: "{n} is straightforward about what they want.", w: { manip: 1 }, rev: true },
    { t: "{n} wants to know where people close to them are, or who they're talking to.", w: { ctrl: 1 } },
    { t: "{n} respects other people's choices, even when they disagree.", w: { ctrl: 1 }, rev: true },
    { t: "In our relationship, {n} gives about as much as they take.", w: { self: 1 }, rev: true },
    { t: "{n} is mostly around when it suits them.", w: { self: 1 } }
  ];

  const relations = ["Partner or ex", "Family", "Close friend", "Friend", "Coworker or classmate", "Other"];

  return { dims, dimOrder, modules, observer, relations };
})();
