/* Lantern Homeschool — Conundrums: open-ended dilemmas with no single right answer.
   Inspired by the idea (used by schools like Astra Nova) that real problems need judgment, not just right answers.
   All scenarios here are original. band: 0 = grades 1–4, 1 = grades 5–8, 2 = grades 9–12. */
(function () {
  const C = (id, band, t, story, q, opts, think, talk) => ({ id, band, t, story, q, opts, think, talk });
  window.LH_CONUNDRUMS = [
    C('cookies', 0, 'The Last Cookie', 'There are 3 cookies left and 4 kids at the table. Mia helped bake them. Leo is the youngest. Sam is very hungry. Ana already had two.', 'What is the fairest thing to do?',
      ['Give one each to Mia, Leo and Sam', 'Break them so everyone gets the same amount', 'Save them for later', 'Something else'],
      ['Is "fair" always the same as "equal"?', 'Does helping bake mean you should get more?'], ['When have you had to share something that wasn\'t enough for everyone?', 'Who decides what is fair at our house?']),
    C('lostdog', 0, 'The Found Puppy', 'You find a friendly puppy in the park with no collar. It follows you home. Your family has always wanted a dog.', 'What should you do?',
      ['Keep the puppy', 'Put up "Found puppy" signs first', 'Take it to an animal shelter', 'Something else'],
      ['How would you feel if it were your lost puppy?', 'What if nobody comes for it after a week?'], ['What would our family do?', 'What makes something "yours"?']),
    C('treehouse', 0, 'The Treehouse Rule', 'Five friends built a treehouse together. One friend wants a rule: "No little brothers or sisters allowed."', 'Should the club make that rule?',
      ['Yes, it\'s their treehouse', 'No, everyone can come', 'Little kids can come on some days', 'Something else'],
      ['How would a little brother feel?', 'Is it okay to want a place just for friends?'], ['Have you ever been left out? What did it feel like?', 'How do groups make good rules?']),
    C('robotpet', 0, 'The Robot Pet', 'A company made a robot dog that never gets sick, never needs walks and always behaves. Real dogs need lots of care.', 'Would a robot dog be as good as a real dog?',
      ['Yes, maybe even better', 'No, a real dog is special', 'Good for some families, not others', 'Something else'],
      ['Can a robot love you back?', 'Who might need a robot dog more than a real one?'], ['What do pets give us that toys don\'t?', 'Would you want one? Why?']),
    C('island', 1, 'The New Island', 'A volcano creates a brand-new island between two countries. One country wants a nature reserve; the other wants a fishing port that would bring jobs.', 'What should happen to the island?',
      ['Make it a nature reserve', 'Build the fishing port', 'Split it in half', 'Share it with rules both agree on', 'Something else'],
      ['Who should get a say — and why?', 'What could go wrong with each plan in 50 years?'], ['How do we decide when two good goals clash?', 'Who speaks for nature?']),
    C('budget', 1, 'The Town Budget', 'Your town has money for only ONE project: a new library, a skate park, fixing old roads, or a free health clinic.', 'Which one would you fund?',
      ['Library', 'Skate park', 'Roads', 'Health clinic'],
      ['Who benefits most from each choice? Who is left out?', 'Which choice helps the most people for the longest time?'], ['How should leaders decide when they can\'t do everything?', 'Should everyone vote, or should experts decide?']),
    C('selfdrive', 1, 'The Self-Driving Bus', 'Your town can replace its bus drivers with self-driving buses. They are cheaper and the company says they are safer, but 40 drivers would lose their jobs.', 'Should the town switch?',
      ['Yes, switch now', 'No, keep the drivers', 'Switch slowly and retrain the drivers for new jobs', 'Something else'],
      ['How could the town check if the buses really are safer?', 'What do the drivers deserve?'], ['When new technology replaces jobs, who should help?', 'Would you ride one?']),
    C('cheat', 1, 'The Group Project', 'Your team gets an A on a project, but you know one teammate copied part of it from the internet. Nobody else noticed.', 'What should you do?',
      ['Tell the teacher', 'Talk to the teammate first', 'Say nothing — it\'s done', 'Something else'],
      ['What happens to trust in your team either way?', 'Is the grade really yours if part was copied?'], ['When is it right to report a friend?', 'What would you want a friend to do if you made that mistake?']),
    C('mars', 2, 'The Mars Colony Rules', 'The first 100 people are moving to Mars. They need rules on day one: who decides, how disagreements are settled, and how scarce air and water are shared.', 'What kind of government should the colony start with?',
      ['A captain with final say', 'Everyone votes on everything', 'An elected council', 'Experts decide on safety, everyone votes on the rest'],
      ['What happens in an emergency with each system?', 'How would you protect people who disagree with the majority?'], ['Which ideas from the U.S. Constitution would you bring? Which would you change?', 'Is fairness different when survival is at stake?']),
    C('ai_art', 2, 'The AI Art Contest', 'A student wins the school art contest. Later you learn they made it with an AI image tool and edited it for 10 hours. The rules didn\'t mention AI.', 'Should they keep the prize?',
      ['Yes — they followed the rules', 'No — AI art isn\'t their own work', 'Keep it, but make new rules for next year', 'Something else'],
      ['Is using AI like using a camera or a calculator — or different?', 'What makes something "your" creative work?'], ['Where should AI be allowed in school work?', 'How should artists be credited when AI learned from their work?']),
    C('privacy', 2, 'The Safety App', 'A new app could cut crime in your city by letting police see everyone\'s phone location in real time. It would be used only for emergencies — the city promises.', 'Should the city use it?',
      ['Yes, safety comes first', 'No, privacy matters more', 'Only with a judge\'s permission each time', 'Something else'],
      ['What could happen if the promise is broken or the data is hacked?', 'Who is most helped and most harmed?'], ['How much privacy would you trade for safety?', 'Who should watch the watchers?']),
    C('water', 2, 'The Shrinking River', 'A river supplies three groups: farmers who grow the region\'s food, a city of a million people, and a wetland full of rare birds. A drought means there\'s only enough water for two.', 'How should the water be divided?',
      ['City and farms first', 'Split it three ways, everyone gets less', 'Raise water prices so people use less', 'Something else'],
      ['What are the long-term effects of each choice?', 'Can new technology change the problem?'], ['Who should own water?', 'What would a first-principles thinker ask first?'])
  ];
})();
