/* Lantern Homeschool — Language Lab: Spanish 2.
   Moves from single words to phrases and sentences: feelings, likes, numbers 11–20, weather, clothes, the body,
   everyday verbs, places in town, questions, and ordering food. Each lesson has a short story (cuento) with
   comprehension questions and a real-life mission (misión). Latin American Spanish with Dominican touches.
   Item: { es, en, p: emoji picture | n: number }. Story questions: [question, correct, wrong1, wrong2, wrong3]. */
(function () {
  const I = (es, en, pic) => Object.assign({ es, en }, typeof pic === 'number' ? { n: pic } : { p: pic });
  window.LH_SPANISH2 = {
    id: 'es2', name: 'Spanish 2', lang: 'es', units: [
      { id: 'b-siento', t: '¿Cómo te sientes?', en: 'How do you feel?', items: [
        I('Estoy bien', 'I am fine', '🙂'), I('Estoy mal', 'I feel bad', '😞'), I('Estoy feliz', 'I am happy', '😄'), I('Estoy triste', 'I am sad', '😢'),
        I('Tengo hambre', 'I am hungry', '🍽️'), I('Tengo sed', 'I am thirsty', '🚰'), I('Tengo sueño', 'I am sleepy', '🥱'), I('Tengo frío', 'I am cold', '🥶')],
        story: { es: 'Hola, soy Leo. Hoy estoy feliz. Tengo hambre y como una manzana. Después tengo sueño y duermo.', en: 'Hi, I\'m Leo. Today I am happy. I am hungry and I eat an apple. Then I am sleepy and I sleep.',
          q: [['¿Cómo está Leo hoy?', 'Feliz', 'Triste', 'Mal', 'Enojado'], ['¿Qué come Leo?', 'Una manzana', 'Pan', 'Arroz', 'Queso'], ['¿Qué hace Leo después?', 'Duerme', 'Corre', 'Canta', 'Nada']] },
        mission: { es: 'Pregúntale a alguien de tu familia: "¿Cómo estás?" y contesta cuando te pregunten a ti.', en: 'Ask someone in your family "How are you?" and answer when they ask you.' } },
      { id: 'b-gusta', t: 'Me gusta', en: 'I like', items: [
        I('Me gusta el fútbol', 'I like soccer', '⚽'), I('Me gusta leer', 'I like to read', '📚'), I('Me gusta nadar', 'I like to swim', '🌊🏊'), I('Me gusta la música', 'I like music', '🎵'),
        I('Me gusta bailar', 'I like to dance', '💃'), I('Me gusta dibujar', 'I like to draw', '🎨'), I('Me gustan los perros', 'I like dogs', '🐕🐕'), I('No me gusta la lluvia', 'I don\'t like rain', '🌧️🙅')],
        story: { es: 'Me llamo Ana. Me gusta bailar y me gusta la música. No me gusta la lluvia. Mi hermano juega béisbol todos los días.', en: 'My name is Ana. I like to dance and I like music. I don\'t like rain. My brother plays baseball every day.',
          q: [['¿Qué le gusta a Ana?', 'Bailar', 'Nadar', 'Dibujar', 'Leer'], ['¿Qué no le gusta a Ana?', 'La lluvia', 'La música', 'El sol', 'Los perros'], ['¿Qué juega su hermano?', 'Béisbol', 'Fútbol', 'Tenis', 'Ajedrez']] },
        mission: { es: 'Dile a alguien tres cosas que te gustan: "Me gusta…".', en: 'Tell someone three things you like: "Me gusta…".' } },
      { id: 'b-num', t: 'Los números 11–20', en: 'Numbers 11–20', items: [
        I('once', 'eleven', 11), I('doce', 'twelve', 12), I('trece', 'thirteen', 13), I('catorce', 'fourteen', 14), I('quince', 'fifteen', 15),
        I('dieciséis', 'sixteen', 16), I('diecisiete', 'seventeen', 17), I('dieciocho', 'eighteen', 18), I('diecinueve', 'nineteen', 19), I('veinte', 'twenty', 20)],
        story: { es: 'En la clase hay doce niños y quince niñas. Hay veinte libros y once lápices.', en: 'In the class there are twelve boys and fifteen girls. There are twenty books and eleven pencils.',
          q: [['¿Cuántos niños hay?', 'Doce', 'Quince', 'Veinte', 'Once'], ['¿Cuántos libros hay?', 'Veinte', 'Doce', 'Diez', 'Quince'], ['¿Cuántas niñas hay?', 'Quince', 'Doce', 'Cinco', 'Trece']] },
        mission: { es: 'Cuenta del 1 al 20 en español mientras saltas o subes escaleras.', en: 'Count from 1 to 20 in Spanish while you jump or climb stairs.' } },
      { id: 'b-tiempo', t: 'El tiempo', en: 'The weather', items: [
        I('Hace sol', 'It\'s sunny', '☀️'), I('Hace calor', 'It\'s hot', '🥵'), I('Hace frío', 'It\'s cold', '❄️'), I('Hace viento', 'It\'s windy', '🌬️'),
        I('Llueve', 'It\'s raining', '🌧️'), I('Está nublado', 'It\'s cloudy', '☁️'), I('Hay una tormenta', 'There\'s a storm', '⛈️'), I('Hay un arcoíris', 'There\'s a rainbow', '🌈')],
        story: { es: 'Hoy hace sol y hace calor. Vamos a la playa. En la tarde llueve, pero después hay un arcoíris.', en: 'Today it\'s sunny and hot. We go to the beach. In the afternoon it rains, but then there\'s a rainbow.',
          q: [['¿Qué tiempo hace hoy?', 'Hace sol', 'Hace frío', 'Nieva', 'Hace viento'], ['¿Adónde van?', 'A la playa', 'A la escuela', 'Al parque', 'Al hospital'], ['¿Qué hay después de la lluvia?', 'Un arcoíris', 'Una tormenta', 'Nieve', 'Un perro']] },
        mission: { es: 'Cada mañana esta semana, mira por la ventana y di el tiempo en español.', en: 'Every morning this week, look out the window and say the weather in Spanish.' } },
      { id: 'b-ropa', t: 'La ropa', en: 'Clothes', items: [
        I('la camisa', 'the shirt', '👕'), I('los pantalones', 'the pants', '👖'), I('el vestido', 'the dress', '👗'), I('los zapatos', 'the shoes', '👟'),
        I('la gorra', 'the cap', '🧢'), I('el sombrero', 'the hat', '👒'), I('los calcetines', 'the socks', '🧦'), I('la chaqueta', 'the jacket', '🧥')],
        story: { es: 'Hace frío. Sam lleva una chaqueta, pantalones y calcetines. Su hermana lleva un vestido y una gorra.', en: 'It\'s cold. Sam is wearing a jacket, pants and socks. His sister is wearing a dress and a cap.',
          q: [['¿Por qué lleva Sam una chaqueta?', 'Hace frío', 'Hace calor', 'Es su cumpleaños', 'Está en la playa'], ['¿Qué lleva la hermana?', 'Un vestido y una gorra', 'Una chaqueta', 'Unos zapatos rojos', 'Un sombrero'], ['¿Quién lleva calcetines?', 'Sam', 'La hermana', 'Nadie', 'El perro']] },
        mission: { es: 'Mañana, di en español qué ropa llevas: "Hoy llevo…".', en: 'Tomorrow, say in Spanish what you are wearing: "Hoy llevo…".' } },
      { id: 'b-cuerpo', t: 'El cuerpo', en: 'The body', items: [
        I('la cabeza', 'the head', '🙆'), I('la mano', 'the hand', '✋'), I('el pie', 'the foot', '🦶'), I('el ojo', 'the eye', '👁️'),
        I('la nariz', 'the nose', '👃'), I('la boca', 'the mouth', '👄'), I('la oreja', 'the ear', '👂'), I('el diente', 'the tooth', '🦷')],
        story: { es: 'Tengo dos ojos, dos orejas y una nariz. Con las manos escribo. Con los pies corro. Con la boca como.', en: 'I have two eyes, two ears and one nose. I write with my hands. I run with my feet. I eat with my mouth.',
          q: [['¿Con qué escribes?', 'Con las manos', 'Con los pies', 'Con la nariz', 'Con las orejas'], ['¿Cuántas narices tienes?', 'Una', 'Dos', 'Tres', 'Cuatro'], ['¿Con qué corres?', 'Con los pies', 'Con las manos', 'Con los ojos', 'Con la boca']] },
        mission: { es: 'Juega "Simón dice" en español con tu familia: "Simón dice: tócate la nariz".', en: 'Play "Simon says" in Spanish with your family: "Simón dice: tócate la nariz" (touch your nose).' } },
      { id: 'b-yo', t: 'Lo que yo hago', en: 'What I do', items: [
        I('Yo como', 'I eat', '🥄'), I('Yo bebo', 'I drink', '🧃'), I('Yo corro', 'I run', '🏃'), I('Yo leo', 'I read', '📖'),
        I('Yo escribo', 'I write', '✍️'), I('Yo duermo', 'I sleep', '🛌'), I('Yo juego', 'I play', '🎮'), I('Yo canto', 'I sing', '🎶')],
        story: { es: 'Por la mañana yo como y bebo jugo. Después leo y escribo. Por la tarde juego con mis amigos. Por la noche duermo.', en: 'In the morning I eat and drink juice. Then I read and write. In the afternoon I play with my friends. At night I sleep.',
          q: [['¿Qué bebe en la mañana?', 'Jugo', 'Leche', 'Agua', 'Café'], ['¿Cuándo juega con sus amigos?', 'Por la tarde', 'Por la mañana', 'Por la noche', 'Nunca'], ['¿Qué hace por la noche?', 'Duerme', 'Canta', 'Corre', 'Escribe']] },
        mission: { es: 'Mientras haces algo hoy, dilo en español: "Yo como", "Yo leo", "Yo corro"…', en: 'While you do things today, say them in Spanish: "Yo como", "Yo leo", "Yo corro"…' } },
      { id: 'b-pueblo', t: 'En el pueblo', en: 'In town', items: [
        I('el colmado', 'the corner store', '🏪'), I('la playa', 'the beach', '🏖️'), I('el parque', 'the park', '🌳'), I('la iglesia', 'the church', '⛪'),
        I('el hospital', 'the hospital', '🏥'), I('el banco', 'the bank', '🏦'), I('el supermercado', 'the supermarket', '🛒'), I('la panadería', 'the bakery', '🥖')],
        story: { es: 'Mamá va al colmado para comprar pan y leche. Después vamos al parque. El domingo vamos a la iglesia.', en: 'Mom goes to the corner store to buy bread and milk. Then we go to the park. On Sunday we go to church.',
          q: [['¿Adónde va Mamá primero?', 'Al colmado', 'Al banco', 'Al hospital', 'A la playa'], ['¿Qué compra Mamá?', 'Pan y leche', 'Zapatos', 'Libros', 'Pescado'], ['¿Cuándo van a la iglesia?', 'El domingo', 'El lunes', 'Hoy', 'Nunca']] },
        mission: { es: 'Con tu grown-up, nombra en español tres lugares que ves en el pueblo.', en: 'With your grown-up, name three places you see in town in Spanish.' } },
      { id: 'b-preguntas', t: 'Preguntas', en: 'Questions', items: [
        I('¿Cómo te llamas?', 'What\'s your name?', '🙋'), I('¿Cuántos años tienes?', 'How old are you?', '🎂'), I('¿Dónde está el baño?', 'Where is the bathroom?', '🚻'), I('¿Cuánto cuesta?', 'How much does it cost?', '💲'),
        I('¿Qué hora es?', 'What time is it?', '⏰'), I('¿Qué es esto?', 'What is this?', '❓'), I('¿Puedes ayudarme?', 'Can you help me?', '🤝'), I('¿De dónde eres?', 'Where are you from?', '🌎')],
        story: { es: '—Hola, ¿cómo te llamas? —Me llamo Rosa. —¿Cuántos años tienes? —Tengo ocho años. —¿De dónde eres? —Soy de Puerto Plata.', en: '"Hi, what\'s your name?" "My name is Rosa." "How old are you?" "I\'m eight." "Where are you from?" "I\'m from Puerto Plata."',
          q: [['¿Cómo se llama la niña?', 'Rosa', 'Ana', 'Mia', 'Zoe'], ['¿Cuántos años tiene?', 'Ocho', 'Seis', 'Diez', 'Doce'], ['¿De dónde es?', 'De Puerto Plata', 'De Madrid', 'De México', 'De Santiago']] },
        mission: { es: 'En una tienda, con tu grown-up, pregunta: "¿Cuánto cuesta?" y di "Gracias".', en: 'In a store, with your grown-up, ask "How much does it cost?" and say "Thank you."' } },
      { id: 'b-comida', t: 'En el restaurante', en: 'At the restaurant', items: [
        I('Quiero agua', 'I want water', '🙋💧'), I('un jugo de naranja', 'an orange juice', '🍊'), I('arroz con habichuelas', 'rice and beans', '🍛'), I('el pollo', 'the chicken', '🍗'),
        I('la empanada', 'the empanada', '🥟'), I('el postre', 'the dessert', '🍰'), I('¡Está delicioso!', 'It\'s delicious!', '😋'), I('La cuenta, por favor', 'The check, please', '🧾')],
        story: { es: 'En el restaurante, Papá dice: "Quiero arroz con habichuelas y pollo, por favor." Yo quiero una empanada y un jugo de naranja. ¡Está delicioso! Al final, Papá pide la cuenta.', en: 'At the restaurant, Dad says: "I want rice and beans and chicken, please." I want an empanada and an orange juice. It\'s delicious! At the end, Dad asks for the check.',
          q: [['¿Qué quiere Papá?', 'Arroz con habichuelas y pollo', 'Una empanada', 'Pescado', 'Pan'], ['¿Qué bebe el niño?', 'Jugo de naranja', 'Leche', 'Agua', 'Café'], ['¿Qué pide Papá al final?', 'La cuenta', 'El postre', 'Más pollo', 'Un taxi']] },
        mission: { es: 'En un restaurante o en casa, pide tu comida en español: "Quiero…, por favor."', en: 'At a restaurant or at home, order your food in Spanish: "Quiero…, por favor."' } }
    ]
  };
})();
