/* Lantern Homeschool — curriculum content, grades 1–4.
   Quiz format: [question, correctAnswer, wrong1, wrong2, wrong3]  (choices are shuffled at runtime)
   Math units use a generator id (g) so every quiz attempt gets fresh problems. */
(function () {
  const KA = 'https://www.khanacademy.org/';
  const C = (window.LH_COURSES = window.LH_COURSES || {});

  /* ───────────── GRADE 1 ───────────── */
  C['1-math'] = {
    t: '1st Grade Math', r: [['Khan Academy · 1st grade math', KA + 'math/cc-1st-grade-math']],
    u: [
      { t: 'Numbers to 120 and place value', g: 'placeValue1',
        l: ['A two-digit number is made of tens and ones. In 47 there are 4 tens and 7 ones.', 'Ten ones make one ten. Bundle 10 sticks with a rubber band and you have 1 ten.', 'Count forward from any number up to 120: …98, 99, 100, 101…'],
        try: 'Grab beans or coins. Make 34 using groups of ten and loose ones.' },
      { t: 'Addition within 20', g: 'add20',
        l: ['Adding puts groups together. 8 + 5 means start at 8 and count on 5 more.', 'Make a ten: 8 + 5 = 8 + 2 + 3 = 10 + 3 = 13.', 'Order does not change the sum: 3 + 9 = 9 + 3.'],
        try: 'Roll two dice and add the dots. Do it ten times.' },
      { t: 'Subtraction within 20', g: 'sub20',
        l: ['Subtracting takes away or finds the difference. 15 − 6 means start at 15 and take away 6.', 'Think addition: 15 − 6 = ? is the same as 6 + ? = 15.', 'Count back on a number line when the number taken away is small.'],
        try: 'Put 14 crackers out. Eat 5. How many are left?' },
      { t: 'Comparing numbers', g: 'compare1',
        l: ['Compare tens first. 52 is greater than 38 because 5 tens is more than 3 tens.', 'If the tens are the same, compare the ones: 46 > 43.', 'Symbols: > means greater than, < means less than, = means equal.'],
        try: 'Write two numbers on cards. Who has the greater number?' },
      { t: 'Telling time to the hour and half hour', g: 'time1',
        l: ['The short hand shows the hour. The long hand shows the minutes.', 'At "o\'clock" the long hand points to 12. At "half past" it points to 6.', '3:30 is half past 3. One hour after 3:30 is 4:30.'],
        try: 'Check a clock at breakfast, lunch and dinner and say the time out loud.' }
    ]
  };
  C['1-ela'] = {
    t: '1st Grade Reading & Writing', r: [['Starfall · Learn to Read (free)', 'https://www.starfall.com/h/learn-to-read/'], ['Storyline Online · read-alouds', 'https://storylineonline.net/library']],
    u: [
      { t: 'Short vowel sounds', r: [['Starfall · Learn to Read', 'https://www.starfall.com/h/learn-to-read/']],
        l: ['The vowels are a, e, i, o, u. In short words like cat, bed, pig, hot and sun, vowels make their short sound.', 'Tap each sound and blend it: c-a-t → cat.', 'Change one letter to make a new word: cat → cap → map.'],
        try: 'Make words with letter tiles: change the vowel in b_g to make bag, beg, big, bog, bug.',
        q: [['Which word has a short a sound?', 'hat', 'hit', 'hot', 'hut'], ['Which word rhymes with "pig"?', 'dig', 'pan', 'pet', 'pot'], ['What word do you get when you blend s-u-n?', 'sun', 'sin', 'son', 'sat']] },
      { t: 'Sight words', r: [['Starfall · It\'s Fun to Read', 'https://www.starfall.com/h/fun-to-read/']],
        l: ['Sight words show up in almost every book: the, said, was, you, they, have, of.', 'Many sight words do not follow the usual sound rules, so we learn them by heart.', 'Read them fast, spell them, and use them in a sentence.'],
        try: 'Write 5 sight words on sticky notes around the house. Read each one when you pass it.',
        q: [['Which is spelled correctly?', 'said', 'sed', 'siad', 'sayd'], ['Fill in the blank: "___ dog is big."', 'The', 'Of', 'Was', 'Have'], ['Which word is a sight word?', 'they', 'zap', 'mud', 'fin']] },
      { t: 'Characters and setting', r: [['Storyline Online · Stellaluna', 'https://storylineonline.net/books/stellaluna']],
        l: ['Characters are the people or animals in a story.', 'The setting is where and when the story happens.', 'Good readers ask: Who is in the story? Where are they?'],
        try: 'Listen to "Stellaluna" on Storyline Online. Name the main character and two places she goes.',
        q: [['What is the setting of a story?', 'Where and when it happens', 'Who is in the story', 'The title', 'The last page'], ['In "The Three Little Pigs," which is a character?', 'The wolf', 'The straw house', 'The forest', 'The end'], ['A story says "Long ago, in a snowy village…" What does this tell you?', 'The setting', 'The problem', 'The lesson', 'The author']] },
      { t: 'Writing a sentence',
        l: ['A sentence is a complete thought. It tells who and what happened.', 'Start every sentence with a capital letter.', 'End a telling sentence with a period and an asking sentence with a question mark.'],
        try: 'Write three sentences about your favorite food. Check each one for a capital and an end mark.',
        q: [['Which sentence is written correctly?', 'My cat likes to nap.', 'my cat likes to nap.', 'My cat likes to nap', 'my cat likes to nap'], ['Which end mark goes here: "Where is my hat__"', '?', '.', ',', '!'], ['Which is a complete sentence?', 'The bird sang.', 'The bird.', 'Sang a song.', 'Up in the tree.']] },
      { t: 'Retelling a story', r: [['Storyline Online · The Empty Pot', 'https://storylineonline.net/books/the-empty-pot']],
        l: ['Retelling means telling a story again in your own words.', 'Tell the beginning, the middle and the end in order.', 'Use order words: first, next, then, last.'],
        try: 'Watch "The Empty Pot" and retell it to a grown-up using first, next, then, last.',
        q: [['Which words help you retell in order?', 'First, next, last', 'Big, small, tall', 'Red, blue, green', 'Yes, no, maybe'], ['What part of a story usually has the problem solved?', 'The end', 'The title', 'The cover', 'The beginning'], ['Retelling means…', 'Telling the story again in your own words', 'Reading only the title', 'Drawing the cover', 'Skipping to the end']] }
    ]
  };
  C['1-sci'] = {
    t: '1st Grade Science', r: [['NASA Space Place', 'https://spaceplace.nasa.gov/'], ['PhET simulations', 'https://phet.colorado.edu/']],
    u: [
      { t: 'Living and nonliving things',
        l: ['Living things grow, need food and water, and make more of their own kind.', 'Nonliving things, like rocks and toys, do not grow or need food.', 'Plants are living even though they do not move around.'],
        try: 'Go outside and list 5 living and 5 nonliving things you see.',
        q: [['Which is a living thing?', 'A tree', 'A rock', 'A spoon', 'A cloud'], ['What do all living things need?', 'Water', 'Toys', 'Shoes', 'Electricity'], ['Which can grow?', 'A puppy', 'A ball', 'A chair', 'A pencil']] },
      { t: 'What plants need',
        l: ['Plants need sunlight, water, air and space to grow.', 'Roots take in water. Leaves use sunlight to make food.', 'A plant kept in a dark closet will turn pale and weak.'],
        try: 'Plant two bean seeds in cups. Put one by a window and one in a cupboard. Check them every day for a week.',
        q: [['Which part of a plant takes in water?', 'Roots', 'Flowers', 'Leaves', 'Seeds'], ['What do leaves use to make food?', 'Sunlight', 'Rocks', 'Sand', 'Wind only'], ['A plant in a dark closet will likely…', 'Grow weak and pale', 'Grow faster', 'Turn purple', 'Make more flowers']] },
      { t: 'Animals and their young',
        l: ['Young animals look a lot like their parents, but not exactly the same.', 'Parents help young survive: birds feed chicks, a cat carries kittens.', 'Some young look very different at first, like a tadpole that becomes a frog.'],
        try: 'Match baby animal pictures to their parents: calf, kitten, chick, tadpole.',
        q: [['A baby frog is called a…', 'Tadpole', 'Cub', 'Calf', 'Kid'], ['How do bird parents help their chicks?', 'They bring them food', 'They teach them to swim right away', 'They leave them alone', 'They build cars'], ['A young cow is called a…', 'Calf', 'Puppy', 'Foal', 'Chick']] },
      { t: 'Patterns in the sky', r: [['NASA Space Place · Moon phases', 'https://spaceplace.nasa.gov/moon-phases/en/']],
        l: ['The Sun seems to rise in the east and set in the west every day.', 'The Moon\'s shape seems to change over about a month. These are its phases.', 'In summer there are more hours of daylight than in winter.'],
        try: 'Draw the Moon every clear night for two weeks. How does it change?',
        q: [['Where does the Sun appear to rise?', 'East', 'West', 'North', 'Under the ground'], ['The changing shapes of the Moon are called…', 'Phases', 'Seasons', 'Stars', 'Clouds'], ['Which season has the most daylight?', 'Summer', 'Winter', 'Fall', 'They are all the same']] },
      { t: 'Sound and light',
        l: ['Sound is made when something vibrates (shakes back and forth quickly).', 'Light lets us see. With no light, we cannot see anything.', 'Some things let light through (glass); some block it and make a shadow (wood).'],
        try: 'Stretch a rubber band over a box and pluck it. Feel it vibrate. Then make shadow puppets with a flashlight.',
        q: [['Sound is made by…', 'Vibrations', 'Shadows', 'Colors', 'Rocks'], ['What makes a shadow?', 'An object blocking light', 'A loud noise', 'Water', 'Wind'], ['Which lets light pass through?', 'A clear window', 'A wooden door', 'A brick', 'A book']] }
    ]
  };
  C['1-soc'] = {
    t: '1st Grade Social Studies', r: [["Ben's Guide to the U.S. Government", 'https://bensguide.gpo.gov/'], ['iCivics · Neighborhood Good', 'https://ed.icivics.org/resources/game/1814/neighborhood-good']],
    u: [
      { t: 'Rules and why we have them',
        l: ['Rules tell us how to act. They keep us safe and help us be fair.', 'Homes, schools and games all have rules.', 'Laws are rules made by the government for everyone.'],
        try: 'Write 3 family rules together and talk about why each one matters.',
        q: [['Why do we have rules?', 'To keep us safe and be fair', 'To make people sad', 'So nobody can play', 'To waste time'], ['A rule made by the government is called a…', 'Law', 'Game', 'Song', 'Story'], ['Which is a safety rule?', 'Look both ways before crossing', 'Eat dessert first', 'Run inside the house', 'Leave toys on stairs']] },
      { t: 'Families and community helpers', r: [['iCivics · Neighborhood Good', 'https://ed.icivics.org/resources/game/1814/neighborhood-good']],
        l: ['A community is a place where people live, work and play together.', 'Community helpers include firefighters, nurses, mail carriers and librarians.', 'Families live in many ways, and every family has members who help each other.'],
        try: 'Pick a community helper. Draw what tools they use for their job.',
        q: [['Who delivers letters?', 'A mail carrier', 'A chef', 'A pilot', 'A dentist'], ['Who helps put out fires?', 'A firefighter', 'A baker', 'A farmer', 'A teacher'], ['A community is…', 'A place where people live and work together', 'Only one house', 'A kind of food', 'A type of weather']] },
      { t: 'Maps and globes',
        l: ['A map is a flat drawing of a place from above. A globe is a round model of Earth.', 'A map key (legend) tells what the symbols mean.', 'Blue on a map usually means water.'],
        try: 'Draw a map of your bedroom with a key for bed, door and window.',
        q: [['What part of a map explains its symbols?', 'The key', 'The title only', 'The border', 'The paper'], ['A round model of Earth is a…', 'Globe', 'Map', 'Ruler', 'Compass'], ['On most maps, blue shows…', 'Water', 'Mountains', 'Roads', 'Cities']] },
      { t: 'Needs and wants',
        l: ['Needs are things we must have to live: food, water, shelter, clothing.', 'Wants are things that are nice to have but we can live without.', 'Families make choices because money is limited.'],
        try: 'Cut pictures from a store flyer and sort them into needs and wants.',
        q: [['Which is a need?', 'Water', 'A video game', 'Candy', 'A toy car'], ['Which is a want?', 'A new toy', 'Food', 'A coat in winter', 'A home'], ['Why do families make choices about what to buy?', 'Money is limited', 'Stores are closed', 'Everything is free', 'Wants are needs']] },
      { t: 'American symbols', r: [["Ben's Guide · Ages 4 to 8", 'https://bensguide.gpo.gov/learning-adventures-14more']],
        l: ['The American flag has 50 stars for the 50 states and 13 stripes for the first 13 colonies.', 'The bald eagle is the national bird.', 'The Statue of Liberty stands for freedom.'],
        try: 'Count the stars and stripes on a flag picture. Then draw your own.',
        q: [['How many stars are on the U.S. flag?', '50', '13', '25', '100'], ['What do the 13 stripes stand for?', 'The first 13 colonies', '13 presidents', '13 lakes', '13 holidays'], ['What is the U.S. national bird?', 'Bald eagle', 'Robin', 'Pigeon', 'Owl']] }
    ]
  };

  /* ───────────── GRADE 2 ───────────── */
  C['2-math'] = {
    t: '2nd Grade Math', r: [['Khan Academy · 2nd grade math', KA + 'math/cc-2nd-grade-math']],
    u: [
      { t: 'Add and subtract within 100', g: 'addsub100',
        l: ['Add tens to tens and ones to ones: 34 + 25 = 50 + 9 = 59.', 'When ones add to more than 9, regroup 10 ones as 1 ten.', 'Check subtraction with addition: 72 − 18 = 54 because 54 + 18 = 72.'],
        try: 'Add up the prices of two snacks at the store (in cents).' },
      { t: 'Place value to 1,000', g: 'placeValue2',
        l: ['Three-digit numbers have hundreds, tens and ones. 485 = 400 + 80 + 5.', 'Ten tens make one hundred.', 'Read 607 as "six hundred seven." The 0 holds the tens place.'],
        try: 'Write your house number in expanded form.' },
      { t: 'Skip counting', g: 'skipCount',
        l: ['Skip counting means counting by the same amount: 5, 10, 15, 20…', 'Count by 10s from any number: 23, 33, 43, 53…', 'Counting by 100s: 100, 200, 300…'],
        try: 'Count nickels by 5s and dimes by 10s.' },
      { t: 'Counting money', g: 'money',
        l: ['Penny = 1¢, nickel = 5¢, dime = 10¢, quarter = 25¢.', 'Count the biggest coins first, then count on.', '100¢ is the same as one dollar.'],
        try: 'Empty a coin jar and count one handful.' },
      { t: 'Odd and even numbers', g: 'oddEven',
        l: ['Even numbers can be split into two equal groups: 2, 4, 6, 8…', 'Odd numbers always have one left over: 1, 3, 5, 7…', 'Look at the ones digit. If it is 0, 2, 4, 6 or 8, the number is even.'],
        try: 'Pair up socks. Is the number of socks odd or even?' }
    ]
  };
  C['2-ela'] = {
    t: '2nd Grade Reading & Writing', r: [['Khan Academy · 2nd grade reading & vocabulary', KA + 'ela/cc-2nd-reading-vocab'], ['Storyline Online', 'https://storylineonline.net/library']],
    u: [
      { t: 'Nouns and verbs',
        l: ['A noun names a person, place, thing or animal: teacher, park, ball, dog.', 'A verb shows action: run, jump, read, sing.', 'Every sentence needs a noun (who) and a verb (what they did).'],
        try: 'Find 5 nouns and 5 verbs in your favorite book.',
        q: [['Which word is a noun?', 'garden', 'jump', 'quickly', 'happy'], ['Which word is a verb?', 'swim', 'table', 'blue', 'under'], ['In "The frog hopped," which word is the verb?', 'hopped', 'frog', 'The', 'none']] },
      { t: 'Adjectives',
        l: ['Adjectives describe nouns. They tell what kind, how many or which one.', 'Example: the fluffy cat, three apples, that red bike.', 'Adjectives make writing more interesting.'],
        try: 'Describe your lunch using 4 adjectives.',
        q: [['Which word is an adjective?', 'shiny', 'run', 'car', 'quickly'], ['In "the tall giraffe," which word is the adjective?', 'tall', 'the', 'giraffe', 'none'], ['Which adjective tells how many?', 'five', 'green', 'soft', 'loud']] },
      { t: 'Main topic of a text', r: [['Khan Academy · 2nd grade reading', KA + 'ela/cc-2nd-reading-vocab']],
        l: ['The main topic is what a whole text is mostly about.', 'Titles and headings are clues to the main topic.', 'Details are smaller facts that tell more about the topic.'],
        try: 'Read a short nonfiction article. Say its main topic in one sentence.',
        q: [['The main topic is…', 'What the text is mostly about', 'The last word', 'The author\'s name', 'One small detail'], ['A text tells how bees make honey, live in hives and help flowers. Its main topic is…', 'Bees', 'Flowers', 'Honey jars', 'Hives only'], ['Where can you find a clue to the main topic?', 'The title', 'The page number', 'The copyright', 'The barcode']] },
      { t: 'Comparing two stories', r: [['Storyline Online · Library Lion', 'https://storylineonline.net/books/library-lion']],
        l: ['Two stories can have the same problem but different characters or endings.', 'Compare: how are they alike? Contrast: how are they different?', 'A Venn diagram helps you sort alike and different.'],
        try: 'Read two versions of "The Three Little Pigs." Fill in a Venn diagram.',
        q: [['To contrast means to tell how things are…', 'Different', 'Alike', 'Long', 'Funny'], ['What tool helps compare two stories?', 'A Venn diagram', 'A ruler', 'A calendar', 'A clock'], ['To compare means to tell how things are…', 'Alike', 'Lost', 'Broken', 'Hidden']] },
      { t: 'Plural nouns',
        l: ['Most nouns add -s to mean more than one: cat → cats.', 'Add -es after s, x, ch, sh: box → boxes, bus → buses.', 'Some plurals are irregular: child → children, mouse → mice, foot → feet.'],
        try: 'Write the plural of 10 things in your kitchen.',
        q: [['What is the plural of "box"?', 'boxes', 'boxs', 'boxies', 'box'], ['What is the plural of "child"?', 'children', 'childs', 'childes', 'childrens'], ['What is the plural of "mouse"?', 'mice', 'mouses', 'mousees', 'meese']] }
    ]
  };
  C['2-sci'] = {
    t: '2nd Grade Science', r: [['PhET simulations', 'https://phet.colorado.edu/'], ['NASA Space Place · Earth', 'https://spaceplace.nasa.gov/menu/earth/']],
    u: [
      { t: 'Solids, liquids and gases',
        l: ['Matter is anything that takes up space. It can be a solid, liquid or gas.', 'Solids keep their shape. Liquids take the shape of their container. Gases spread out to fill space.', 'Heating and cooling can change matter: ice melts into water.'],
        try: 'Freeze water in an ice tray, then watch it melt on a plate.',
        q: [['Which is a liquid?', 'Milk', 'A rock', 'Steam', 'A pencil'], ['What happens when ice is heated?', 'It melts', 'It gets harder', 'It turns to stone', 'Nothing'], ['Which state of matter spreads out to fill a room?', 'Gas', 'Solid', 'Liquid', 'None']] },
      { t: 'Habitats',
        l: ['A habitat is where a plant or animal lives and finds what it needs.', 'Deserts are dry. Rainforests are wet and warm. Oceans are salty water.', 'Animals have body parts that fit their habitat, like a camel\'s hump.'],
        try: 'Choose an animal and draw it in its habitat.',
        q: [['A habitat is…', 'Where a living thing lives', 'A type of food', 'A kind of rock', 'A season'], ['Which habitat is very dry?', 'Desert', 'Ocean', 'Rainforest', 'Pond'], ['Where do whales live?', 'Ocean', 'Desert', 'Forest floor', 'Mountains']] },
      { t: 'How land changes',
        l: ['Wind and water slowly wear away rock and soil. This is erosion.', 'Some changes are fast: earthquakes, volcanoes, floods.', 'Plants with roots help hold soil in place.'],
        try: 'Make a sand hill in a tray and pour water on it. Then try again with grass on top.',
        q: [['Erosion is when wind or water…', 'Wears away land', 'Builds a house', 'Makes rain', 'Freezes rocks'], ['Which is a fast change to land?', 'An earthquake', 'A river wearing a canyon', 'Wind smoothing rock', 'Soil forming']] .concat([['What helps stop soil from washing away?', 'Plant roots', 'Plastic bags', 'Loud noises', 'More rain']]) },
      { t: 'Pollination and seeds',
        l: ['Many plants need animals to move pollen from flower to flower.', 'Bees, butterflies and hummingbirds are pollinators.', 'Seeds are spread by wind, water and animals.'],
        try: 'Find seeds in fruit at home. How might each one get spread?',
        q: [['Which animal is a pollinator?', 'Bee', 'Shark', 'Snake', 'Worm'], ['Pollinators move…', 'Pollen', 'Rocks', 'Water', 'Leaves'], ['A dandelion seed is spread mostly by…', 'Wind', 'Fire', 'Snow', 'Ice']] },
      { t: 'Properties of materials',
        l: ['Properties describe what a material is like: color, texture, hardness, flexibility.', 'We choose materials for their properties: glass for windows because it is clear.', 'Some materials float and some sink.'],
        try: 'Test 8 objects in a bowl of water. Predict, then check: sink or float?',
        q: [['Why is glass used for windows?', 'It is clear', 'It is soft', 'It is stretchy', 'It is heavy']] .concat([['Which material is best for a raincoat?', 'Waterproof plastic', 'Paper', 'Cotton balls', 'Sponge'], ['Hardness, color and texture are all…', 'Properties', 'Habitats', 'Seasons', 'Fractions']]) }
    ]
  };
  C['2-soc'] = {
    t: '2nd Grade Social Studies', r: [["Ben's Guide to the U.S. Government", 'https://bensguide.gpo.gov/']],
    u: [
      { t: 'Kinds of communities',
        l: ['Urban communities are cities with many people and tall buildings.', 'Suburban communities are near cities with houses and yards.', 'Rural communities are in the country, with farms and open land.'],
        try: 'Is your community urban, suburban or rural? List 3 clues.',
        q: [['A big city is an ___ community.', 'urban', 'rural', 'suburban', 'ocean'], ['Farms are usually found in ___ communities.', 'rural', 'urban', 'downtown', 'underground'], ['A community near a city with houses and yards is…', 'suburban', 'rural', 'urban', 'tropical']] },
      { t: 'Goods and services',
        l: ['Goods are things you can touch and buy: bread, shoes, books.', 'Services are jobs people do for others: cutting hair, teaching, fixing cars.', 'Producers make goods or give services. Consumers buy and use them.'],
        try: 'On your next errand, spot 3 goods and 3 services.',
        q: [['Which is a service?', 'A haircut', 'A loaf of bread', 'A toy', 'A pair of shoes'], ['Which is a good?', 'An apple', 'A doctor visit', 'A bus ride', 'A music lesson'], ['A person who buys and uses goods is a…', 'Consumer', 'Producer', 'Mayor', 'Pilot']] },
      { t: 'Landforms and water',
        l: ['Landforms are shapes of land: mountains, hills, valleys, plains, islands.', 'An island has water all around it. A peninsula has water on three sides.', 'Bodies of water include oceans, lakes and rivers.'],
        try: 'Make landforms with play dough: a mountain, a valley and an island.',
        q: [['Land with water all around it is an…', 'Island', 'Plain', 'Valley', 'Mountain'], ['Land with water on three sides is a…', 'Peninsula', 'Island', 'Hill', 'Desert'], ['The largest bodies of water are…', 'Oceans', 'Ponds', 'Puddles', 'Streams']] },
      { t: 'Timelines and the past',
        l: ['A timeline shows events in the order they happened.', 'The past is what already happened. The present is now. The future is still to come.', 'Old photos, letters and objects teach us about the past.'],
        try: 'Make a timeline of your life with 5 important events.',
        q: [['A timeline shows events…', 'In order', 'By color', 'By size', 'At random']] .concat([['"Yesterday" is in the…', 'Past', 'Future', 'Present', 'Weekend'], ['Which teaches us about the past?', 'An old photograph', 'Tomorrow\'s weather', 'A new phone', 'A future plan']]) },
      { t: 'Being a good citizen', r: [['iCivics · Neighborhood Good', 'https://ed.icivics.org/resources/game/1814/neighborhood-good']],
        l: ['A citizen is a member of a community or country.', 'Good citizens follow laws, help others and take care of shared places.', 'Voting is one way adult citizens make choices together.'],
        try: 'Do one helpful thing for your neighborhood this week, like picking up litter.',
        q: [['Which shows good citizenship?', 'Picking up litter at a park', 'Breaking rules', 'Taking turns only sometimes', 'Ignoring others'], ['A citizen is…', 'A member of a community or country', 'Only a president', 'A kind of map', 'A building'], ['How do adult citizens choose leaders?', 'By voting', 'By guessing', 'By drawing', 'By racing']] }
    ]
  };

  /* ───────────── GRADE 3 ───────────── */
  C['3-math'] = {
    t: '3rd Grade Math', r: [['Khan Academy · 3rd grade math', KA + 'math/cc-third-grade-math']],
    u: [
      { t: 'Multiplication facts', g: 'mult10',
        l: ['Multiplication is repeated addition: 4 × 3 = 3 + 3 + 3 + 3 = 12.', 'Arrays show multiplication as rows and columns.', 'Order does not matter: 6 × 7 = 7 × 6 = 42.'],
        try: 'Practice the 6s, 7s and 8s with flash cards for 5 minutes.' },
      { t: 'Division facts', g: 'div10',
        l: ['Division splits a total into equal groups: 24 ÷ 6 = 4.', 'Every division fact has a matching multiplication fact: 4 × 6 = 24.', 'Dividing by 1 leaves the number the same.'],
        try: 'Share 24 grapes equally among 3, 4 and 6 people.' },
      { t: 'Rounding', g: 'round',
        l: ['Rounding gives a number that is close and easier to use.', 'To round to the nearest ten, look at the ones digit: 5 or more rounds up, 4 or less rounds down.', '347 rounds to 350 (nearest ten) and 300 (nearest hundred).'],
        try: 'Round the prices on a receipt to the nearest ten cents.' },
      { t: 'Understanding fractions', g: 'fracCompare',
        l: ['A fraction names equal parts of a whole. In 3/4, the whole is cut into 4 parts and we have 3.', 'The bottom number (denominator) is how many equal parts. The top (numerator) is how many we have.', 'With the same numerator, more parts means smaller pieces: 1/8 is less than 1/4.'],
        try: 'Fold paper into halves, fourths and eighths and compare the pieces.' },
      { t: 'Area and perimeter', g: 'areaPerim',
        l: ['Perimeter is the distance around a shape. Add all the sides.', 'Area is the space inside. For a rectangle, area = length × width.', 'Area is measured in square units, like square feet.'],
        try: 'Measure your bed or table and find its perimeter and area.' }
    ]
  };
  C['3-ela'] = {
    t: '3rd Grade Reading & Writing', r: [['Khan Academy · 3rd grade reading & vocabulary', KA + 'ela/cc-3rd-reading-vocab'], ['CommonLit text library', 'https://www.commonlit.org/texts']],
    u: [
      { t: 'Main idea and key details', r: [['Khan Academy · 3rd grade reading', KA + 'ela/cc-3rd-reading-vocab']],
        l: ['The main idea is the most important point of a paragraph or text.', 'Key details support the main idea with facts and examples.', 'Ask: What does the author want me to know most?'],
        try: 'Read a magazine article. Write its main idea and 3 key details.',
        q: [['Key details…', 'Support the main idea', 'Are always in the title', 'Have nothing to do with the text', 'Are the author\'s name'], ['A paragraph says owls hunt at night, see well in the dark and fly silently. Its main idea is…', 'Owls are built for hunting at night', 'Owls are brown', 'Night is dark', 'Birds can fly']] .concat([['Where is the main idea often found?', 'In the first or last sentence', 'In the page number', 'In a picture caption only', 'Nowhere']]) },
      { t: 'Context clues',
        l: ['Context clues are hints in the nearby words that help you figure out a new word.', 'Look for examples, definitions or opposites in the sentence.', '"The arid desert had no water for miles." Arid means very dry.'],
        try: 'Find 3 new words in a book and use context clues to guess their meaning. Check a dictionary.',
        q: [['"The enormous elephant was bigger than the truck." Enormous means…', 'Very large', 'Very small', 'Very fast', 'Very quiet'], ['"She was famished after skipping lunch." Famished means…', 'Very hungry', 'Sleepy', 'Angry', 'Full'], ['Context clues are found…', 'In the words around a new word', 'Only in a dictionary', 'On the cover', 'In the index']] },
      { t: 'Fables and morals', r: [['CommonLit · The Lion and the Mouse', 'https://www.commonlit.org/texts/the-lion-and-the-mouse']],
        l: ['A fable is a short story, often with animals, that teaches a lesson.', 'The lesson is called the moral.', 'In "The Lion and the Mouse," a tiny mouse saves a lion. Moral: even small friends can help in big ways.'],
        try: 'Read "The Lion and the Mouse" and write the moral in your own words.',
        q: [['The lesson of a fable is called the…', 'Moral', 'Setting', 'Title', 'Glossary'], ['Fables often have characters that are…', 'Talking animals', 'Robots', 'Real presidents', 'Numbers'], ['"The Tortoise and the Hare" teaches that…', 'Slow and steady can win', 'Fast always wins', 'Racing is bad', 'Turtles cannot run']] },
      { t: 'Writing a paragraph',
        l: ['A paragraph has a topic sentence, supporting details and a closing sentence.', 'All sentences in a paragraph stick to one idea.', 'Use linking words: also, another, because, for example.'],
        try: 'Write a 5-sentence paragraph about your favorite animal.',
        q: [['The first sentence that tells what a paragraph is about is the…', 'Topic sentence', 'Closing sentence', 'Title', 'Detail'], ['Which word links ideas?', 'because', 'purple', 'jump', 'table'], ['All sentences in a paragraph should…', 'Be about one idea', 'Be about different topics', 'Be questions', 'Be one word long']] },
      { t: 'Homophones',
        l: ['Homophones sound the same but have different spellings and meanings.', 'there (a place), their (belongs to them), they\'re (they are).', 'to, too, two · your, you\'re · its, it\'s.'],
        try: 'Write a silly sentence that uses there, their and they\'re correctly.',
        q: [['Choose the right word: "___ going to the park."', 'They\'re', 'Their', 'There', 'Thier'], ['Choose the right word: "I have ___ dogs."', 'two', 'to', 'too', 'tow'], ['Choose the right word: "Is this ___ book?"', 'your', 'you\'re', 'yore', 'youre']] }
    ]
  };
  C['3-sci'] = {
    t: '3rd Grade Science', r: [['PhET simulations', 'https://phet.colorado.edu/'], ['NASA Space Place · Earth', 'https://spaceplace.nasa.gov/menu/earth/']],
    u: [
      { t: 'Life cycles',
        l: ['Every living thing has a life cycle: birth, growth, reproduction and death.', 'A butterfly goes through egg → larva (caterpillar) → pupa (chrysalis) → adult.', 'Plants go from seed → seedling → adult plant → flowers and new seeds.'],
        try: 'Draw the life cycle of a frog or butterfly as a circle diagram.',
        q: [['What comes after the caterpillar stage?', 'Pupa (chrysalis)', 'Egg', 'Adult butterfly right away', 'Seed'], ['A young plant that just sprouted is a…', 'Seedling', 'Larva', 'Pupa', 'Fossil'], ['All life cycles include…', 'Growth', 'Flying', 'Swimming', 'Hibernation']] },
      { t: 'Inherited traits',
        l: ['Traits are features of a living thing, like eye color or leaf shape.', 'Inherited traits are passed from parents to offspring.', 'Some traits are affected by the environment, like a plant growing taller with more sun.'],
        try: 'Compare a family photo: which traits do relatives share?',
        q: [['Eye color is an example of an…', 'Inherited trait', 'Environment only', 'Learned skill', 'Weather pattern'], ['Riding a bike is a…', 'Learned behavior', 'Inherited trait', 'Life cycle', 'Habitat']] .concat([['Traits passed from parents to young are…', 'Inherited', 'Invented', 'Borrowed', 'Purchased']]) },
      { t: 'Weather and climate',
        l: ['Weather is what the air is like today: temperature, rain, wind.', 'Climate is the usual weather of a place over many years.', 'Tools: thermometer (temperature), rain gauge (rain), anemometer (wind speed).'],
        try: 'Keep a weather journal for 7 days.',
        q: [['The usual weather of a place over many years is its…', 'Climate', 'Forecast', 'Season', 'Temperature'], ['Which tool measures temperature?', 'Thermometer', 'Rain gauge', 'Ruler', 'Compass'], ['"It is rainy and cold today" describes…', 'Weather', 'Climate', 'A habitat', 'A landform']] },
      { t: 'Forces and motion', r: [['PhET simulations', 'https://phet.colorado.edu/']],
        l: ['A force is a push or a pull.', 'Balanced forces do not change motion. Unbalanced forces make things start, stop or change direction.', 'Magnets push or pull certain metals without touching them.'],
        try: 'Roll a ball on carpet and on a smooth floor. Which goes farther and why?',
        q: [['A force is a…', 'Push or pull', 'Color', 'Sound', 'Shape'], ['What makes an object start moving?', 'An unbalanced force', 'Balanced forces', 'No force', 'Shadows'], ['Magnets attract…', 'Iron', 'Wood', 'Plastic', 'Paper']] },
      { t: 'Fossils',
        l: ['Fossils are remains or traces of living things from long ago, preserved in rock.', 'Fossils show us plants and animals that lived in the past, like dinosaurs.', 'A fish fossil on a mountain shows the area was once under water.'],
        try: 'Press a shell into clay to make a "fossil" imprint.',
        q: [['Fossils are usually found in…', 'Rock', 'Clouds', 'Fresh fruit', 'Glass'], ['A fish fossil on a mountain tells us…', 'The land was once under water', 'Fish can climb', 'Mountains are new', 'Nothing']] .concat([['Fossils help us learn about…', 'Life long ago', 'Tomorrow\'s weather', 'Future inventions', 'Planets only']]) }
    ]
  };
  C['3-soc'] = {
    t: '3rd Grade Social Studies', r: [["Ben's Guide · Ages 9 to 13", 'https://bensguide.gpo.gov/learning-adventures-14more%3Fid%3D38%26age%3Dben9_13'], ['iCivics student games', 'https://ed.icivics.org/students']],
    u: [
      { t: 'Communities change over time',
        l: ['Communities grow and change: roads are built, jobs change, people move.', 'Primary sources (old photos, letters) come from people who were there.', 'Comparing then and now shows how life changed.'],
        try: 'Ask an older relative how your town was different when they were your age.',
        q: [['A diary written long ago by someone who was there is a…', 'Primary source', 'Secondary source', 'Map key', 'Glossary'], ['Which is a way communities change?', 'New roads are built', 'The sun stops rising', 'Rivers turn to stone', 'Nothing ever changes'], ['"Then and now" compares…', 'The past and the present', 'Two maps of Mars', 'Two kinds of food', 'Two numbers']] },
      { t: 'Local government',
        l: ['Local government runs a town or city.', 'A mayor leads a city. A city council makes local laws.', 'Taxes pay for services like schools, parks, police and firefighters.'],
        try: 'Find out the name of your mayor or local leader.',
        q: [['Who leads a city?', 'Mayor', 'President', 'King', 'Principal'], ['What pays for parks and fire departments?', 'Taxes', 'Allowance', 'Contests', 'Lemonade stands'], ['A group that makes city laws is the…', 'City council', 'Supreme Court', 'School board only', 'Library']] },
      { t: 'Map skills',
        l: ['The cardinal directions are north, south, east and west.', 'A compass rose shows directions on a map.', 'A map scale shows how distance on the map compares to real distance.'],
        try: 'Use a map of your area to give directions from home to a park.',
        q: [['Which is a cardinal direction?', 'North', 'Up', 'Left', 'Forward'], ['What shows directions on a map?', 'Compass rose', 'Title', 'Key', 'Border'], ['The map scale shows…', 'Real distance', 'Weather', 'Population', 'Colors']] },
      { t: 'Producers and consumers',
        l: ['Producers make goods or provide services. Consumers use them.', 'Scarcity means there is not enough of something for everyone who wants it.', 'Because of scarcity, people make choices. What you give up is the opportunity cost.'],
        try: 'Pretend you have $10. Pick between two things you want and name your opportunity cost.',
        q: [['A farmer who grows apples is a…', 'Producer', 'Consumer', 'Mayor', 'Judge'], ['Not having enough of something is…', 'Scarcity', 'Plenty', 'Saving', 'Trading']] .concat([['If you choose a book instead of a game, the game is your…', 'Opportunity cost', 'Profit', 'Tax', 'Salary']]) },
      { t: 'Cultures and traditions',
        l: ['Culture is the way of life of a group: food, language, music, holidays, beliefs.', 'Traditions are customs passed down over time.', 'Communities are richer when many cultures share their traditions.'],
        try: 'Interview a family member about a tradition and why it matters.',
        q: [['Culture includes…', 'Food, language and holidays', 'Only the weather', 'Only rocks', 'Only numbers'], ['A custom passed down over years is a…', 'Tradition', 'Law', 'Map', 'Fossil']] .concat([['Which is part of a culture?', 'Music', 'Gravity', 'Sunlight', 'Erosion']]) }
    ]
  };

  /* ───────────── GRADE 4 ───────────── */
  C['4-math'] = {
    t: '4th Grade Math', r: [['Khan Academy · 4th grade math', KA + 'math/cc-fourth-grade-math']],
    u: [
      { t: 'Multi-digit multiplication', g: 'multMulti',
        l: ['Break numbers into place values: 34 × 6 = (30 × 6) + (4 × 6) = 180 + 24 = 204.', 'For 2-digit × 2-digit, multiply by the ones, then the tens, and add.', 'Estimate first to check: 34 × 6 is close to 30 × 6 = 180.'],
        try: 'How many hours are in 14 days? (24 × 14)' },
      { t: 'Division with remainders', g: 'divRem',
        l: ['When things do not split evenly, the leftover is the remainder.', '47 ÷ 5 = 9 R2 because 9 × 5 = 45, and 47 − 45 = 2.', 'The remainder is always smaller than the divisor.'],
        try: 'Share 50 cards among 7 players. How many each, and how many left?' },
      { t: 'Equivalent fractions', g: 'equivFrac',
        l: ['Equivalent fractions name the same amount: 1/2 = 2/4 = 4/8.', 'Multiply (or divide) the top and bottom by the same number.', 'Use equivalent fractions to compare: 2/3 vs 3/4 → 8/12 vs 9/12.'],
        try: 'Cut a pizza drawing to show 1/2 = 3/6.' },
      { t: 'Decimals: tenths and hundredths', g: 'decCompare',
        l: ['0.7 means 7 tenths. 0.07 means 7 hundredths.', '0.5 = 0.50 = 50/100.', 'Compare decimals by place value, starting with tenths.'],
        try: 'Compare prices like $0.89 and $0.9 — which is more?' },
      { t: 'Angles', g: 'angles',
        l: ['Angles are measured in degrees. A right angle is 90°. A straight line is 180°.', 'Acute angles are less than 90°. Obtuse angles are between 90° and 180°.', 'Angles that make a straight line add to 180°.'],
        try: 'Find right, acute and obtuse angles around the house.' }
    ]
  };
  C['4-ela'] = {
    t: '4th Grade Reading & Writing', r: [['Khan Academy · 4th grade reading & vocabulary', KA + 'ela/cc-4th-reading-vocab'], ['CommonLit text library', 'https://www.commonlit.org/texts']],
    u: [
      { t: 'Theme', r: [['CommonLit · Stray', 'https://www.commonlit.org/texts/stray']],
        l: ['The theme is the big message or lesson of a story.', 'A theme is a full statement, like "Kindness can change someone\'s mind," not one word.', 'Look at how the main character changes to find the theme.'],
        try: 'Read "Stray" by Cynthia Rylant and write its theme in one sentence.',
        q: [['The theme of a story is…', 'Its big message', 'Its setting', 'Its length', 'Its first word'], ['Which is written as a theme?', 'Honesty is worth the risk.', 'Friendship', 'A dog', 'Winter'], ['A clue to the theme is…', 'How the main character changes', 'The page count', 'The font', 'The price']] },
      { t: 'Point of view',
        l: ['First person: the narrator is a character and uses I, me, we.', 'Third person: the narrator is outside the story and uses he, she, they.', 'Point of view changes what the reader knows.'],
        try: 'Rewrite one paragraph of a story from another character\'s point of view.',
        q: [['"I grabbed my backpack and ran." This is…', 'First person', 'Third person', 'Second person', 'No point of view'], ['"She grabbed her backpack and ran." This is…', 'Third person', 'First person', 'Second person', 'A poem'], ['First-person narrators use…', 'I and me', 'He and she', 'They only', 'You only']] },
      { t: 'Figurative language',
        l: ['A simile compares using like or as: "fast as a cheetah."', 'A metaphor compares without like or as: "The classroom was a zoo."', 'Personification gives human traits to things: "The wind whispered."'],
        try: 'Write 2 similes and 1 metaphor about your pet or favorite place.',
        q: [['"Her smile was as bright as the sun" is a…', 'Simile', 'Metaphor', 'Personification', 'Fact'], ['"Time is a thief" is a…', 'Metaphor', 'Simile', 'Rhyme', 'Question'], ['"The leaves danced in the wind" is…', 'Personification', 'Simile', 'Fact', 'Onomatopoeia']] },
      { t: 'Text structure',
        l: ['Authors organize nonfiction in patterns called text structures.', 'Common structures: sequence, compare and contrast, cause and effect, problem and solution.', 'Signal words help: first/then (sequence), because/so (cause and effect).'],
        try: 'Find a nonfiction article and decide which structure it uses.',
        q: [['Signal words "because" and "as a result" show…', 'Cause and effect', 'Sequence', 'Description', 'Rhyme'], ['A text explaining how pollution hurts rivers and how to fix it uses…', 'Problem and solution', 'Sequence', 'Poetry', 'Dialogue'], ['"First, next, finally" signal…', 'Sequence', 'Compare and contrast', 'Problem and solution', 'Cause and effect']] },
      { t: 'Greek and Latin roots',
        l: ['Many English words come from Greek and Latin roots.', 'tele = far (telephone), photo = light (photograph), port = carry (transport).', 'Knowing roots helps you decode new words.'],
        try: 'List 5 words with the root "graph" (write) and define each.',
        q: [['The root "tele" means…', 'Far', 'Light', 'Water', 'Small'], ['The root "port" means…', 'Carry', 'Write', 'See', 'Hear'], ['"Biology" contains "bio," which means…', 'Life', 'Earth', 'Book', 'Fire']] }
    ]
  };
  C['4-sci'] = {
    t: '4th Grade Science', r: [['PhET simulations', 'https://phet.colorado.edu/'], ['NASA Space Place', 'https://spaceplace.nasa.gov/']],
    u: [
      { t: 'Energy',
        l: ['Energy is the ability to cause change. It comes in forms like motion, heat, light, sound and electricity.', 'Energy transfers from one place to another: a moving ball hits another ball.', 'Faster objects have more energy of motion.'],
        try: 'Roll a ball from different heights of a ramp. How far does it push a cup?',
        q: [['Which is a form of energy?', 'Light', 'Rock', 'Water bottle', 'Paper']] .concat([['A faster-moving object has…', 'More energy', 'Less energy', 'No energy', 'The same energy as a still one'], ['Rubbing your hands together changes motion energy into…', 'Heat', 'Light only', 'Sound only', 'Matter']]) },
      { t: 'Waves',
        l: ['Waves carry energy from one place to another without moving matter along with it.', 'Wavelength is the distance between peaks. Amplitude is the height of the wave.', 'Sound travels in waves. Light also travels as waves.'],
        try: 'Shake a jump rope to make waves. Change how fast you shake it.',
        q: [['The height of a wave is its…', 'Amplitude', 'Wavelength', 'Speed', 'Color'], ['Waves carry…', 'Energy', 'Sand', 'Fish', 'Nothing']] .concat([['The distance between two wave peaks is the…', 'Wavelength', 'Amplitude', 'Frequency', 'Echo']]) },
      { t: 'Rocks and erosion',
        l: ['Weathering breaks rocks into smaller pieces. Erosion carries them away.', 'Water, wind, ice and gravity cause weathering and erosion.', 'Rock layers can show how land changed over time.'],
        try: 'Shake sugar cubes in a jar for 2 minutes. What happened to the corners?',
        q: [['Breaking rock into pieces is…', 'Weathering', 'Melting', 'Freezing water', 'Photosynthesis'], ['Moving broken rock to a new place is…', 'Erosion', 'Weathering', 'Condensation', 'Gravity only']] .concat([['Which can cause erosion?', 'Flowing water', 'Moonlight', 'Sound', 'Shadows']]) },
      { t: 'Animal and plant structures',
        l: ['Structures are body parts that help living things survive.', 'A bird\'s beak shape matches its food. A cactus stores water in its stem.', 'Senses take in information. The brain processes it.'],
        try: 'Compare the beaks of 3 birds and guess what each eats.',
        q: [['A cactus stores water in its…', 'Stem', 'Roots only', 'Flowers', 'Thorns']] .concat([['A duck\'s webbed feet help it…', 'Swim', 'Climb trees', 'Dig', 'Fly faster'], ['What processes information from the senses?', 'The brain', 'The stomach', 'The bones', 'The skin']]) },
      { t: 'Natural resources and energy',
        l: ['Renewable resources can be replaced naturally: sunlight, wind, water, trees.', 'Nonrenewable resources take millions of years to form: coal, oil, natural gas.', 'Using resources wisely helps the environment.'],
        try: 'Do a home energy hunt: what uses electricity, and how can you save some?',
        q: [['Which is renewable?', 'Wind', 'Coal', 'Oil', 'Natural gas'], ['Which is nonrenewable?', 'Oil', 'Sunlight', 'Wind', 'Trees']] .concat([['Turning off lights helps…', 'Save energy', 'Make more coal', 'Waste water', 'Nothing']]) }
    ]
  };
  C['4-soc'] = {
    t: '4th Grade Social Studies', r: [["Ben's Guide · Ages 9 to 13", 'https://bensguide.gpo.gov/learning-adventures-14more%3Fid%3D38%26age%3Dben9_13']],
    u: [
      { t: 'Regions of the United States',
        l: ['The U.S. is often split into 5 regions: Northeast, Southeast, Midwest, Southwest and West.', 'Regions share geography, climate and economy.', 'The Midwest is known for farming. The West has the Rocky Mountains and the Pacific coast.'],
        try: 'Color a U.S. map by region. Label your state.',
        q: [['Which region is known for farming and the Great Plains?', 'Midwest', 'Northeast', 'Southwest', 'Southeast'], ['The Rocky Mountains are in the…', 'West', 'Southeast', 'Northeast', 'Midwest']] .concat([['How many U.S. states are there?', '50', '48', '52', '13']]) },
      { t: 'Native American nations',
        l: ['Many Native nations lived across North America long before Europeans arrived.', 'Each nation adapted to its environment: Plains nations followed bison; Pacific Northwest nations fished salmon.', 'Native nations continue today with their own governments and cultures.'],
        try: 'Research one Native nation from your region. Where did they live and what did they eat?',
        q: [['Plains nations depended heavily on…', 'Bison', 'Salmon', 'Whales', 'Rice']] .concat([['Pacific Northwest nations were known for fishing…', 'Salmon', 'Sharks', 'Tuna in the desert', 'Nothing'], ['Native nations today…', 'Still exist with their own governments', 'All disappeared', 'Live only in museums', 'Are only in stories']]) },
      { t: 'The Age of Exploration',
        l: ['In the 1400s–1600s, European explorers sailed to find trade routes and riches.', 'Columbus reached the Caribbean in 1492. Magellan\'s expedition sailed around the world.', 'Exploration led to trade, but also conflict and disease for Native peoples.'],
        try: 'Trace one explorer\'s route on a world map.',
        q: [['In what year did Columbus reach the Caribbean?', '1492', '1776', '1620', '1812'], ['Whose expedition first sailed around the world?', 'Magellan\'s', 'Columbus\'s', 'Lewis and Clark\'s', 'Washington\'s']] .concat([['Why did many explorers sail west?', 'To find trade routes', 'To find snow', 'To hold elections', 'To build railroads']]) },
      { t: 'State government', r: [["Ben's Guide · Ages 9 to 13", 'https://bensguide.gpo.gov/learning-adventures-14more%3Fid%3D38%26age%3Dben9_13']],
        l: ['Each state has three branches like the national government.', 'The governor leads the executive branch. The state legislature makes laws. State courts interpret them.', 'Each state has a capital city where the government meets.'],
        try: 'Find your state capital and your governor\'s name.',
        q: [['Who leads a state\'s executive branch?', 'Governor', 'Mayor', 'President', 'Senator']] .concat([['Which branch makes state laws?', 'Legislature', 'Courts', 'Governor', 'Police'], ['Where does a state government meet?', 'The state capital', 'Any farm', 'A school', 'The beach']]) },
      { t: 'Natural resources and the economy',
        l: ['Regions use their natural resources to make a living: forests for lumber, coasts for fishing.', 'Specialization means making what you are best at and trading for the rest.', 'Trade connects regions and countries.'],
        try: 'Pick 3 items in your kitchen. Where were they made or grown?',
        q: [['Focusing on making one kind of product is…', 'Specialization', 'Scarcity', 'Erosion', 'Voting']] .concat([['A coastal town might make money by…', 'Fishing', 'Mining in the ocean floor only', 'Growing cactus', 'Skiing']]).concat([['Why do regions trade?', 'To get things they do not make', 'To lose money', 'To stop working', 'To make laws']]) }
    ]
  };
})();
