export class Content {
  constructor(data, lang) {
    this.id = data.id;
    this.section = data.section;
    this.date = data.date;
    this.is_multipage = data.is_multipage || false;
    this.title = data[lang] ? data[lang].title : '';
    this.excerpt = data[lang] ? data[lang].excerpt : '';
  }
}

export class MultipageContent extends Content {
  constructor(data, lang) {
    super(data, lang);
    this.chapters = data.chapters || [];
  }
}

export class Book extends MultipageContent {}
export class Story extends MultipageContent {}
export class Article extends MultipageContent {}

export class Poem extends Content {}
export class Reflection extends Content {
  constructor(data, lang) {
    super(data, lang);
    this.quote = data[lang] ? data[lang].quote : '';
    this.quote_author = data[lang] ? data[lang].quote_author : '';
    this.quote_image = data.quote_image || '';
  }
}

// Factory to create the correct domain object
export function createContentInstance(data, lang) {
  if (data.section === 'libros') return new Book(data, lang);
  if (data.section === 'cuentos') return new Story(data, lang);
  if (data.section === 'articulos') return new Article(data, lang);
  if (data.section === 'poemas') return new Poem(data, lang);
  if (data.section === 'reflexiones') return new Reflection(data, lang);
  return new Content(data, lang);
}
