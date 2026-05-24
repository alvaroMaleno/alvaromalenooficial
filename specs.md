1. Clean code
2. Separation of concers
3. Maintain a modular code, always open to new ideas, and easy to read.
4. NEVER make the code harder to read. 

Architecture style

1. Un folder para cada vista.
2. Un folder para cada componente.
3. Un folder para cada servicio.
4. Para los dictionaries usaremos un hashmap situado en una carpeta aparte. Seran estaticos o traducciones...
5. Un archivo por vista. Separados por folders.
6. Usaremos OOP. Tendremos un objeto que sera Content. Una especializacion del mismo para BOOK, Chapter, Stroy, Article, Poem, Reflection. Una definicion aparte del estado(pagina actual, etc...). Un objeto especifico para la paginacion. Se inyectara mediante inversion de dependencias. El contenido multimedia tendra su propia representacion. Video, Imagen, Audio, Texto. (Todo esto se hardcodeara en un principio, para luego pasar a un CMS).
