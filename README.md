# Card Stopwatch for RemNote

Cronómetro ascendente por tarjeta para la cola de flashcards de RemNote.

## Qué hace

- Empieza en `00:00` al aparecer una tarjeta.
- Cuenta hacia arriba mientras piensas.
- Al pasar/calificar la tarjeta y aparecer la siguiente, vuelve automáticamente a `00:00`.
- NO cambia tarjetas automáticamente.
- NO tiene alarmas.
- NO modifica tu repetición espaciada.
- Por defecto: normal hasta 15 s, aviso amarillo 15–29 s, rojo desde 30 s.
- Los umbrales y las décimas se pueden cambiar en Settings > Plugins > Card Stopwatch.

## Cómo probarlo en Windows

RemNote recomienda Node.js para desarrollar/probar plugins locales.

1. Instala Node.js LTS si no lo tienes.
2. Descomprime esta carpeta.
3. Abre PowerShell dentro de la carpeta.
4. Ejecuta:

   npm install
   npx remnote-plugin init

5. Cuando `init` pregunte datos del manifest, usa por ejemplo:
   - Name: Card Stopwatch
   - Description: Cronómetro ascendente por tarjeta
   - Version: 0.1.0
   - Enable on mobile: yes (si deseas probarlo también en tablet)
   - Request native: no
   - Required scopes: ninguno / mínimo disponible

6. Ejecuta:

   npm run dev

7. En RemNote: Settings > Plugins > Build > Develop from localhost.
8. Escribe:

   http://localhost:8080

9. Abre una cola de flashcards. Debajo de la tarjeta debería aparecer `⏱ 00:00` y reiniciarse al pasar a la siguiente.

## Nota de prototipo

Esta versión usa la API oficial `plugin.queue.getCurrentCard()` y la ubicación `WidgetLocation.FlashcardUnder`. Si una versión concreta de RemNote cambia el comportamiento visual de esa ubicación, se puede mover fácilmente a `QueueToolbar` o a un widget flotante sin cambiar la lógica del cronómetro.
