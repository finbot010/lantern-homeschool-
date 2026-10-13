/* Lantern Homeschool — Language Lab: Spanish 1 (beginner).
   Immersion style: learners connect Spanish words directly to pictures, hear them, say them and type them.
   Item: { es: Spanish, en: English hint (hidden unless turned on), p: emoji picture | c: color | n: number }.
   Spanish follows standard Latin American usage. */
(function () {
  const I = (es, en, pic) => Object.assign({ es, en }, typeof pic === 'number' ? { n: pic } : /^#/.test(pic) ? { c: pic } : { p: pic });
  window.LH_SPANISH = {
    id: 'es1', name: 'Spanish 1', lang: 'es', units: [
      { id: 'saludos', t: 'Saludos', en: 'Greetings', items: [
        I('hola', 'hello', '👋'), I('adiós', 'goodbye', '👋🚶'), I('buenos días', 'good morning', '🌅'), I('buenas noches', 'good night', '🌙'),
        I('gracias', 'thank you', '🙏'), I('sí', 'yes', '👍'), I('no', 'no', '👎'), I('por favor', 'please', '🤲')] },
      { id: 'familia', t: 'La familia', en: 'Family', items: [
        I('la madre', 'the mother', '👩'), I('el padre', 'the father', '👨'), I('el hermano', 'the brother', '👦'), I('la hermana', 'the sister', '👧'),
        I('el bebé', 'the baby', '👶'), I('la abuela', 'the grandmother', '👵'), I('el abuelo', 'the grandfather', '👴'), I('la familia', 'the family', '👨‍👩‍👧')] },
      { id: 'colores', t: 'Los colores', en: 'Colors', items: [
        I('rojo', 'red', '#D93B30'), I('azul', 'blue', '#2C62D6'), I('verde', 'green', '#2E9A4E'), I('amarillo', 'yellow', '#F2C618'),
        I('negro', 'black', '#1B1B1B'), I('blanco', 'white', '#FFFFFF'), I('anaranjado', 'orange', '#F08A1C'), I('morado', 'purple', '#7E3FB0')] },
      { id: 'numeros', t: 'Los números', en: 'Numbers 1–10', items: [
        I('uno', 'one', 1), I('dos', 'two', 2), I('tres', 'three', 3), I('cuatro', 'four', 4), I('cinco', 'five', 5),
        I('seis', 'six', 6), I('siete', 'seven', 7), I('ocho', 'eight', 8), I('nueve', 'nine', 9), I('diez', 'ten', 10)] },
      { id: 'animales', t: 'Los animales', en: 'Animals', items: [
        I('el perro', 'the dog', '🐕'), I('el gato', 'the cat', '🐈'), I('el pájaro', 'the bird', '🐦'), I('el pez', 'the fish', '🐟'),
        I('el caballo', 'the horse', '🐴'), I('la vaca', 'the cow', '🐄'), I('el cerdo', 'the pig', '🐖'), I('el ratón', 'the mouse', '🐭')] },
      { id: 'comida', t: 'La comida', en: 'Food', items: [
        I('la manzana', 'the apple', '🍎'), I('el pan', 'the bread', '🍞'), I('el agua', 'the water', '💧'), I('la leche', 'the milk', '🥛'),
        I('el queso', 'the cheese', '🧀'), I('el huevo', 'the egg', '🥚'), I('el plátano', 'the banana', '🍌'), I('el arroz', 'the rice', '🍚')] },
      { id: 'acciones', t: '¿Qué hace?', en: 'What is he/she doing?', items: [
        I('el niño come', 'the boy eats', '🧒🍎'), I('la niña bebe', 'the girl drinks', '👧🥛'), I('el perro corre', 'the dog runs', '🐕💨'), I('el gato duerme', 'the cat sleeps', '🐈💤'),
        I('el niño lee', 'the boy reads', '🧒📖'), I('la niña escribe', 'the girl writes', '👧✏️'), I('la mujer canta', 'the woman sings', '👩🎤'), I('el hombre nada', 'the man swims', '🏊')] },
      { id: 'casa', t: 'La casa y la escuela', en: 'Home and school', items: [
        I('la casa', 'the house', '🏠'), I('la escuela', 'the school', '🏫'), I('el libro', 'the book', '📕'), I('el lápiz', 'the pencil', '✏️'),
        I('la silla', 'the chair', '🪑'), I('la puerta', 'the door', '🚪'), I('la cama', 'the bed', '🛏️'), I('el maestro', 'the teacher', '🧑‍🏫')] }
    ]
  };
})();
