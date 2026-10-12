/* Lantern Homeschool — curriculum content, grades 5–8. Quiz rows: [question, correct, wrong1, wrong2, wrong3] */
(function () {
  const KA = 'https://www.khanacademy.org/';
  const C = (window.LH_COURSES = window.LH_COURSES || {});

  /* ───────────── GRADE 5 ───────────── */
  C['5-math'] = {
    t: '5th Grade Math', r: [['Khan Academy · 5th grade math', KA + 'math/cc-fifth-grade-math']],
    u: [
      { t: 'Adding and subtracting decimals', g: 'decAdd',
        l: ['Line up the decimal points, then add or subtract like whole numbers.', 'Add zeros so every number has the same number of places: 3.5 = 3.50.', 'Estimate first: 4.87 + 2.1 is about 5 + 2 = 7.'],
        try: 'Add up three prices from a menu.' },
      { t: 'Adding fractions with unlike denominators', g: 'fracAdd',
        l: ['Fractions need a common denominator before you add.', '1/3 + 1/4 → 4/12 + 3/12 = 7/12.', 'Simplify your answer when you can: 6/8 = 3/4.'],
        try: 'A recipe uses 1/2 cup of milk and 1/3 cup of water. How much liquid in all?' },
      { t: 'Multiplying fractions', g: 'fracMult',
        l: ['Multiply numerators together and denominators together: 2/3 × 3/5 = 6/15 = 2/5.', '"Of" means multiply: 1/2 of 3/4 = 3/8.', 'Multiplying by a fraction less than 1 makes a number smaller.'],
        try: 'Half of a 3/4-full pan of brownies is eaten. What fraction of the pan was eaten?' },
      { t: 'Volume', g: 'volume',
        l: ['Volume is how much space a solid takes up, measured in cubic units.', 'For a rectangular box: volume = length × width × height.', 'You can add the volumes of two boxes to find a total.'],
        try: 'Measure a cereal box and find its volume in cubic inches.' },
      { t: 'Order of operations', g: 'orderOps',
        l: ['Do parentheses first, then multiplication and division (left to right), then addition and subtraction (left to right).', '3 + 4 × 2 = 3 + 8 = 11, not 14.', '(3 + 4) × 2 = 14.'],
        try: 'Write an expression that equals 20 using +, × and parentheses.' }
    ]
  };
  C['5-ela'] = {
    t: '5th Grade Reading & Writing', r: [['Khan Academy · 5th grade reading & vocabulary', KA + 'ela/5th-grade-reading-and-vocab'], ['Khan Academy · 5th & 6th grade grammar', KA + 'ela/5th-and-6th-grade-grammar']],
    u: [
      { t: 'Summarizing',
        l: ['A summary tells the most important ideas in your own words.', 'Leave out small details and your opinion.', 'Fiction summary: who, wanted, but, so, then.'],
        try: 'Summarize a chapter of your read-aloud in 4 sentences.',
        q: [['A good summary includes…', 'Only the most important ideas', 'Every detail', 'Your opinion', 'Copied sentences']] .concat([['A summary should be written…', 'In your own words', 'Word for word', 'As a poem', 'In a different language'], ['Which does NOT belong in a summary?', 'Your opinion of the book', 'The main character', 'The main problem', 'How it was solved']]) },
      { t: 'Quoting text evidence',
        l: ['Text evidence is a quote or detail from the text that supports your answer.', 'Use quotation marks when you copy exact words.', 'Explain how the evidence proves your point.'],
        try: 'Answer a question about a story using one direct quote.',
        q: [['Exact words copied from a text go inside…', 'Quotation marks', 'Parentheses', 'Brackets', 'Nothing']] .concat([['Text evidence is used to…', 'Support an answer', 'Decorate a page', 'Replace a title', 'Fill space'], ['After giving a quote you should…', 'Explain how it supports your point', 'Stop writing', 'Add another quote with no explanation', 'Change the topic']]) },
      { t: 'Comparing texts on the same topic',
        l: ['Two authors can write about the same topic with different points of view.', 'Look at what each author includes, leaves out and emphasizes.', 'Firsthand accounts come from people who were there. Secondhand accounts come from others.'],
        try: 'Read two articles about the same animal. List what each included that the other did not.',
        q: [['A diary entry from someone who saw an event is a…', 'Firsthand account', 'Secondhand account', 'Fable', 'Glossary']] .concat([['An encyclopedia article written later is a…', 'Secondhand account', 'Firsthand account', 'Primary diary', 'Interview']]).concat([['Two texts about the same event may differ because the authors have different…', 'Points of view', 'Alphabets', 'Page numbers', 'Fonts']]) },
      { t: 'Using commas',
        l: ['Use commas to separate items in a list: apples, pears, and plums.', 'Use a comma after an introductory word or phrase: Yes, I can. After lunch, we left.', 'Use commas to set off a name in direct address: Sam, come here.'],
        try: 'Write 3 sentences, each using commas in a different way.',
        q: [['Which sentence uses commas correctly?', 'We bought eggs, milk, and bread.', 'We bought, eggs milk and bread.', 'We, bought eggs milk, and bread.', 'We bought eggs milk and, bread.'], ['Which is correct?', 'After dinner, we played cards.', 'After, dinner we played cards.', 'After dinner we, played cards.', 'After dinner we played, cards.']] .concat([['Which uses direct address correctly?', 'Mia, please sit down.', 'Mia please, sit down.', 'Mia please sit, down.', 'Mia please sit down,']]) },
      { t: 'Research skills',
        l: ['Start with a question, then gather information from several sources.', 'Trustworthy sources: .gov, .edu, known publishers, experts.', 'Take notes in your own words and list your sources.'],
        try: 'Research one question about your state and list 2 sources.',
        q: [['Which source is usually most reliable?', 'A government science website', 'An anonymous comment', 'A random social post', 'A rumor']] .concat([['Notes for research should be…', 'In your own words', 'Copied word for word', 'Unlabeled', 'Thrown away'], ['Why list your sources?', 'To give credit and let others check facts', 'To make it longer', 'To hide information', 'No reason']]) }
    ]
  };
  C['5-sci'] = {
    t: '5th Grade Science', r: [['NASA Space Place · Solar System', 'https://spaceplace.nasa.gov/menu/solar-system/'], ['PhET simulations', 'https://phet.colorado.edu/']],
    u: [
      { t: 'Matter and its changes',
        l: ['Matter is made of particles too small to see.', 'In a physical change the substance stays the same (melting ice). In a chemical change a new substance forms (baking a cake, rust).', 'When matter changes, its total weight stays the same (conservation of mass).'],
        try: 'Weigh a cup of water, dissolve sugar in it, and weigh again.',
        q: [['Which is a chemical change?', 'Iron rusting', 'Ice melting', 'Cutting paper', 'Water boiling']] .concat([['When sugar dissolves in water, the total weight…', 'Stays the same', 'Disappears', 'Doubles', 'Becomes zero'], ['Matter is made of…', 'Tiny particles', 'Light only', 'Sound', 'Nothing']]) },
      { t: 'Ecosystems and food webs',
        l: ['Producers (plants) make food from sunlight. Consumers eat other living things.', 'Decomposers (fungi, bacteria) break down dead matter and return nutrients to soil.', 'A food web shows how energy moves through an ecosystem.'],
        try: 'Draw a food web for a pond with at least 6 living things.',
        q: [['Plants are…', 'Producers', 'Consumers', 'Decomposers', 'Predators'], ['Mushrooms are…', 'Decomposers', 'Producers', 'Herbivores', 'Predators']] .concat([['The original source of energy in most food webs is…', 'The Sun', 'Soil', 'Water', 'Wind']]) },
      { t: "Earth's systems and the water cycle", r: [['NASA Space Place · Earth', 'https://spaceplace.nasa.gov/menu/earth/']],
        l: ["Earth's four systems: geosphere (rock), hydrosphere (water), atmosphere (air) and biosphere (life).", 'The water cycle: evaporation → condensation → precipitation → collection.', 'Most of Earth\'s water is salty ocean water.'],
        try: 'Put a bowl of warm water under plastic wrap with ice on top. Watch "rain" form.',
        q: [['Water vapor turning into droplets is…', 'Condensation', 'Evaporation', 'Precipitation', 'Erosion'], ['Rain, snow and hail are…', 'Precipitation', 'Condensation', 'Evaporation', 'Collection only']] .concat([['Most of Earth\'s water is in…', 'Oceans', 'Lakes', 'Glaciers', 'Clouds']]) },
      { t: 'The solar system and gravity', r: [['NASA Space Place · Solar System', 'https://spaceplace.nasa.gov/menu/solar-system/']],
        l: ['Eight planets orbit the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.', "Gravity pulls objects toward Earth's center and keeps planets in orbit.", 'Earth rotates once a day (day and night) and orbits the Sun once a year.'],
        try: 'Make a scale model of the planets with fruit and seeds.',
        q: [['Which planet is largest?', 'Jupiter', 'Earth', 'Mars', 'Venus'], ['Day and night happen because Earth…', 'Rotates', 'Orbits the Moon', 'Stops moving', 'Gets closer to the Sun']] .concat([['What keeps the planets in orbit around the Sun?', 'Gravity', 'Magnets', 'Wind', 'Light']]) },
      { t: 'Stars and shadows', r: [['NASA Space Place · Sun', 'https://spaceplace.nasa.gov/menu/sun/']],
        l: ['The Sun is a star. It looks bigger and brighter than other stars because it is much closer.', 'Shadows change length and direction during the day as the Sun appears to move.', 'Constellations appear in different places in different seasons.'],
        try: 'Mark the shadow of a stick every hour on a sunny day.',
        q: [['Why does the Sun look brighter than other stars?', 'It is much closer to Earth', 'It is the biggest star', 'It is the only star', 'It is a planet']] .concat([['When are shadows usually shortest?', 'Around noon', 'At sunrise', 'At sunset', 'At midnight'], ['The Sun is a…', 'Star', 'Planet', 'Moon', 'Comet']]) }
    ]
  };
  C['5-soc'] = {
    t: '5th Grade U.S. History', r: [['iCivics student games', 'https://ed.icivics.org/students'], ['Khan Academy · U.S. history', KA + 'humanities/us-history']],
    u: [
      { t: 'The thirteen colonies',
        l: ['England founded 13 colonies along the Atlantic coast.', 'New England colonies relied on fishing and trade, Middle colonies on grain, and Southern colonies on plantations.', 'Enslaved Africans were forced to work, especially in the Southern colonies.'],
        try: 'Make a chart of the three colonial regions: climate, jobs, crops.',
        q: [['How many original colonies were there?', '13', '50', '10', '7']] .concat([['Which region was known as the "breadbasket" for its grain?', 'Middle colonies', 'New England', 'Southern colonies', 'Western territories'], ['Which country founded the 13 colonies?', 'England', 'Spain', 'France', 'China']]) },
      { t: 'The American Revolution', r: [['iCivics · Uncovering Loyalties', 'https://ed.icivics.org/resources/game/3306359/uncovering-loyalties']],
        l: ['Colonists protested British taxes they had no vote on: "No taxation without representation."', 'The Declaration of Independence was adopted on July 4, 1776.', 'With help from France, the colonies won the war, which ended in 1783.'],
        try: 'Play "Uncovering Loyalties" on iCivics.',
        q: [['When was the Declaration of Independence adopted?', '1776', '1492', '1787', '1865'], ['Which country helped the colonists win?', 'France', 'Spain only', 'Russia', 'Japan']] .concat([['"No taxation without representation" protested…', 'Taxes without a vote', 'Free schools', 'New roads', 'Too many holidays']]) },
      { t: 'The Constitution and three branches', r: [['iCivics · Branches of Power', 'https://ed.icivics.org/resources/game/74/branches-of-power']],
        l: ['The Constitution (1787) set up the U.S. government.', 'Legislative branch (Congress) makes laws. Executive branch (President) carries them out. Judicial branch (courts) interprets them.', 'Checks and balances keep any branch from getting too much power.'],
        try: 'Play "Branches of Power" on iCivics.',
        q: [['Which branch makes laws?', 'Legislative', 'Executive', 'Judicial', 'Military'], ['Who leads the executive branch?', 'The President', 'The Chief Justice', 'The Speaker', 'A governor']] .concat([['Checks and balances…', 'Keep one branch from getting too powerful', 'Pay for roads', 'Count votes', 'Print money']]) },
      { t: 'Westward expansion',
        l: ['The Louisiana Purchase (1803) doubled the size of the U.S.', 'Lewis and Clark explored the new land with help from Sacagawea.', 'Expansion forced many Native nations from their homelands, including on the Trail of Tears.'],
        try: 'Trace the Lewis and Clark route on a map.',
        q: [['The Louisiana Purchase was bought from…', 'France', 'Britain', 'Mexico', 'Spain']] .concat([['Who helped guide Lewis and Clark?', 'Sacagawea', 'Paul Revere', 'Ben Franklin', 'Abraham Lincoln'], ['The Trail of Tears was the forced removal of…', 'Native nations', 'British soldiers', 'Gold miners', 'Settlers from Europe']]) },
      { t: 'The Civil War',
        l: ['Northern and Southern states split over slavery and states\' rights.', 'The Civil War lasted from 1861 to 1865. The Union (North) won.', 'President Lincoln issued the Emancipation Proclamation in 1863. The 13th Amendment ended slavery in 1865.'],
        try: 'Write a short letter as a person living in 1865 about the war\'s end.',
        q: [['Who was President during the Civil War?', 'Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'], ['Which amendment ended slavery?', '13th', '1st', '19th', '2nd']] .concat([['Which side won the Civil War?', 'The Union', 'The Confederacy', 'Britain', 'No one']]) }
    ]
  };

  /* ───────────── GRADE 6 ───────────── */
  C['6-math'] = {
    t: '6th Grade Math', r: [['Khan Academy · 6th grade math', KA + 'math/cc-sixth-grade-math']],
    u: [
      { t: 'Ratios and rates', g: 'ratio',
        l: ['A ratio compares two amounts: 3 cats to 5 dogs is 3:5.', 'Equivalent ratios scale both parts: 3:5 = 6:10 = 9:15.', 'A unit rate compares to 1: $12 for 4 pounds = $3 per pound.'],
        try: 'Double a recipe. Keep every ingredient in the same ratio.' },
      { t: 'Percents', g: 'percentOf',
        l: ['Percent means "per hundred": 25% = 25/100 = 0.25.', 'To find 20% of 80, multiply 0.20 × 80 = 16.', '10% is easy: move the decimal one place left.'],
        try: 'Find the price of a $40 item that is 25% off.' },
      { t: 'Integers', g: 'intAdd',
        l: ['Integers include negative numbers, zero and positive numbers.', 'On a number line, −5 is less than −2.', 'Adding a negative is like subtracting: 7 + (−3) = 4.'],
        try: 'Track a temperature that starts at −4° and rises 9°.' },
      { t: 'One-step equations', g: 'oneStep',
        l: ['An equation says two things are equal. Solve by doing the opposite operation to both sides.', 'x + 7 = 15 → subtract 7 → x = 8.', '4x = 28 → divide by 4 → x = 7.'],
        try: 'Write a one-step equation about your age and solve it.' },
      { t: 'Area of triangles and data', g: 'triAreaMean',
        l: ['Area of a triangle = ½ × base × height.', 'The mean (average) is the sum divided by how many numbers.', 'Example: the mean of 4, 6 and 11 is 21 ÷ 3 = 7.'],
        try: 'Find the mean of your quiz scores this week.' }
    ]
  };
  C['6-ela'] = {
    t: '6th Grade English', r: [['Khan Academy · 6th grade reading, grammar & vocab', KA + 'ela/new-6th-grade-reading-and-vocabulary'], ['CommonLit text library', 'https://www.commonlit.org/texts']],
    u: [
      { t: 'Central idea',
        l: ['The central idea is the main point of a whole text, not just one paragraph.', 'Supporting details build the central idea throughout the text.', 'Write it as a sentence, then check that most details support it.'],
        try: 'Read a CommonLit nonfiction text and state its central idea.',
        q: [['The central idea is…', 'The main point of the whole text', 'The first sentence always', 'One small fact', 'The title only']] .concat([['To check a central idea, ask whether…', 'Most details support it', 'It has big words', 'It is in bold', 'It is a question'], ['A central idea should be written as…', 'A complete sentence', 'One word', 'A list of names', 'A page number']]) },
      { t: 'Character development', r: [['CommonLit · Theseus and the Minotaur', 'https://www.commonlit.org/texts/theseus-and-the-minotaur']],
        l: ['Authors reveal characters through what they say, do and think, and what others say about them.', 'A dynamic character changes. A static character stays the same.', 'Characters\' choices move the plot forward.'],
        try: 'Track one character\'s choices across a story and how they change.',
        q: [['A character who changes during a story is…', 'Dynamic', 'Static', 'Flat', 'Minor']] .concat([['Which is a way authors reveal character?', 'Through actions and dialogue', 'Through page numbers', 'Through the font', 'Through the cover price'], ['A character who stays the same is…', 'Static', 'Dynamic', 'Round', 'Protagonist']]) },
      { t: 'Claims and evidence',
        l: ['A claim is an argument the writer wants you to accept.', 'Evidence (facts, statistics, expert quotes) supports the claim.', 'Strong arguments use relevant, sufficient evidence and address the other side.'],
        try: 'Write a claim about whether kids should have homework, with 2 pieces of evidence.',
        q: [['"Schools should start later because teens need more sleep" — the claim is…', 'Schools should start later', 'Teens need sleep', 'Schools exist', 'There is no claim']] .concat([['Which is the strongest evidence?', 'A statistic from a research study', 'A rumor', 'A personal guess', 'A joke'], ['Addressing the other side is called a…', 'Counterclaim', 'Summary', 'Title', 'Caption']]) },
      { t: 'Pronouns',
        l: ['Pronouns replace nouns: he, she, they, it, we.', 'Subject pronouns (I, he) do the action. Object pronouns (me, him) receive it.', 'A pronoun must clearly match its antecedent (the noun it replaces).'],
        try: 'Find and fix 3 unclear pronouns in an old piece of your writing.',
        q: [['Choose the correct sentence.', 'She and I went to the store.', 'Her and me went to the store.', 'Me and her went to the store.', 'Her and I went to the store.'], ['Choose the correct sentence.', 'Give the book to him and me.', 'Give the book to he and I.', 'Give the book to him and I.', 'Give the book to he and me.']] .concat([['The noun a pronoun replaces is its…', 'Antecedent', 'Adjective', 'Verb', 'Suffix']]) },
      { t: 'Vocabulary in context',
        l: ['Use context clues, word parts and reference tools to define new words.', 'Connotation is a word\'s feeling (cheap vs. thrifty). Denotation is its dictionary meaning.', 'Choose words with the connotation that fits your purpose.'],
        try: 'Make a list of 5 word pairs with similar meaning but different connotations.',
        q: [['Which word has the most positive connotation?', 'Thrifty', 'Cheap', 'Stingy', 'Miserly'], ['A word\'s dictionary meaning is its…', 'Denotation', 'Connotation', 'Synonym', 'Theme']] .concat([['"Unbreakable" — the prefix un- means…', 'Not', 'Again', 'Before', 'Under']]) }
    ]
  };
  C['6-sci'] = {
    t: '6th Grade Life & Earth Science', r: [['Khan Academy · Middle school biology', KA + 'science/ms-biology'], ['Khan Academy · Middle school Earth & space', KA + 'science/middle-school-earth-and-space-science']],
    u: [
      { t: 'Cells', r: [['Khan Academy · Middle school biology', KA + 'science/ms-biology']],
        l: ['All living things are made of cells, the basic unit of life.', 'The nucleus holds DNA. Mitochondria release energy. The cell membrane controls what goes in and out.', 'Plant cells also have a cell wall and chloroplasts.'],
        try: 'Build a cell model with food and label 5 parts.',
        q: [['Which part holds a cell\'s DNA?', 'Nucleus', 'Cell wall', 'Vacuole', 'Membrane'], ['Which part is found in plant cells but not animal cells?', 'Chloroplast', 'Nucleus', 'Mitochondria', 'Cell membrane']] .concat([['The basic unit of life is the…', 'Cell', 'Atom', 'Organ', 'Tissue']]) },
      { t: 'Body systems',
        l: ['Cells form tissues, tissues form organs, and organs form systems.', 'The circulatory system moves blood. The respiratory system exchanges gases. The digestive system breaks down food.', 'Systems work together: muscles need oxygen from the lungs carried by blood.'],
        try: 'Measure your heart rate at rest and after 1 minute of jumping jacks.',
        q: [['Which system brings oxygen into the body?', 'Respiratory', 'Digestive', 'Skeletal', 'Nervous']] .concat([['The correct order from small to large is…', 'Cell → tissue → organ → system', 'Organ → cell → system → tissue', 'System → organ → cell → tissue', 'Tissue → cell → organ → system'], ['The heart is part of the…', 'Circulatory system', 'Digestive system', 'Skeletal system', 'Respiratory system']]) },
      { t: 'Weather and climate systems', r: [['Khan Academy · Middle school Earth & space', KA + 'science/middle-school-earth-and-space-science']],
        l: ['The Sun heats Earth unevenly, which drives winds and ocean currents.', 'Air masses meet at fronts and cause weather changes.', 'Climate depends on latitude, elevation, and nearness to oceans.'],
        try: 'Compare the climate of your town with a city at the same latitude on another continent.',
        q: [['What drives global winds?', 'Uneven heating by the Sun', 'The Moon', 'Earthquakes', 'Volcanoes']] .concat([['Where two air masses meet is a…', 'Front', 'Fault', 'Ridge', 'Delta'], ['Places near the equator are usually…', 'Warmer', 'Colder', 'Snowier', 'Drier everywhere']]) },
      { t: 'Plate tectonics',
        l: ["Earth's crust is broken into plates that move a few centimeters a year.", 'Plates collide (mountains), pull apart (rifts) or slide past each other (earthquakes).', 'Most volcanoes and earthquakes happen along plate boundaries.'],
        try: 'Use two graham crackers on frosting to model plates colliding and sliding.',
        q: [['Where do most earthquakes happen?', 'Along plate boundaries', 'In the middle of plates', 'Only in oceans', 'Only at the poles']] .concat([['Colliding plates can form…', 'Mountains', 'Rivers', 'Deserts', 'Glaciers'], ['How fast do plates move?', 'A few centimeters a year', 'A mile a day', 'They never move', 'A meter per second']]) },
      { t: 'Energy and forces', r: [['Khan Academy · Middle school physics', KA + 'science/ms-physics']],
        l: ['Kinetic energy is energy of motion. Potential energy is stored energy.', 'Friction is a force that slows things down.', 'Energy cannot be created or destroyed, only changed from one form to another.'],
        try: 'Build a marble roller coaster and find where it has the most kinetic energy.',
        q: [['A ball at the top of a hill has the most…', 'Potential energy', 'Kinetic energy', 'Sound energy', 'No energy']] .concat([['Energy of motion is…', 'Kinetic', 'Potential', 'Chemical', 'Nuclear'], ['Friction usually…', 'Slows objects down', 'Speeds them up', 'Creates energy', 'Removes gravity']]) }
    ]
  };
  C['6-soc'] = {
    t: '6th Grade Ancient Civilizations', r: [['Khan Academy · World history', KA + 'humanities/world-history']],
    u: [
      { t: 'Early humans and farming',
        l: ['Early humans were hunter-gatherers who moved to follow food.', 'About 10,000 years ago, people began farming (the Neolithic Revolution).', 'Farming led to permanent villages, surplus food and new jobs.'],
        try: 'Make a T-chart of life before and after farming.',
        q: [['The shift to farming is called the…', 'Neolithic Revolution', 'Industrial Revolution', 'Renaissance', 'Reformation']] .concat([['Before farming, most people were…', 'Hunter-gatherers', 'Factory workers', 'Merchants', 'Kings'], ['Extra food that is stored is a…', 'Surplus', 'Tax', 'Tariff', 'Trade route']]) },
      { t: 'Mesopotamia',
        l: ['Mesopotamia lay between the Tigris and Euphrates rivers.', 'Sumerians invented cuneiform, one of the first writing systems.', "Hammurabi's Code was an early written set of laws."],
        try: 'Write your name in a cuneiform-style code on clay or play dough.',
        q: [['Mesopotamia was between which rivers?', 'Tigris and Euphrates', 'Nile and Congo', 'Amazon and Orinoco', 'Ganges and Indus']] .concat([['Sumerian writing is called…', 'Cuneiform', 'Hieroglyphics', 'Latin', 'Sanskrit'], ['Hammurabi is known for…', 'A written code of laws', 'Building pyramids', 'The Olympic Games', 'The Great Wall']]) },
      { t: 'Ancient Egypt',
        l: ['Egypt grew along the Nile River, which flooded and left rich soil.', 'Pharaohs ruled Egypt and were seen as god-kings.', 'Egyptians built pyramids as tombs and wrote with hieroglyphics.'],
        try: 'Write a message in hieroglyphic-style symbols.',
        q: [['Egyptian civilization depended on the…', 'Nile River', 'Amazon River', 'Tigris River', 'Yellow River']] .concat([['Egyptian rulers were called…', 'Pharaohs', 'Emperors of Rome', 'Senators', 'Shoguns'], ['Pyramids were built as…', 'Tombs', 'Markets', 'Schools', 'Ports']]) },
      { t: 'Ancient Greece',
        l: ['Greece was made of city-states such as Athens and Sparta.', 'Athens developed an early form of democracy.', 'Greek ideas shaped philosophy, theater, math and the Olympic Games.'],
        try: 'Compare Athens and Sparta in a Venn diagram.',
        q: [['Which city-state is known for early democracy?', 'Athens', 'Sparta', 'Rome', 'Carthage']] .concat([['Sparta was known most for its…', 'Military', 'Pyramids', 'Printing press', 'Silk']]).concat([['The Olympic Games began in…', 'Ancient Greece', 'Egypt', 'China', 'Mesopotamia']]) },
      { t: 'Ancient Rome',
        l: ['Rome began as a republic, with elected senators.', 'It later became an empire ruled by emperors, starting with Augustus.', 'Romans built roads, aqueducts and arches, and Latin shaped many languages.'],
        try: 'Find 5 English words that come from Latin.',
        q: [['Before it was an empire, Rome was a…', 'Republic', 'Monarchy only', 'Democracy like Athens', 'Colony']] .concat([['Who was the first Roman emperor?', 'Augustus', 'Julius Caesar', 'Nero', 'Alexander']]).concat([['Romans built aqueducts to carry…', 'Water', 'Soldiers', 'Grain', 'Letters']]) }
    ]
  };

  /* ───────────── GRADE 7 ───────────── */
  C['7-math'] = {
    t: '7th Grade Math', r: [['Khan Academy · 7th grade math', KA + 'math/cc-seventh-grade-math']],
    u: [
      { t: 'Proportional relationships', g: 'unitRate',
        l: ['Two quantities are proportional if their ratio is always the same.', 'y = kx, where k is the constant of proportionality (unit rate).', 'If 3 notebooks cost $7.50, k = 2.50 per notebook.'],
        try: 'Compare unit prices of two sizes of the same cereal.' },
      { t: 'Multiplying and dividing integers', g: 'intMult',
        l: ['Same signs give a positive: (−4) × (−3) = 12.', 'Different signs give a negative: (−4) × 3 = −12.', 'The same rules work for division.'],
        try: 'Make sign-rule flash cards and quiz a family member.' },
      { t: 'Two-step equations', g: 'twoStep',
        l: ['Undo addition or subtraction first, then multiplication or division.', '3x + 5 = 20 → 3x = 15 → x = 5.', 'Check by substituting your answer back in.'],
        try: 'A gym costs $20 plus $5 per visit. How many visits for $55?' },
      { t: 'Circles', g: 'circle',
        l: ['Circumference = 2πr (or πd). Area = πr².', 'Use π ≈ 3.14.', 'The diameter is twice the radius.'],
        try: 'Measure a plate and find its circumference and area.' },
      { t: 'Probability', g: 'probability',
        l: ['Probability = favorable outcomes ÷ total outcomes.', 'Probabilities are between 0 (impossible) and 1 (certain).', 'Rolling a 3 on a die: 1/6.'],
        try: 'Flip a coin 20 times. Compare your results to 1/2.' }
    ]
  };
  C['7-ela'] = {
    t: '7th Grade English', r: [['Khan Academy · 7th grade reading & vocabulary', KA + 'ela/7th-grade-reading-and-vocabulary'], ['Khan Academy · 7th & 8th grade grammar', KA + 'ela/7th-and-8th-grade-grammar']],
    u: [
      { t: 'Theme development', r: [['CommonLit · The Medicine Bag', 'https://www.commonlit.org/texts/the-medicine-bag']],
        l: ['A text can have more than one theme.', 'Themes develop through conflict, character change and symbols.', 'Track how events build toward the theme.'],
        try: 'Read "The Medicine Bag" and explain how the bag symbolizes a theme.',
        q: [['A symbol is…', 'An object that stands for a bigger idea', 'A type of rhyme', 'The setting', 'A chapter title']] .concat([['Themes are often revealed through…', 'Conflict and character change', 'Page numbers', 'Fonts', 'Cover art only'], ['Can a story have more than one theme?', 'Yes', 'No, never', 'Only poems can', 'Only if it is long']]) },
      { t: 'Poetry and form',
        l: ['Poems use lines and stanzas instead of paragraphs.', 'Sound devices: rhyme, rhythm, alliteration (same starting sounds), onomatopoeia (buzz).', 'Form, such as a sonnet or free verse, affects meaning.'],
        try: 'Write a free-verse poem of 3 stanzas about a season.',
        q: [['A group of lines in a poem is a…', 'Stanza', 'Paragraph', 'Chapter', 'Verse book']] .concat([['"Peter Piper picked peppers" shows…', 'Alliteration', 'Onomatopoeia', 'Simile', 'Metaphor'], ['Poetry without a set rhyme or rhythm is…', 'Free verse', 'A sonnet', 'A limerick', 'A haiku']]) },
      { t: 'Evaluating arguments',
        l: ['Judge an argument by whether its reasoning is sound and its evidence is relevant and sufficient.', 'Watch for fallacies: overgeneralizing, attacking the person, bandwagon.', '"Everyone is doing it" is a bandwagon appeal, not evidence.'],
        try: 'Find a TV ad and name the persuasive technique it uses.',
        q: [['"Everyone has this phone, so you should too" is…', 'Bandwagon', 'Statistics', 'Expert opinion', 'Counterclaim']] .concat([['Evidence is sufficient when…', 'There is enough to support the claim', 'It is very long', 'It is funny', 'It is in bold'], ['Attacking a person instead of their argument is a…', 'Fallacy', 'Claim', 'Thesis', 'Citation']]) },
      { t: 'Phrases and clauses',
        l: ['A clause has a subject and a verb. An independent clause can stand alone.', 'A dependent clause cannot stand alone: "because it rained."', 'Combine clauses to make compound and complex sentences.'],
        try: 'Rewrite 3 short sentences as complex sentences.',
        q: [['Which is a dependent clause?', 'because the bus was late', 'The bus was late.', 'I ran.', 'She smiled at me.']] .concat([['A clause must have…', 'A subject and a verb', 'Two adjectives', 'A comma', 'A question mark'], ['"I studied, and I passed" is a…', 'Compound sentence', 'Fragment', 'Simple sentence', 'Run-on']]) },
      { t: 'Research and citing sources', r: [['Purdue OWL', 'https://owl.purdue.edu/owl/index.html']],
        l: ['Paraphrase means restating an idea in your own words. It still needs a citation.', 'Plagiarism is using someone else\'s words or ideas without credit.', 'MLA style is common in English classes.'],
        try: 'Cite one website in MLA format using Purdue OWL as a guide.',
        q: [['Using someone\'s words without credit is…', 'Plagiarism', 'Paraphrasing', 'Summarizing', 'Citing']] .concat([['Does a paraphrase need a citation?', 'Yes', 'No', 'Only if it is long', 'Only in math']]).concat([['A citation style used often in English class is…', 'MLA', 'HTML', 'GPS', 'NASA']]) }
    ]
  };
  C['7-sci'] = {
    t: '7th Grade Life & Physical Science', r: [['Khan Academy · Middle school chemistry', KA + 'science/ms-chemistry'], ['Khan Academy · Middle school biology', KA + 'science/ms-biology']],
    u: [
      { t: 'Atoms and molecules', r: [['Khan Academy · Middle school chemistry', KA + 'science/ms-chemistry']],
        l: ['Atoms are the building blocks of matter. An element is made of one kind of atom.', 'Molecules are atoms bonded together: H₂O is two hydrogen atoms and one oxygen atom.', 'Particles move faster when heated.'],
        try: 'Build H₂O and CO₂ models with marshmallows and toothpicks.',
        q: [['H₂O contains how many hydrogen atoms?', '2', '1', '3', '0']] .concat([['A substance made of only one kind of atom is an…', 'Element', 'Compound', 'Mixture', 'Solution'], ['When a substance is heated, its particles…', 'Move faster', 'Stop moving', 'Get bigger', 'Disappear']]) },
      { t: 'Chemical reactions',
        l: ['In a chemical reaction, atoms rearrange to form new substances.', 'Signs of a reaction: gas bubbles, color change, temperature change, new solid.', 'Mass is conserved: atoms are not created or destroyed.'],
        try: 'Mix baking soda and vinegar in a bag. Weigh before and after (sealed).',
        q: [['Which is a sign of a chemical reaction?', 'Gas bubbles forming', 'Ice melting', 'Paper being cut', 'Water being poured']] .concat([['In a reaction, atoms are…', 'Rearranged', 'Destroyed', 'Created from nothing', 'Turned into energy only'], ['In a sealed bag, the mass after a reaction is…', 'The same as before', 'Larger', 'Smaller', 'Zero']]) },
      { t: 'Photosynthesis and respiration',
        l: ['Photosynthesis: plants use sunlight, water and CO₂ to make sugar and release oxygen.', 'Cellular respiration: cells use sugar and oxygen to release energy, CO₂ and water.', 'The two processes form a cycle between plants and animals.'],
        try: 'Place a leaf in water in sunlight and watch for oxygen bubbles.',
        q: [['Photosynthesis releases…', 'Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium']] .concat([['Where does photosynthesis happen?', 'Chloroplasts', 'Mitochondria', 'Nucleus', 'Cell wall'], ['Cellular respiration releases…', 'Energy', 'Sunlight', 'Chlorophyll', 'Soil']]) },
      { t: 'Genetics',
        l: ['Genes are sections of DNA that carry traits.', 'Offspring get one copy of each gene from each parent.', 'A Punnett square predicts possible offspring. Dominant alleles (B) hide recessive ones (b).'],
        try: 'Make a Punnett square for two Bb parents.',
        q: [['Two Bb parents. What fraction of offspring is expected to be bb?', '1/4', '1/2', '3/4', '0']] .concat([['Genes are made of…', 'DNA', 'Protein shells', 'Sugar', 'Water'], ['An allele that hides another is…', 'Dominant', 'Recessive', 'Mutated', 'Neutral']]) },
      { t: 'Ecosystem interactions',
        l: ['Organisms compete for limited resources like food and space.', 'Symbiosis: mutualism (both benefit), commensalism (one benefits, other unaffected), parasitism (one harmed).', 'Changes to one population ripple through the ecosystem.'],
        try: 'Find an example of each type of symbiosis.',
        q: [['Bees and flowers both benefit. This is…', 'Mutualism', 'Parasitism', 'Commensalism', 'Competition']] .concat([['A tick feeding on a dog is…', 'Parasitism', 'Mutualism', 'Commensalism', 'Predation by the dog'], ['Organisms compete for…', 'Limited resources', 'Unlimited space', 'Sunlight on the Moon', 'Nothing']]) }
    ]
  };
  C['7-soc'] = {
    t: '7th Grade Medieval World', r: [['Khan Academy · World history', KA + 'humanities/world-history']],
    u: [
      { t: 'The rise of Islam',
        l: ['Islam began in the Arabian Peninsula in the 600s CE with the prophet Muhammad.', 'Muslim empires spread across the Middle East, North Africa and Spain.', 'Scholars in Baghdad advanced algebra, astronomy and medicine.'],
        try: 'Find 3 English words that come from Arabic (algebra, sugar, coffee).',
        q: [['Islam began on which peninsula?', 'Arabian', 'Iberian', 'Korean', 'Italian']] .concat([['The word "algebra" comes from…', 'Arabic', 'Latin', 'Chinese', 'Greek'], ['Baghdad was a center of…', 'Learning and science', 'Ice skating', 'Gold mining only', 'Viking raids']]) },
      { t: 'Medieval Europe',
        l: ['After Rome fell (476 CE), Europe split into kingdoms.', 'Feudalism: kings gave land to lords; lords protected peasants who worked the land.', 'The Catholic Church was the most powerful institution.'],
        try: 'Draw the feudal pyramid and label each level.',
        q: [['In feudalism, peasants who worked the land were called…', 'Serfs', 'Knights', 'Monks', 'Kings']] .concat([['The most powerful institution in medieval Europe was the…', 'Catholic Church', 'Parliament', 'Stock market', 'United Nations'], ['The Western Roman Empire fell in…', '476 CE', '1492', '1066', '1776']]) },
      { t: 'Imperial China',
        l: ['The Tang and Song dynasties were golden ages for China.', 'Chinese inventions include paper, the compass, printing and gunpowder.', 'The Silk Road linked China to the Middle East and Europe.'],
        try: 'Trace the Silk Road and list goods traded each direction.',
        q: [['Which was a Chinese invention?', 'The compass', 'The steam engine', 'The telephone', 'The airplane']] .concat([['The Silk Road was a…', 'Trade route', 'River', 'Wall', 'Mountain'], ['Tang and Song were…', 'Chinese dynasties', 'Roman emperors', 'Mayan cities', 'Greek gods']]) },
      { t: 'West African empires',
        l: ['Ghana, Mali and Songhai grew rich from the gold-salt trade.', 'Mansa Musa of Mali was one of the wealthiest people in history.', 'Timbuktu became a center of trade and Islamic learning.'],
        try: 'Map the trans-Saharan trade routes.',
        q: [['Mali grew rich from trading gold and…', 'Salt', 'Silk', 'Oil', 'Tea']] .concat([['Which ruler of Mali was famous for his wealth?', 'Mansa Musa', 'Charlemagne', 'Genghis Khan', 'Augustus'], ['Timbuktu was a center of…', 'Trade and learning', 'Shipbuilding', 'Coal mining', 'Car factories']]) },
      { t: 'Renaissance and Reformation', r: [['Khan Academy · World history', KA + 'humanities/world-history']],
        l: ['The Renaissance (1300s–1600s) was a rebirth of art and learning, starting in Italy.', 'Gutenberg\'s printing press spread ideas quickly.', 'Martin Luther\'s 95 Theses (1517) began the Protestant Reformation.'],
        try: 'Look up a painting by Leonardo da Vinci and describe its use of perspective.',
        q: [['The Renaissance began in…', 'Italy', 'England', 'China', 'Mali']] .concat([['Who invented the movable-type printing press in Europe?', 'Gutenberg', 'Luther', 'Da Vinci', 'Galileo'], ['Martin Luther\'s 95 Theses started the…', 'Reformation', 'Renaissance', 'Crusades', 'Industrial Revolution']]) }
    ]
  };

  /* ───────────── GRADE 8 ───────────── */
  C['8-math'] = {
    t: '8th Grade Math', r: [['Khan Academy · 8th grade math', KA + 'math/cc-eighth-grade-math']],
    u: [
      { t: 'Multi-step linear equations', g: 'multiStep',
        l: ['Distribute, combine like terms, then get the variable alone.', '2(x + 3) = 4x − 6 → 2x + 6 = 4x − 6 → 12 = 2x → x = 6.', 'Some equations have no solution or infinitely many.'],
        try: 'Solve 5x − 3 = 2x + 9 and check your answer.' },
      { t: 'Slope', g: 'slope',
        l: ['Slope = rise ÷ run = (y₂ − y₁) ÷ (x₂ − x₁).', 'Positive slopes go up to the right; negative slopes go down.', 'In y = mx + b, m is the slope and b is the y-intercept.'],
        try: 'Find the slope of a staircase: height of a step ÷ depth of a step.' },
      { t: 'The Pythagorean theorem', g: 'pythag',
        l: ['In a right triangle, a² + b² = c², where c is the hypotenuse.', '3-4-5 and 5-12-13 are common right triangles.', 'Use it to find distance between two points.'],
        try: 'Measure a TV\'s width and height and check its diagonal.' },
      { t: 'Exponents and scientific notation', g: 'expSci',
        l: ['Multiply same bases: add exponents (2³ × 2⁴ = 2⁷).', 'Any nonzero number to the 0 power is 1.', 'Scientific notation: 45,000 = 4.5 × 10⁴.'],
        try: 'Write the distance to the Sun (about 93,000,000 miles) in scientific notation.' },
      { t: 'Systems of equations', g: 'system',
        l: ['A system is two equations with the same variables.', 'The solution is where the lines cross.', 'Solve by substitution or elimination.'],
        try: 'Two phone plans: $20 + $5/GB and $40 flat. When do they cost the same?' }
    ]
  };
  C['8-ela'] = {
    t: '8th Grade English', r: [['Khan Academy · 8th grade reading & vocabulary', KA + 'ela/8th-grade-reading-and-vocabulary'], ['CommonLit text library', 'https://www.commonlit.org/texts']],
    u: [
      { t: 'Irony and suspense', r: [["CommonLit · The Monkey's Paw", 'https://www.commonlit.org/texts/the-monkey-s-paw']],
        l: ['Dramatic irony: the reader knows something a character does not.', 'Situational irony: the opposite of what is expected happens.', 'Authors build suspense with foreshadowing and pacing.'],
        try: 'Read "The Monkey\'s Paw" and mark three moments of foreshadowing.',
        q: [['When the reader knows something a character does not, it is…', 'Dramatic irony', 'Situational irony', 'Verbal irony', 'Alliteration']] .concat([['Hints about what will happen later are…', 'Foreshadowing', 'Flashbacks', 'Dialogue', 'Settings'], ['A fire station burning down is an example of…', 'Situational irony', 'Simile', 'Dramatic irony', 'Rhyme']]) },
      { t: 'Analyzing argument and rhetoric',
        l: ['Authors persuade with ethos (credibility), pathos (emotion) and logos (logic).', 'Strong writers acknowledge and respond to counterclaims.', 'Evaluate whether evidence actually supports the claim.'],
        try: 'Find one example each of ethos, pathos and logos in a speech.',
        q: [['An appeal to emotion is…', 'Pathos', 'Ethos', 'Logos', 'Kairos']] .concat([['"As a doctor for 20 years, I recommend…" uses…', 'Ethos', 'Pathos', 'Logos', 'Irony'], ['Using statistics and reasoning is…', 'Logos', 'Pathos', 'Ethos', 'Bandwagon']]) },
      { t: 'Verb voice and mood',
        l: ['Active voice: the subject does the action ("The dog chased the ball").', 'Passive voice: the subject receives the action ("The ball was chased").', 'Mood: indicative (states fact), imperative (command), conditional (would), subjunctive ("If I were you").'],
        try: 'Change 5 passive sentences to active voice.',
        q: [['Which sentence is in active voice?', 'Mia wrote the report.', 'The report was written by Mia.', 'The report was written.', 'It was written by someone.']] .concat([['"Close the door" is in the…', 'Imperative mood', 'Indicative mood', 'Subjunctive mood', 'Conditional mood'], ['"If I were taller, I would play basketball" uses the…', 'Subjunctive mood', 'Imperative mood', 'Passive voice', 'Future tense']]) },
      { t: 'Informational writing',
        l: ['Introduce the topic clearly and preview what will follow.', 'Organize with headings, transitions and precise vocabulary.', 'Conclude by summing up the significance.'],
        try: 'Write a 4-paragraph explanation of how something works.',
        q: [['Words like "furthermore" and "however" are…', 'Transitions', 'Nouns', 'Prepositions only', 'Interjections']] .concat([['Informational writing should use…', 'Precise vocabulary', 'Slang throughout', 'Only opinions', 'No organization'], ['A conclusion should…', 'Sum up the significance', 'Introduce a new topic', 'Repeat the title only', 'Be left out']]) },
      { t: 'Connotation and word choice',
        l: ['Word choice sets tone: "slender" sounds positive, "skinny" more negative.', 'Analogies compare relationships: hot is to cold as up is to down.', 'Choose words that fit your audience and purpose.'],
        try: 'Rewrite a paragraph twice: once with a cheerful tone and once with a gloomy tone.',
        q: [['Which word has a negative connotation?', 'Nosy', 'Curious', 'Interested', 'Inquisitive']] .concat([['Hot is to cold as up is to…', 'Down', 'Warm', 'Sky', 'High'], ['The author\'s attitude toward a subject is the…', 'Tone', 'Plot', 'Setting', 'Theme']]) }
    ]
  };
  C['8-sci'] = {
    t: '8th Grade Physical & Earth Science', r: [['Khan Academy · Middle school physics', KA + 'science/ms-physics'], ['PhET simulations', 'https://phet.colorado.edu/']],
    u: [
      { t: "Newton's laws of motion", r: [['Khan Academy · Middle school physics', KA + 'science/ms-physics']],
        l: ["1st law: an object keeps doing what it's doing unless an unbalanced force acts (inertia).", '2nd law: force = mass × acceleration.', '3rd law: every action has an equal and opposite reaction.'],
        try: 'Launch a balloon rocket on a string. Which law explains it?',
        q: [['F = m × a is Newton\'s…', 'Second law', 'First law', 'Third law', 'Law of gravity']] .concat([['A rocket pushes gas down and moves up. This shows Newton\'s…', 'Third law', 'First law', 'Second law', 'Zeroth law'], ['The tendency to keep moving is called…', 'Inertia', 'Friction', 'Momentum only', 'Weight']]) },
      { t: 'Waves and electromagnetic radiation',
        l: ['Electromagnetic waves can travel through empty space.', 'From long to short wavelength: radio, microwave, infrared, visible light, ultraviolet, X-rays, gamma rays.', 'Higher frequency means more energy.'],
        try: 'Sort household devices by which EM waves they use.',
        q: [['Which EM wave has the most energy?', 'Gamma rays', 'Radio waves', 'Microwaves', 'Infrared']] .concat([['Which can travel through empty space?', 'Light', 'Sound', 'Ocean waves', 'None']]).concat([['Higher frequency waves have…', 'More energy', 'Less energy', 'No energy', 'Longer wavelengths']]) },
      { t: "Earth's history", r: [['Khan Academy · Middle school Earth & space', KA + 'science/middle-school-earth-and-space-science']],
        l: ['Earth is about 4.6 billion years old.', 'In undisturbed rock layers, the oldest layers are at the bottom (superposition).', 'The geologic time scale divides Earth\'s history into eras and periods.'],
        try: 'Make a toilet-paper timeline of Earth\'s history.',
        q: [['About how old is Earth?', '4.6 billion years', '6,000 years', '1 million years', '100 billion years']] .concat([['In undisturbed rock layers, the oldest layer is…', 'At the bottom', 'At the top', 'In the middle', 'Impossible to tell'], ['Dinosaurs lived in the…', 'Mesozoic Era', 'Cenozoic Era', 'Paleozoic only', 'Precambrian']]) },
      { t: 'Space: gravity and seasons', r: [['NASA Space Place', 'https://spaceplace.nasa.gov/']],
        l: ["Seasons happen because Earth's axis is tilted about 23.5°, not because of distance from the Sun.", 'Gravity depends on mass and distance.', 'The Moon\'s gravity causes ocean tides.'],
        try: 'Use a lamp and a tilted ball to model the seasons.',
        q: [['Seasons are caused by…', "Earth's tilted axis", 'Distance from the Sun', 'The Moon', 'Clouds']] .concat([['What causes ocean tides?', "The Moon's gravity", 'Wind only', 'Earthquakes', 'Fish']]).concat([['Gravity is stronger between objects that are…', 'More massive and closer', 'Smaller and farther', 'Colder', 'Brighter']]) },
      { t: 'Natural selection',
        l: ['Individuals vary. Some traits help survival in an environment.', 'Organisms with helpful traits survive and reproduce more, passing those traits on.', 'Over many generations, populations change. This is evolution by natural selection.'],
        try: 'Play a "bird and beak" game with different tools picking up seeds.',
        q: [['Natural selection acts on…', 'Variation among individuals', 'Rocks', 'Weather only', 'Nothing']] .concat([['Who proposed natural selection?', 'Charles Darwin', 'Isaac Newton', 'Albert Einstein', 'Marie Curie'], ['Helpful traits become more common because organisms with them…', 'Survive and reproduce more', 'Choose to change', 'Live alone', 'Stop eating']]) }
    ]
  };
  C['8-soc'] = {
    t: '8th Grade U.S. History', r: [['Khan Academy · U.S. history', KA + 'humanities/us-history'], ['iCivics student games', 'https://ed.icivics.org/students']],
    u: [
      { t: 'Founding the nation',
        l: ['The Articles of Confederation (1781) created a weak national government.', 'The Constitutional Convention (1787) wrote a new plan with a stronger government.', 'The Great Compromise created a Senate (equal votes) and House (by population).'],
        try: 'Debate: should big and small states have equal votes?',
        q: [['The Great Compromise created…', 'A two-house Congress', 'The Supreme Court', 'The Electoral College only', 'The Bill of Rights']] .concat([['The first plan of U.S. government was the…', 'Articles of Confederation', 'Constitution', 'Magna Carta', 'Mayflower Compact'], ['In the Senate, each state gets…', '2 senators', 'Votes by population', '1 senator', '10 senators']]) },
      { t: 'The Bill of Rights', r: [['iCivics · Do I Have a Right?', 'https://ed.icivics.org/resources/game/42/do-i-have-a-right']],
        l: ['The first 10 amendments are the Bill of Rights (1791).', 'The 1st Amendment protects speech, religion, press, assembly and petition.', 'Other rights include a fair trial and protection from unreasonable searches.'],
        try: 'Play "Do I Have a Right?" on iCivics.',
        q: [['Freedom of speech is in which amendment?', '1st', '2nd', '5th', '10th']] .concat([['How many amendments are in the Bill of Rights?', '10', '27', '5', '13'], ['Protection from unreasonable searches is in the…', '4th Amendment', '1st Amendment', '19th Amendment', '13th Amendment']]) },
      { t: 'The early republic',
        l: ['George Washington was the first president (1789–1797).', 'The War of 1812 was fought against Britain.', 'The Monroe Doctrine (1823) warned Europe against new colonies in the Americas.'],
        try: 'Write a short biography of one early president.',
        q: [['Who was the first U.S. president?', 'George Washington', 'John Adams', 'Thomas Jefferson', 'James Madison']] .concat([['The War of 1812 was fought against…', 'Britain', 'France', 'Mexico', 'Spain']]).concat([['The Monroe Doctrine warned Europe against…', 'New colonies in the Americas', 'Trade with the U.S.', 'Building railroads', 'Voting']]) },
      { t: 'Civil War and Reconstruction',
        l: ['Southern states seceded after Lincoln\'s election in 1860.', 'Reconstruction (1865–1877) rebuilt the South and passed the 13th, 14th and 15th Amendments.', 'Those amendments ended slavery, granted citizenship and protected Black men\'s right to vote.'],
        try: 'Make a chart of the 13th, 14th and 15th Amendments.',
        q: [['The 14th Amendment granted…', 'Citizenship and equal protection', 'Women\'s suffrage', 'Prohibition', 'Income tax']] .concat([['Reconstruction followed the…', 'Civil War', 'Revolution', 'War of 1812', 'World War I'], ['The 15th Amendment protected…', 'The right to vote regardless of race', 'Free speech', 'The right to bear arms', 'Term limits']]) },
      { t: 'Industrialization',
        l: ['After the Civil War, factories, railroads and cities grew quickly.', 'Immigrants came to work in factories, often in harsh conditions.', 'Workers formed labor unions to fight for better pay and safer jobs.'],
        try: 'Compare a factory job in 1890 with a job today.',
        q: [['Workers organized into ___ to win better conditions.', 'Labor unions', 'Monopolies', 'Colonies', 'City-states']] .concat([['The transcontinental railroad was completed in…', '1869', '1776', '1920', '1945']]).concat([['A major source of factory workers was…', 'Immigrants', 'Robots', 'Kings', 'Knights']]) }
    ]
  };
})();
