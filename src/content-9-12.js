/* Lantern Homeschool — curriculum content, grades 9–12 (high school; each course = 1.0 credit).
   Quiz rows: [question, correct, wrong1, wrong2, wrong3] */
(function () {
  const KA = 'https://www.khanacademy.org/';
  const OS = 'https://openstax.org/details/books/';
  const C = (window.LH_COURSES = window.LH_COURSES || {});

  /* ───────────── GRADE 9 ───────────── */
  C['9-math'] = {
    t: 'Algebra 1', credit: 1, r: [['Khan Academy · Algebra 1', KA + 'math/algebra']],
    u: [
      { t: 'Solving linear equations', g: 'multiStep',
        l: ['Use inverse operations to isolate the variable, doing the same thing to both sides.', 'Distribute and combine like terms first.', 'Check by substituting your answer into the original equation.'],
        try: 'Write and solve an equation for a real cost: a $35 bill split with a $5 tip.' },
      { t: 'Linear functions and slope-intercept form', g: 'evalLinear',
        l: ['y = mx + b: m is the slope (rate of change), b is the y-intercept (starting value).', 'A function gives exactly one output for each input.', 'Evaluate by substituting: if y = 3x − 2 and x = 4, y = 10.'],
        try: 'Model a taxi fare: $3 base + $2 per mile.' },
      { t: 'Systems of equations', g: 'system',
        l: ['Substitution: solve one equation for a variable and plug into the other.', 'Elimination: add or subtract equations to cancel a variable.', 'One solution, no solution (parallel lines) or infinitely many (same line).'],
        try: 'Tickets: adults $10, kids $6. 20 tickets sold for $160. How many of each?' },
      { t: 'Exponent rules', g: 'expRules',
        l: ['aᵐ · aⁿ = aᵐ⁺ⁿ   ·   aᵐ ÷ aⁿ = aᵐ⁻ⁿ   ·   (aᵐ)ⁿ = aᵐⁿ', 'a⁰ = 1 and a⁻ⁿ = 1/aⁿ.', 'Exponential growth multiplies by the same factor each step.'],
        try: 'A video gets 3 times as many views each day, starting at 10. Find day 5.' },
      { t: 'Factoring quadratics', g: 'factorQuad',
        l: ['To factor x² + bx + c, find two numbers that multiply to c and add to b.', 'x² + 5x + 6 = (x + 2)(x + 3).', 'Zero product property: if (x + 2)(x + 3) = 0, then x = −2 or x = −3.'],
        try: 'Factor x² − x − 12 and find its solutions.' }
    ]
  };
  C['9-ela'] = {
    t: 'English 9: Literature & Composition', credit: 1, r: [['Khan Academy · 9th grade reading & vocabulary', KA + 'ela/9th-grade-reading-and-vocabulary'], ['Purdue OWL', 'https://owl.purdue.edu/owl/index.html']],
    u: [
      { t: "The hero's journey", r: [["CommonLit · The Hero's Journey", 'https://www.commonlit.org/texts/the-hero-s-journey']],
        l: ['Many stories follow a pattern: the call to adventure, trials, a crisis, and the return home changed.', 'Mentors, thresholds and transformation are key stages.', 'Recognizing the pattern helps you predict and analyze stories.'],
        try: 'Map a favorite movie onto the hero\'s journey stages.',
        q: [['In the hero\'s journey, the hero usually returns…', 'Changed by the experience', 'Exactly the same', 'Never', 'As the villain']] .concat([['A wise guide in a hero\'s journey is the…', 'Mentor', 'Antagonist', 'Narrator', 'Foil']]).concat([['The first stage of the hero\'s journey is usually the…', 'Call to adventure', 'Return home', 'Final battle', 'Reward']]) },
      { t: 'Short story analysis', r: [["Project Gutenberg · Children's & classic literature", 'https://www.gutenberg.org/ebooks/bookshelf/20']],
        l: ['Plot structure: exposition, rising action, climax, falling action, resolution.', 'Conflict can be internal (character vs. self) or external (vs. person, nature, society).', 'Analyze how setting and point of view shape meaning.'],
        try: 'Read "The Legend of Sleepy Hollow" on Project Gutenberg and diagram its plot.',
        q: [['The turning point of a story is the…', 'Climax', 'Exposition', 'Resolution', 'Rising action']] .concat([['A character struggling with fear is an example of…', 'Internal conflict', 'External conflict', 'Setting', 'Exposition'], ['Background information at the start of a story is the…', 'Exposition', 'Climax', 'Falling action', 'Epilogue']]) },
      { t: 'The argumentative essay', r: [['Purdue OWL · General writing', 'https://owl.purdue.edu/owl/general_writing/index.html']],
        l: ['A thesis states a debatable claim in one or two sentences.', 'Each body paragraph: claim, evidence, analysis (explain how evidence supports the claim).', 'Address a counterargument and rebut it.'],
        try: 'Write a thesis and outline for: "Should the school year be longer?"',
        q: [['A thesis statement should be…', 'A debatable claim', 'A fact everyone agrees on', 'A question', 'A quote with no comment']] .concat([['After presenting evidence, a writer should…', 'Analyze how it supports the claim', 'Move on immediately', 'Repeat the evidence', 'Change topics'], ['Responding to the opposing view is a…', 'Rebuttal', 'Hook', 'Thesis', 'Citation']]) },
      { t: 'Semicolons, colons and dashes', r: [['Purdue OWL · Punctuation', 'https://owl.purdue.edu/owl/general_writing/punctuation/index.html']],
        l: ['A semicolon joins two closely related independent clauses: "I studied; I passed."', 'A colon introduces a list or explanation after a complete sentence.', 'Avoid comma splices: two independent clauses joined only by a comma.'],
        try: 'Fix 5 comma splices from your own writing.',
        q: [['Which uses a semicolon correctly?', 'It rained; the game was canceled.', 'It rained; and the game was canceled.', 'Because it rained; the game was canceled.', 'It; rained the game was canceled.']] .concat([['"I was tired, I went to bed." This is a…', 'Comma splice', 'Fragment', 'Correct sentence', 'Compound subject'], ['A colon is often used to introduce…', 'A list', 'A question', 'A new paragraph', 'A title']]) },
      { t: 'Rhetorical appeals',
        l: ['Ethos builds trust, pathos stirs emotion, logos uses logic and evidence.', 'Rhetorical devices: repetition, rhetorical questions, parallelism.', 'Effective speakers balance all three appeals for their audience.'],
        try: 'Analyze the appeals in a famous speech.',
        q: [['Repeating a phrase at the start of sentences is…', 'Anaphora', 'Hyperbole', 'Irony', 'Allusion']] .concat([['An exaggeration for effect is…', 'Hyperbole', 'Understatement', 'Logos', 'Ethos'], ['A question asked for effect, not an answer, is…', 'A rhetorical question', 'An interview', 'A thesis', 'A citation']]) }
    ]
  };
  C['9-sci'] = {
    t: 'Biology', credit: 1, r: [['OpenStax · Biology 2e (free textbook)', OS + 'biology-2e'], ['Khan Academy · High school biology', KA + 'science/hs-bio']],
    u: [
      { t: 'Chemistry of life',
        l: ['Living things are built from four macromolecules: carbohydrates, lipids, proteins and nucleic acids.', 'Enzymes are proteins that speed up reactions.', 'Water\'s polarity makes it an excellent solvent.'],
        try: 'Test foods for starch using iodine (with an adult).',
        q: [['Enzymes are a type of…', 'Protein', 'Lipid', 'Carbohydrate', 'Mineral']] .concat([['DNA is a…', 'Nucleic acid', 'Lipid', 'Carbohydrate', 'Protein'], ['Fats and oils are…', 'Lipids', 'Proteins', 'Nucleic acids', 'Enzymes']]) },
      { t: 'Cell structure and transport',
        l: ['Prokaryotic cells (bacteria) have no nucleus. Eukaryotic cells do.', 'Diffusion moves molecules from high to low concentration. Osmosis is diffusion of water.', 'Active transport uses energy (ATP) to move molecules against the gradient.'],
        try: 'Soak a gummy bear in water and one in salt water overnight. Explain the results.',
        q: [['Which cells lack a nucleus?', 'Prokaryotic', 'Eukaryotic', 'Plant', 'Animal']] .concat([['Diffusion of water across a membrane is…', 'Osmosis', 'Active transport', 'Mitosis', 'Translation'], ['Active transport requires…', 'Energy (ATP)', 'No energy', 'Sunlight only', 'A nucleus']]) },
      { t: 'DNA, genes and heredity',
        l: ['DNA is a double helix with base pairs A–T and C–G.', 'Transcription makes mRNA from DNA; translation builds proteins at ribosomes.', 'Mendel showed traits pass in predictable ratios.'],
        try: 'Write the complementary strand for ATGCCGTA.',
        q: [['In DNA, adenine pairs with…', 'Thymine', 'Cytosine', 'Guanine', 'Uracil']] .concat([['Proteins are built at the…', 'Ribosome', 'Nucleus', 'Cell wall', 'Vacuole'], ['Making mRNA from DNA is called…', 'Transcription', 'Translation', 'Replication', 'Mutation']]) },
      { t: 'Evolution',
        l: ['Evidence for evolution: fossils, comparative anatomy, DNA similarities, observed changes.', 'Natural selection, genetic drift and mutation change populations.', 'Homologous structures (human arm, whale flipper) suggest common ancestry.'],
        try: 'Compare the bones of a human arm, a bat wing and a whale flipper.',
        q: [['Similar bone structures in different species are…', 'Homologous structures', 'Vestigial organs only', 'Analogous structures', 'Fossils']] .concat([['A random change in DNA is a…', 'Mutation', 'Adaptation', 'Trait', 'Species']]).concat([['Which provides evidence for evolution?', 'DNA comparisons', 'Weather records', 'Star charts', 'Tide tables']]) },
      { t: 'Ecology',
        l: ['Energy flows through trophic levels; only about 10% passes to the next level.', 'Matter cycles: carbon, nitrogen, water.', 'Carrying capacity is the largest population an environment can support.'],
        try: 'Build an energy pyramid for a local ecosystem.',
        q: [['About what percent of energy passes to the next trophic level?', '10%', '50%', '90%', '100%']] .concat([['The largest population an environment can support is its…', 'Carrying capacity', 'Biomass', 'Niche', 'Range'], ['Which element cycles through photosynthesis and respiration?', 'Carbon', 'Gold', 'Neon', 'Iron']]) }
    ]
  };
  C['9-soc'] = {
    t: 'World History', credit: 1, r: [['Khan Academy · World history', KA + 'humanities/world-history']],
    u: [
      { t: 'Classical civilizations',
        l: ['Classical empires include Han China, the Maurya and Gupta in India, Persia, Greece and Rome.', 'They built roads, legal systems and bureaucracies.', 'Trade networks like the Silk Road spread goods, ideas and diseases.'],
        try: 'Compare Han China and Rome in a chart: government, trade, decline.',
        q: [['Which empire ruled China at the same time as Rome?', 'Han', 'Ming', 'Qing', 'Tang']] .concat([['The Silk Road spread goods and…', 'Ideas and diseases', 'Only gold', 'Only soldiers', 'Nothing else']]).concat([['The Gupta Empire was in…', 'India', 'Egypt', 'Mexico', 'Spain']]) },
      { t: 'World religions',
        l: ['Major world religions include Hinduism, Buddhism, Judaism, Christianity and Islam.', 'Judaism, Christianity and Islam are monotheistic and trace roots to Abraham.', 'Religions shaped laws, art and daily life across regions.'],
        try: 'Make a chart: origin place, founder or key figure, sacred text.',
        q: [['Belief in one God is…', 'Monotheism', 'Polytheism', 'Atheism', 'Animism']] .concat([['Buddhism began in…', 'South Asia', 'Western Europe', 'South America', 'Australia'], ['The Quran is the sacred text of…', 'Islam', 'Hinduism', 'Buddhism', 'Judaism']]) },
      { t: 'Global exchange and empires',
        l: ['The Columbian Exchange moved crops, animals and diseases between the Americas and Afro-Eurasia.', 'Disease devastated Native American populations.', 'The Atlantic slave trade forcibly moved millions of Africans to the Americas.'],
        try: 'List 5 foods that crossed the Atlantic in each direction.',
        q: [['Which crop came from the Americas to Europe?', 'Potato', 'Wheat', 'Rice', 'Sugarcane']] .concat([['The biggest cause of Native population decline after 1492 was…', 'Disease', 'Famine in Europe', 'Volcanoes', 'Earthquakes'], ['The Columbian Exchange connected…', 'The Americas and Afro-Eurasia', 'China and Japan only', 'Arctic and Antarctic', 'Mars and Earth']]) },
      { t: 'The age of revolutions',
        l: ['Enlightenment thinkers (Locke, Montesquieu) promoted natural rights and separation of powers.', 'Revolutions: American (1776), French (1789), Haitian (1791), Latin American (1810s–1820s).', 'The Industrial Revolution began in Britain with steam power and factories.'],
        try: 'Compare the causes of the American and French revolutions.',
        q: [['Who argued for natural rights to life, liberty and property?', 'John Locke', 'Napoleon', 'Louis XVI', 'Karl Marx']] .concat([['The Industrial Revolution began in…', 'Britain', 'China', 'Brazil', 'Russia'], ['The Haitian Revolution created the first independent nation led by…', 'Formerly enslaved people', 'French nobles', 'British merchants', 'Spanish priests']]) },
      { t: 'The world wars and the 20th century',
        l: ['World War I (1914–1918) was sparked by an assassination and fueled by alliances and nationalism.', 'World War II (1939–1945) included the Holocaust, the genocide of six million Jews.', 'The Cold War (1947–1991) divided the world between the U.S. and the Soviet Union.'],
        try: 'Make a timeline of the 20th century with 10 key events.',
        q: [['World War II ended in…', '1945', '1918', '1939', '1991']] .concat([['The Cold War was mainly between the U.S. and the…', 'Soviet Union', 'United Kingdom', 'France', 'Mexico'], ['The Holocaust was the genocide of about how many Jews?', 'Six million', 'Sixty thousand', 'Six hundred', 'Sixty million']]) }
    ]
  };

  /* ───────────── GRADE 10 ───────────── */
  C['10-math'] = {
    t: 'Geometry', credit: 1, r: [['Khan Academy · High school geometry', KA + 'math/geometry']],
    u: [
      { t: 'Angles and triangles', g: 'triAngle',
        l: ['Triangle angles add to 180°.', 'Vertical angles are equal; supplementary angles add to 180°.', 'An exterior angle equals the sum of the two remote interior angles.'],
        try: 'Cut out a paper triangle, tear off the corners and line them up.' },
      { t: 'Distance and the Pythagorean theorem', g: 'distance',
        l: ['Distance between (x₁, y₁) and (x₂, y₂) = √((x₂−x₁)² + (y₂−y₁)²).', 'This is the Pythagorean theorem on a coordinate grid.', 'Midpoint = ((x₁+x₂)/2, (y₁+y₂)/2).'],
        try: 'Plot two cities on a grid map and find the straight-line distance.' },
      { t: 'Similar triangles', g: 'similar',
        l: ['Similar figures have equal angles and proportional sides.', 'Set up a proportion to find a missing side.', 'Shadows can measure tall objects using similar triangles.'],
        try: 'Find the height of a tree using its shadow and your own.' },
      { t: 'Circles', g: 'circle',
        l: ['Circumference = 2πr; area = πr².', 'A central angle and its arc have the same measure.', 'Arc length = (angle ÷ 360) × 2πr.'],
        try: 'Find the length of crust on one slice of a 12-inch pizza cut into 8 slices.' },
      { t: 'Right-triangle trigonometry', g: 'trig',
        l: ['SOH CAH TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.', 'In a 3-4-5 triangle, sin of the angle opposite 3 is 3/5.', 'Trig finds heights and distances you cannot measure directly.'],
        try: 'Use a phone clinometer app or protractor to estimate a building\'s height.' }
    ]
  };
  C['10-ela'] = {
    t: 'English 10: World Literature', credit: 1, r: [['CommonLit text library', 'https://www.commonlit.org/texts'], ['Purdue OWL · MLA style', 'https://owl.purdue.edu/owl/research_and_citation/mla_style/index.html']],
    u: [
      { t: 'Philosophy in literature', r: [['CommonLit · Allegory of the Cave', 'https://www.commonlit.org/texts/allegory-of-the-cave']],
        l: ['An allegory is a story where characters and events stand for bigger ideas.', "Plato's cave: prisoners see only shadows and mistake them for reality.", 'Ask what each element represents.'],
        try: 'Read "Allegory of the Cave" and write what the shadows, cave and sun represent.',
        q: [['A story whose parts symbolize bigger ideas is an…', 'Allegory', 'Autobiography', 'Almanac', 'Anecdote']] .concat([["In Plato's cave, the shadows represent…", 'A false or limited view of reality', 'True knowledge', 'The Sun', 'Friendship'], ['Who wrote "Allegory of the Cave"?', 'Plato', 'Homer', 'Shakespeare', 'Aesop']]) },
      { t: 'Tone and mood',
        l: ['Tone is the author\'s attitude. Mood is how the reader feels.', 'Diction (word choice), imagery and syntax create tone and mood.', 'Name tone with precise words: wry, somber, reverent, sardonic.'],
        try: 'Rewrite a cheerful scene with a menacing mood.',
        q: [['The feeling a text creates in the reader is…', 'Mood', 'Tone', 'Theme', 'Plot']] .concat([['An author\'s attitude toward the subject is…', 'Tone', 'Mood', 'Setting', 'Structure'], ['Word choice is also called…', 'Diction', 'Syntax', 'Meter', 'Rhyme']]) },
      { t: 'The research paper', r: [['Purdue OWL · MLA style', 'https://owl.purdue.edu/owl/research_and_citation/mla_style/index.html']],
        l: ['Narrow a topic into a focused research question.', 'Evaluate sources for authority, accuracy, purpose and date.', 'Use in-text citations and a Works Cited page (MLA).'],
        try: 'Create a Works Cited page with 3 sources on one topic.',
        q: [['In MLA, the list of sources is called…', 'Works Cited', 'Bibliography of Doom', 'Index', 'Glossary']] .concat([['A strong research question is…', 'Focused and arguable', 'Very broad', 'Answered with yes or no', 'About everything'], ['Which is NOT a test of source quality?', 'How colorful it is', 'Author authority', 'Accuracy', 'Date published']]) },
      { t: 'Poetry analysis',
        l: ['Read a poem twice: once for meaning, once for craft.', 'Look at imagery, figurative language, sound, line breaks and shifts.', 'Meter is the pattern of stressed and unstressed syllables; iambic pentameter has five iambs per line.'],
        try: 'Annotate one poem for imagery and a shift in tone.',
        q: [['Iambic pentameter has how many iambs per line?', '5', '3', '4', '10']] .concat([['Language that appeals to the senses is…', 'Imagery', 'Meter', 'Syntax', 'Allusion'], ['A change in tone or topic in a poem is a…', 'Shift', 'Stanza', 'Refrain', 'Couplet']]) },
      { t: 'Persuasive speaking',
        l: ['Know your audience and purpose.', 'Open with a hook, state your position, give reasons and evidence, end with a call to action.', 'Delivery: eye contact, pacing, pauses and vocal variety.'],
        try: 'Give a 2-minute speech to family on a cause you care about.',
        q: [['A strong speech often ends with a…', 'Call to action', 'New topic', 'Apology', 'Silence only']] .concat([['An opening that grabs attention is a…', 'Hook', 'Thesis', 'Rebuttal', 'Citation']]).concat([['Which improves delivery?', 'Eye contact', 'Reading with your back turned', 'Speaking as fast as possible', 'Mumbling']]) }
    ]
  };
  C['10-sci'] = {
    t: 'Chemistry', credit: 1, r: [['OpenStax · Chemistry 2e (free textbook)', OS + 'chemistry-2e'], ['Khan Academy · High school chemistry', KA + 'science/hs-chemistry']],
    u: [
      { t: 'Atomic structure',
        l: ['Atoms contain protons (+), neutrons (0) and electrons (−).', 'The atomic number is the number of protons.', 'Isotopes have the same protons but different neutrons.'],
        try: 'Draw Bohr models for hydrogen, carbon and oxygen.',
        q: [['The atomic number equals the number of…', 'Protons', 'Neutrons', 'Electrons in the outer shell', 'Isotopes']] .concat([['Atoms of the same element with different numbers of neutrons are…', 'Isotopes', 'Ions', 'Molecules', 'Compounds'], ['Which particle has a negative charge?', 'Electron', 'Proton', 'Neutron', 'Nucleus']]) },
      { t: 'The periodic table',
        l: ['Elements are arranged by atomic number.', 'Columns (groups) share properties because they have the same number of valence electrons.', 'Metals are on the left, nonmetals on the right, noble gases in the last column.'],
        try: 'Color-code a periodic table by metals, nonmetals and metalloids.',
        q: [['Elements in the same column have the same number of…', 'Valence electrons', 'Neutrons', 'Protons', 'Isotopes']] .concat([['Which group is very unreactive?', 'Noble gases', 'Alkali metals', 'Halogens', 'Transition metals'], ['The periodic table is ordered by…', 'Atomic number', 'Color', 'Discovery date', 'Alphabet']]) },
      { t: 'Chemical bonding',
        l: ['Ionic bonds form when electrons transfer (metal + nonmetal, like NaCl).', 'Covalent bonds form when atoms share electrons (H₂O).', 'Bond type affects melting point, conductivity and solubility.'],
        try: 'Compare how salt and sugar dissolve and whether the solutions conduct electricity (kit or simulation).',
        q: [['Table salt (NaCl) has what kind of bond?', 'Ionic', 'Covalent', 'Metallic', 'Hydrogen']] .concat([['Atoms sharing electrons form a…', 'Covalent bond', 'Ionic bond', 'Nuclear bond', 'Magnetic bond']]).concat([['Ionic bonds usually form between…', 'A metal and a nonmetal', 'Two noble gases', 'Two metals', 'Two neutrons']]) },
      { t: 'Balancing chemical equations', g: 'balance',
        l: ['Atoms are conserved, so both sides must have the same number of each atom.', 'Change coefficients (the big numbers in front), never subscripts.', '2H₂ + O₂ → 2H₂O is balanced: 4 H and 2 O on each side.'],
        try: 'Balance: CH₄ + O₂ → CO₂ + H₂O.' },
      { t: 'The mole and stoichiometry', g: 'moles',
        l: ['One mole = 6.02 × 10²³ particles (Avogadro\'s number).', 'Molar mass (g/mol) converts grams to moles: moles = grams ÷ molar mass.', 'Water: 2(1) + 16 = 18 g/mol.'],
        try: 'How many moles are in 36 g of water?' }
    ]
  };
  C['10-soc'] = {
    t: 'U.S. History', credit: 1, r: [['OpenStax · U.S. History (free textbook)', OS + 'us-history'], ['Khan Academy · U.S. history', KA + 'humanities/us-history']],
    u: [
      { t: 'Colonization and revolution',
        l: ['Colonies developed self-government (Virginia House of Burgesses, Mayflower Compact).', 'British taxes after 1763 sparked protest and war.', 'The Declaration of Independence (1776) declared natural rights and independence.'],
        try: 'Read the Declaration\'s preamble and rewrite it in modern words.',
        q: [['The first elected assembly in the colonies was the…', 'Virginia House of Burgesses', 'U.S. Senate', 'Continental Army', 'Supreme Court']] .concat([['Who was the main author of the Declaration of Independence?', 'Thomas Jefferson', 'George Washington', 'Benjamin Franklin', 'John Hancock']]).concat([['The French and Indian War ended in…', '1763', '1776', '1812', '1607']]) },
      { t: 'Expansion and division',
        l: ['Manifest Destiny was the belief that the U.S. should expand across the continent.', 'The Missouri Compromise and Compromise of 1850 tried to balance free and slave states.', 'The Dred Scott decision (1857) inflamed tensions.'],
        try: 'Map free and slave states in 1850.',
        q: [['The belief that the U.S. should expand west was…', 'Manifest Destiny', 'Isolationism', 'Containment', 'Federalism']] .concat([['The Dred Scott decision was issued in…', '1857', '1776', '1920', '1954']]).concat([['The Missouri Compromise dealt with…', 'Slavery in new states', 'Women voting', 'Tariffs on tea', 'Railroad routes']]) },
      { t: 'Reform and the Progressive Era',
        l: ['Progressives fought corruption, child labor and unsafe food.', 'The 19th Amendment (1920) gave women the right to vote.', 'Muckrakers exposed problems, like Upton Sinclair\'s "The Jungle" on meatpacking.'],
        try: 'Research one Progressive reformer and their impact.',
        q: [['The 19th Amendment gave women…', 'The right to vote', 'Free college', 'Military service', 'Property taxes']] .concat([['Journalists who exposed corruption were called…', 'Muckrakers', 'Carpetbaggers', 'Loyalists', 'Federalists'], ['"The Jungle" exposed problems in…', 'Meatpacking', 'Railroads', 'Banking', 'Schools']]) },
      { t: 'Depression and world war',
        l: ['The 1929 stock market crash began the Great Depression.', "FDR's New Deal created programs like Social Security.", 'The U.S. entered World War II after Pearl Harbor (December 7, 1941).'],
        try: 'Interview someone about how their family remembers this era.',
        q: [['The Great Depression began after the stock market crash of…', '1929', '1941', '1918', '1965']] .concat([["FDR's response to the Depression was the…", 'New Deal', 'Fair Deal', 'Great Society', 'Square Deal'], ['The U.S. entered WWII after the attack on…', 'Pearl Harbor', 'Fort Sumter', 'Lexington', 'Normandy']]) },
      { t: 'Civil rights and modern America',
        l: ['Brown v. Board of Education (1954) ruled school segregation unconstitutional.', 'The Civil Rights Act (1964) and Voting Rights Act (1965) banned major forms of discrimination.', 'Leaders included Martin Luther King Jr., Rosa Parks and many grassroots organizers.'],
        try: 'Read part of King\'s "Letter from Birmingham Jail" and summarize his argument.',
        q: [['Brown v. Board of Education ended legal…', 'School segregation', 'Women\'s voting', 'Child labor', 'Prohibition']] .concat([['The Voting Rights Act was passed in…', '1965', '1920', '1865', '2001'], ['Whose arrest sparked the Montgomery Bus Boycott?', 'Rosa Parks', 'Harriet Tubman', 'Susan B. Anthony', 'Frederick Douglass']]) }
    ]
  };

  /* ───────────── GRADE 11 ───────────── */
  C['11-math'] = {
    t: 'Algebra 2', credit: 1, r: [['Khan Academy · Algebra 2', KA + 'math/algebra2']],
    u: [
      { t: 'Quadratics and the discriminant', g: 'discriminant',
        l: ['Quadratic formula: x = (−b ± √(b² − 4ac)) ÷ 2a.', 'The discriminant b² − 4ac tells how many real solutions: positive → 2, zero → 1, negative → 0.', 'Vertex form: y = a(x − h)² + k.'],
        try: 'Find how many real solutions x² + 4x + 5 = 0 has.' },
      { t: 'Polynomial functions', g: 'polyEval',
        l: ['A polynomial\'s degree is its highest exponent.', 'Evaluate by substituting: f(2) for f(x) = x³ − 2x + 1 is 8 − 4 + 1 = 5.', 'End behavior depends on the degree and leading coefficient.'],
        try: 'Graph y = x³ − x on Desmos or graph paper and find its zeros.' },
      { t: 'Exponential functions', g: 'expGrowth',
        l: ['Growth: y = a·bˣ with b > 1. Decay: 0 < b < 1.', 'Doubling: amount = start × 2ⁿ after n doubling periods.', 'Compound interest: A = P(1 + r)ᵗ.'],
        try: 'Find how $500 grows at 6% a year for 10 years.' },
      { t: 'Logarithms', g: 'logEval',
        l: ['A logarithm answers "what exponent?": log₂ 8 = 3 because 2³ = 8.', 'log(ab) = log a + log b; log(aⁿ) = n log a.', 'Logs undo exponentials and help solve for exponents.'],
        try: 'Find log₁₀ of 1, 10, 100 and 1000. What pattern do you see?' },
      { t: 'Complex numbers', g: 'complexI',
        l: ['i = √−1, so i² = −1.', 'Powers of i repeat every 4: i, −1, −i, 1.', 'Add complex numbers by combining real and imaginary parts.'],
        try: 'Find i¹⁰ by dividing the exponent by 4 and using the remainder.' }
    ]
  };
  C['11-ela'] = {
    t: 'English 11: American Literature', credit: 1, r: [['Project Gutenberg', 'https://www.gutenberg.org/ebooks/bookshelf/20'], ['CommonLit text library', 'https://www.commonlit.org/texts']],
    u: [
      { t: 'Early American and Romantic writers', r: [['Project Gutenberg · The Legend of Sleepy Hollow', 'https://www.gutenberg.org/ebooks/41']],
        l: ['Puritan writing focused on faith, duty and community.', 'American Romantics (Irving, Poe, Hawthorne) valued imagination, emotion and the supernatural.', 'Gothic elements: dark settings, mystery, madness.'],
        try: 'Read "The Legend of Sleepy Hollow" and list its Romantic and Gothic elements.',
        q: [['Who wrote "The Legend of Sleepy Hollow"?', 'Washington Irving', 'Edgar Allan Poe', 'Mark Twain', 'Walt Whitman']] .concat([['Romantic writers emphasized…', 'Imagination and emotion', 'Factory statistics', 'Scientific formulas', 'Legal codes'], ['Dark settings and mystery are elements of…', 'Gothic literature', 'Realism', 'Modernism', 'Journalism']]) },
      { t: 'Poe and the short story', r: [['CommonLit · The Cask of Amontillado', 'https://www.commonlit.org/texts/the-cask-of-amontillado']],
        l: ['Poe aimed for a "single effect": every detail builds one mood.', 'An unreliable narrator cannot be fully trusted.', '"The Cask of Amontillado" uses dramatic irony and a chilling first-person voice.'],
        try: 'Read "The Cask of Amontillado" and explain why Montresor is unreliable.',
        q: [['A narrator whose account cannot be fully trusted is…', 'Unreliable', 'Omniscient', 'Objective', 'Dynamic']] .concat([['Poe believed a short story should create a…', 'Single effect', 'Happy ending', 'Long subplot', 'Moral lesson']]).concat([['Who is the narrator of "The Cask of Amontillado"?', 'Montresor', 'Fortunato', 'Poe himself', 'Ichabod Crane']]) },
      { t: 'Transcendentalism',
        l: ['Emerson and Thoreau believed in self-reliance, nature and individual intuition.', 'Thoreau lived at Walden Pond to "live deliberately."', 'Civil disobedience: refusing to obey unjust laws peacefully.'],
        try: 'Spend 20 minutes outdoors without devices and journal like Thoreau.',
        q: [['Who wrote "Self-Reliance"?', 'Ralph Waldo Emerson', 'Henry David Thoreau', 'Emily Dickinson', 'Mark Twain']] .concat([['Thoreau lived for two years at…', 'Walden Pond', 'Sleepy Hollow', 'Plymouth Rock', 'Niagara Falls']]).concat([['Peacefully refusing to obey an unjust law is…', 'Civil disobedience', 'Treason', 'Filibuster', 'Veto']]) },
      { t: 'Realism and Modernism',
        l: ['Realists (Twain, Chopin) portrayed ordinary life honestly, often with regional dialect.', 'Modernists (Fitzgerald, Hemingway) wrote after WWI about disillusionment and broke traditional forms.', 'Hemingway\'s "iceberg theory": most meaning lies beneath the surface.'],
        try: 'Compare a paragraph of Twain with a paragraph of Hemingway. How do the sentences differ?',
        q: [['Who wrote "The Great Gatsby"?', 'F. Scott Fitzgerald', 'Ernest Hemingway', 'Mark Twain', 'John Steinbeck']] .concat([['Realism portrays…', 'Ordinary life honestly', 'Fantasy kingdoms', 'Only the supernatural', 'Future technology'], ['Modernist writers often explored…', 'Disillusionment after WWI', 'Puritan sermons', 'Medieval knights', 'Ancient Greek gods']]) },
      { t: 'Rhetorical analysis of American speeches',
        l: ['Analyze the speaker, audience, purpose and context (SOAPS).', 'Identify devices: parallelism, allusion, antithesis.', 'Explain how choices help the speaker achieve the purpose.'],
        try: 'Analyze the rhetoric in the Gettysburg Address (272 words).',
        q: [['A reference to a well-known person, event or text is an…', 'Allusion', 'Alliteration', 'Analogy', 'Anecdote']] .concat([['Putting contrasting ideas side by side is…', 'Antithesis', 'Hyperbole', 'Onomatopoeia', 'Metaphor']]).concat([['Using the same grammatical structure in a series is…', 'Parallelism', 'Irony', 'Ellipsis', 'Dialect']]) }
    ]
  };
  C['11-sci'] = {
    t: 'Physics', credit: 1, r: [['OpenStax · Physics (free high school textbook)', OS + 'physics'], ['Khan Academy · High school physics', KA + 'science/highschool-physics'], ['PhET simulations', 'https://phet.colorado.edu/']],
    u: [
      { t: 'Kinematics', g: 'kinematics',
        l: ['Speed = distance ÷ time. Velocity includes direction.', 'Acceleration = change in velocity ÷ time.', 'For constant acceleration from rest: d = ½at².'],
        try: 'Time how long a ball takes to roll down a ramp and find its average speed.' },
      { t: 'Forces and Newton\'s laws', g: 'forceFma',
        l: ['Net force = mass × acceleration (F = ma), measured in newtons.', 'Weight = mass × g, where g ≈ 9.8 m/s² on Earth.', 'Free-body diagrams show every force on an object.'],
        try: 'Draw a free-body diagram of a book resting on a table.' },
      { t: 'Energy and momentum', g: 'energy',
        l: ['Kinetic energy = ½mv². Gravitational potential energy = mgh.', 'Momentum = mass × velocity; it is conserved in collisions.', 'Work = force × distance.'],
        try: 'Drop a ball from different heights and compare bounce heights.' },
      { t: 'Waves and sound', g: 'waves',
        l: ['Wave speed = frequency × wavelength.', 'Sound travels about 343 m/s in air at room temperature.', 'Higher frequency sounds have higher pitch.'],
        try: 'Count seconds between lightning and thunder to estimate distance.' },
      { t: 'Electricity', g: 'ohm',
        l: ['Ohm\'s law: voltage = current × resistance (V = IR).', 'Series circuits have one path; parallel circuits have several.', 'Power = voltage × current, measured in watts.'],
        try: 'Use the PhET circuit kit to build series and parallel circuits.' }
    ]
  };
  C['11-soc'] = {
    t: 'U.S. Government & Civics', credit: 1, r: [['OpenStax · American Government 4e (free textbook)', OS + 'american-government-4e'], ['Khan Academy · U.S. government & civics', KA + 'humanities/us-government-and-civics'], ['iCivics student games', 'https://ed.icivics.org/students']],
    u: [
      { t: 'Founding principles',
        l: ['Popular sovereignty: power comes from the people.', 'Federalism divides power between national and state governments.', 'Separation of powers and checks and balances limit government.'],
        try: 'Find three examples of checks and balances in the news.',
        q: [['Dividing power between national and state governments is…', 'Federalism', 'Socialism', 'Monarchy', 'Anarchy']] .concat([['The idea that power comes from the people is…', 'Popular sovereignty', 'Divine right', 'Judicial review', 'Martial law'], ['A presidential veto is an example of…', 'Checks and balances', 'Federalism', 'Popular sovereignty', 'Due process']]) },
      { t: 'Congress', r: [['iCivics · LawCraft', 'https://ed.icivics.org/resources/game/593/lawcraft']],
        l: ['Congress has the House (435 members) and the Senate (100 members).', 'A bill must pass both chambers and be signed by the President to become law.', 'Congress can override a veto with a two-thirds vote in both chambers.'],
        try: 'Play "LawCraft" on iCivics.',
        q: [['How many voting members are in the House?', '435', '100', '50', '538']] .concat([['Overriding a veto requires…', 'Two-thirds of both chambers', 'A simple majority', 'The Supreme Court', 'The governors']]).concat([['How many senators does each state have?', '2', '1', '4', 'It depends on population']]) },
      { t: 'The presidency', r: [['iCivics · Executive Command', 'https://ed.icivics.org/resources/game/594/executive-command']],
        l: ['The President must be 35+, a natural-born citizen and a 14-year U.S. resident.', 'Roles: chief executive, commander in chief, chief diplomat.', 'Presidents serve 4-year terms, limited to two by the 22nd Amendment.'],
        try: 'Play "Executive Command" on iCivics.',
        q: [['Minimum age to be President?', '35', '25', '30', '40']] .concat([['Which amendment limits presidents to two terms?', '22nd', '1st', '19th', '26th']]).concat([['As commander in chief, the President leads the…', 'Armed forces', 'Senate', 'Supreme Court', 'States']]) },
      { t: 'Courts and civil liberties', r: [['iCivics · Do I Have a Right?', 'https://ed.icivics.org/resources/game/42/do-i-have-a-right']],
        l: ['The Supreme Court has 9 justices appointed for life.', 'Judicial review (Marbury v. Madison, 1803) lets courts strike down unconstitutional laws.', 'Due process protects people from unfair government actions.'],
        try: 'Read a summary of a landmark case and explain the ruling.',
        q: [['How many justices are on the Supreme Court?', '9', '7', '12', '5']] .concat([['Judicial review was established by…', 'Marbury v. Madison', 'Brown v. Board', 'Roe v. Wade', 'Plessy v. Ferguson'], ['Federal judges serve…', 'For life (good behavior)', '4 years', '6 years', '2 years']]) },
      { t: 'Elections and participation', r: [['iCivics · Win the White House', 'https://ed.icivics.org/resources/game/67038/win-the-white-house']],
        l: ['The 26th Amendment set the voting age at 18.', 'Presidents are chosen by the Electoral College; 270 of 538 electoral votes wins.', 'Citizens participate by voting, contacting officials, volunteering and serving on juries.'],
        try: 'Find who represents you in Congress and one issue they are working on.',
        q: [['How many electoral votes does a candidate need to win?', '270', '538', '100', '435']] .concat([['The 26th Amendment set the voting age at…', '18', '21', '16', '25']]).concat([['Which is a way citizens participate?', 'Serving on a jury', 'Writing laws alone', 'Appointing judges', 'Printing money']]) }
    ]
  };

  /* ───────────── GRADE 12 ───────────── */
  C['12-math'] = {
    t: 'Precalculus', credit: 1, r: [['Khan Academy · Precalculus', KA + 'math/precalculus']],
    u: [
      { t: 'Functions and composition', g: 'compose',
        l: ['(f ∘ g)(x) = f(g(x)): apply g first, then f.', 'An inverse function undoes the original: f⁻¹(f(x)) = x.', 'Domain is the set of allowed inputs.'],
        try: 'Find f(g(2)) for f(x) = 2x + 1 and g(x) = x².' },
      { t: 'Radians and degrees', g: 'radDeg',
        l: ['180° = π radians.', 'Degrees to radians: multiply by π/180. Radians to degrees: multiply by 180/π.', '90° = π/2, 60° = π/3, 45° = π/4, 30° = π/6.'],
        try: 'Convert the angles on a clock face (every 30°) to radians.' },
      { t: 'The unit circle', g: 'unitCircle',
        l: ['On the unit circle, a point is (cos θ, sin θ).', 'sin 30° = 1/2, cos 60° = 1/2, sin 45° = cos 45° = √2/2.', 'Sine is positive in quadrants I and II; cosine in I and IV.'],
        try: 'Draw the unit circle and label every multiple of 30° and 45°.' },
      { t: 'Sequences and series', g: 'sequence',
        l: ['Arithmetic: add the same difference d. aₙ = a₁ + (n − 1)d.', 'Geometric: multiply by the same ratio r. aₙ = a₁ · rⁿ⁻¹.', 'Sum of an arithmetic series = n(a₁ + aₙ) ÷ 2.'],
        try: 'Find the sum of the first 100 positive integers.' },
      { t: 'Exponential and logarithmic equations', g: 'logEval',
        l: ['To solve 2ˣ = 32, rewrite 32 as 2⁵, so x = 5.', 'ln is the natural log (base e ≈ 2.718).', 'Use logs when the exponent is unknown and the bases do not match.'],
        try: 'How many years for money to double at 7%? Try the "rule of 72."' }
    ]
  };
  C['12-ela'] = {
    t: 'English 12: British & World Literature', credit: 1, r: [['Project Gutenberg', 'https://www.gutenberg.org/ebooks/bookshelf/20'], ['Purdue OWL', 'https://owl.purdue.edu/owl/index.html']],
    u: [
      { t: 'Anglo-Saxon and medieval literature',
        l: ['"Beowulf" is an Old English epic about a hero fighting monsters.', 'Epic heroes embody the values of their culture: courage, loyalty, glory.', 'Chaucer\'s "The Canterbury Tales" satirizes medieval society through pilgrims\' stories.'],
        try: 'Compare Beowulf with a modern superhero.',
        q: [['"Beowulf" was written in…', 'Old English', 'Modern English', 'Latin', 'French']] .concat([['Who wrote "The Canterbury Tales"?', 'Geoffrey Chaucer', 'William Shakespeare', 'John Milton', 'Charles Dickens'], ['A long poem about a hero\'s deeds is an…', 'Epic', 'Ode', 'Sonnet', 'Elegy']]) },
      { t: 'Shakespeare',
        l: ['Shakespeare wrote tragedies (Hamlet, Macbeth), comedies and histories.', 'A tragic hero falls because of a tragic flaw (hamartia).', 'A soliloquy reveals a character\'s private thoughts to the audience.'],
        try: 'Perform Hamlet\'s "To be or not to be" soliloquy aloud.',
        q: [['A speech where a character alone reveals thoughts is a…', 'Soliloquy', 'Dialogue', 'Aside', 'Chorus']] .concat([["Macbeth's tragic flaw is often said to be…", 'Ambition', 'Kindness', 'Laziness', 'Honesty'], ['"Hamlet" is a…', 'Tragedy', 'Comedy', 'History', 'Sonnet']]) },
      { t: 'The Romantic poets',
        l: ['British Romantics (Wordsworth, Coleridge, Keats, Shelley) celebrated nature, emotion and imagination.', 'Wordsworth described poetry as powerful feelings recollected in tranquility.', 'Odes are formal poems that address and praise a subject.'],
        try: 'Write an ode to something ordinary in your house.',
        q: [['Romantic poets especially celebrated…', 'Nature and emotion', 'Factories', 'Royal laws', 'Mathematics']] .concat([['A formal poem praising a subject is an…', 'Ode', 'Epic', 'Limerick', 'Haiku'], ['Which poet was a British Romantic?', 'John Keats', 'Geoffrey Chaucer', 'Ernest Hemingway', 'Homer']]) },
      { t: 'The Victorian novel', r: [['Project Gutenberg · A Christmas Carol', 'https://www.gutenberg.org/ebooks/46']],
        l: ['Victorian novels (Dickens, the Brontës) explored class, industry and morality.', 'Dickens used memorable characters and social criticism.', '"A Christmas Carol" (1843) shows Scrooge\'s transformation.'],
        try: 'Read "A Christmas Carol" and trace Scrooge\'s change across the staves.',
        q: [['Who wrote "A Christmas Carol"?', 'Charles Dickens', 'Jane Austen', 'Thomas Hardy', 'Oscar Wilde']] .concat([['Victorian novels often criticized…', 'Social and class problems', 'Space travel', 'Ancient Rome', 'Medieval chivalry only']]).concat([['Scrooge is an example of a…', 'Dynamic character', 'Static character', 'Narrator only', 'Minor character']]) },
      { t: 'The college and personal essay', r: [['Purdue OWL · College application essays', 'https://owl.purdue.edu/owl/general_writing/undergraduate_applications/index.html']],
        l: ['Show, don\'t tell: use a specific story to reveal who you are.', 'Reflection matters more than the event: what did you learn?', 'Revise for voice, clarity and word limits.'],
        try: 'Draft a 500-word personal essay about a moment that changed your thinking.',
        q: [['A strong personal essay focuses on…', 'A specific story and reflection', 'A list of awards', 'A summary of a book', 'General statements']] .concat([['"Show, don\'t tell" means…', 'Use vivid details and actions', 'Use bigger words', 'Skip details', 'Write in third person']]).concat([['The most important part of a personal essay is often the…', 'Reflection', 'Title font', 'Word count', 'Bibliography']]) }
    ]
  };
  C['12-sci'] = {
    t: 'Earth & Space Science', credit: 1, r: [['Khan Academy · Cosmology & astronomy', KA + 'science/cosmology-and-astronomy'], ['NASA Space Place', 'https://spaceplace.nasa.gov/']],
    u: [
      { t: "Earth's interior and plate tectonics",
        l: ['Layers: crust, mantle, outer core (liquid) and inner core (solid).', 'Convection in the mantle drives plate motion.', 'Seafloor spreading at mid-ocean ridges creates new crust.'],
        try: 'Make a hard-boiled egg model of Earth\'s layers.',
        q: [['Which layer of Earth is liquid?', 'Outer core', 'Inner core', 'Crust', 'Lithosphere']] .concat([['What drives plate motion?', 'Mantle convection', 'Ocean tides', 'Wind', 'The Moon'], ['New crust forms at…', 'Mid-ocean ridges', 'Deserts', 'Glaciers', 'Deltas']]) },
      { t: 'Atmosphere and climate',
        l: ['The atmosphere has layers. Weather happens in the lowest one, the troposphere; the ozone layer sits in the stratosphere above it.', 'The greenhouse effect traps heat and keeps Earth livable.', 'Rising CO₂ from burning fossil fuels strengthens the effect and warms the planet.', 'Climate evidence comes from ice cores, tree rings and temperature records.'],
        try: 'Graph your area\'s average temperature by decade using a public data source.',
        q: [['The layer of the atmosphere where weather happens is the…', 'Troposphere', 'Stratosphere', 'Mesosphere', 'Thermosphere']] .concat([['Which gas is a major greenhouse gas?', 'Carbon dioxide', 'Helium', 'Neon', 'Argon']]).concat([['Ice cores provide evidence of…', 'Past climate', 'Future earthquakes', 'Ocean depth', 'Plate speed']]) },
      { t: 'Oceans and water resources',
        l: ['About 97% of Earth\'s water is salt water.', 'Ocean currents move heat around the planet.', 'Groundwater is stored in aquifers and must be managed carefully.'],
        try: 'Track how much water your household uses in one day.',
        q: [['About what percent of Earth\'s water is salt water?', '97%', '50%', '25%', '3%']] .concat([['Underground layers that store water are…', 'Aquifers', 'Estuaries', 'Deltas', 'Atolls']]).concat([['Ocean currents help move…', 'Heat around the planet', 'Continents', 'Volcanoes', 'Mountains']]) },
      { t: 'The solar system', r: [['NASA Space Place · Solar System', 'https://spaceplace.nasa.gov/menu/solar-system/']],
        l: ['The solar system formed about 4.6 billion years ago from a collapsing cloud of gas and dust.', 'Inner planets are rocky; outer planets are gas and ice giants.', "Kepler's laws describe elliptical orbits."],
        try: 'Calculate how long light takes to reach Earth from the Sun (150 million km ÷ 300,000 km/s).',
        q: [['Which planets are rocky?', 'Mercury, Venus, Earth, Mars', 'Jupiter and Saturn', 'Uranus and Neptune', 'All of them']] .concat([['Planets orbit in…', 'Ellipses', 'Squares', 'Straight lines', 'Spirals inward']]).concat([['About how long does sunlight take to reach Earth?', '8 minutes', '8 seconds', '8 hours', '8 days']]) },
      { t: 'Stars and the universe', r: [['Khan Academy · Cosmology & astronomy', KA + 'science/cosmology-and-astronomy']],
        l: ['Stars form in nebulae and fuse hydrogen into helium.', 'Massive stars end as supernovae, leaving neutron stars or black holes.', 'The Big Bang theory says the universe began expanding about 13.8 billion years ago.'],
        try: 'Find the Orion constellation and identify Betelgeuse and Rigel.',
        q: [['Stars mainly fuse hydrogen into…', 'Helium', 'Iron', 'Oxygen', 'Carbon']] .concat([['About how old is the universe?', '13.8 billion years', '4.6 billion years', '1 million years', '100 billion years']]).concat([['A massive star can end as a…', 'Black hole', 'Planet', 'Comet', 'Moon']]) }
    ]
  };
  C['12-soc'] = {
    t: 'Economics & Personal Finance', credit: 1, r: [['Khan Academy · Financial literacy', KA + 'college-careers-more/financial-literacy'], ['Khan Academy · Macroeconomics', KA + 'economics-finance-domain/macroeconomics'], ['iCivics · People\'s Pie', 'https://ed.icivics.org/resources/game/33765/people-s-pie']],
    u: [
      { t: 'Scarcity and supply and demand', r: [['Khan Academy · Microeconomics', KA + 'economics-finance-domain/microeconomics']],
        l: ['Scarcity forces choices; the next-best option given up is the opportunity cost.', 'When demand rises and supply stays the same, prices rise.', 'Equilibrium is where supply equals demand.'],
        try: 'Track the price of one item (gas, eggs) for a month and explain changes.',
        q: [['If demand rises and supply stays the same, price will usually…', 'Rise', 'Fall', 'Stay the same', 'Go to zero']] .concat([['The price where supply equals demand is…', 'Equilibrium', 'Inflation', 'Surplus', 'Shortage'], ['The value of the next-best alternative is…', 'Opportunity cost', 'Profit', 'Interest', 'Revenue']]) },
      { t: 'Markets and competition',
        l: ['Perfect competition has many sellers; a monopoly has one.', 'Competition tends to lower prices and improve quality.', 'Governments regulate to protect consumers and competition.'],
        try: 'Compare prices for the same product at three stores.',
        q: [['A market with only one seller is a…', 'Monopoly', 'Oligopoly', 'Perfect competition', 'Barter']] .concat([['More competition usually leads to…', 'Lower prices', 'Higher prices', 'Fewer choices', 'No change']]).concat([['A market with a few large sellers is an…', 'Oligopoly', 'Monopoly', 'Anarchy', 'Cooperative']]) },
      { t: 'GDP, inflation and unemployment', r: [['Khan Academy · Macroeconomics', KA + 'economics-finance-domain/macroeconomics']],
        l: ['GDP is the total value of goods and services produced in a country.', 'Inflation is a general rise in prices; it lowers purchasing power.', 'The business cycle: expansion, peak, contraction (recession), trough.'],
        try: 'Look up this year\'s inflation rate and what it means for a $100 grocery bill.',
        q: [['The total value of goods and services a country produces is…', 'GDP', 'CPI', 'APR', 'IRA']] .concat([['A general rise in prices is…', 'Inflation', 'Deflation', 'Recession', 'Equilibrium']]).concat([['A period of economic decline is a…', 'Recession', 'Boom', 'Peak', 'Surplus']]) },
      { t: 'Money, banking and the Fed',
        l: ['Money is a medium of exchange, a unit of account and a store of value.', 'The Federal Reserve is the U.S. central bank; it sets interest-rate policy.', 'Banks lend part of their deposits, which creates more money in the economy.'],
        try: 'Compare savings account interest rates at two banks.',
        q: [['The central bank of the U.S. is the…', 'Federal Reserve', 'Treasury Department', 'Supreme Court', 'IRS']] .concat([['Raising interest rates usually…', 'Slows borrowing and spending', 'Speeds up inflation', 'Prints more money', 'Lowers taxes']]).concat([['Which is a function of money?', 'Medium of exchange', 'Source of weather', 'Type of tax', 'Legal contract']]) },
      { t: 'Personal finance: budgeting, credit and investing', g: 'compound', r: [['Khan Academy · Financial literacy', KA + 'college-careers-more/financial-literacy']],
        l: ['A budget plans income against spending; one simple guide is 50% needs, 30% wants, 20% savings.', 'Credit scores reflect how reliably you repay debt; high-interest debt grows fast.', 'Compound interest: A = P(1 + r)ᵗ. Starting early lets growth build on growth.'],
        try: 'Build a monthly budget for a first job paying $2,400 a month after taxes.' }
    ]
  };
})();
