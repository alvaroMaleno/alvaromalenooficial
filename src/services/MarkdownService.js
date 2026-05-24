export class MarkdownService {
  constructor() {
    this.MAX_WORDS_PER_PAGE = 250;
  }

  async fetchAndProcess(url) {
    const response = await fetch(url + '?t=' + new Date().getTime());
    if (!response.ok) throw new Error(`Not found (${response.status})`);
    
    const rawMd = await response.text();
    
    // Remove frontmatter if present (allowing for BOM or leading whitespace)
    const contentWithoutFrontmatter = rawMd.replace(/^(?:\s|\uFEFF)*---[\s\S]+?---/, '').trim();
    
    return this.splitIntoPages(contentWithoutFrontmatter);
  }

  splitIntoPages(markdownText) {
    // Split by paragraphs (double newline)
    const paragraphs = markdownText.split(/\n\n+/);
    const newPages = [];
    let currentPg = [];
    let wordCount = 0;

    for (const p of paragraphs) {
      const words = p.split(/\s+/).length;
      if (wordCount + words > this.MAX_WORDS_PER_PAGE && currentPg.length > 0) {
        newPages.push(currentPg.join('\n\n'));
        currentPg = [p];
        wordCount = words;
      } else {
        currentPg.push(p);
        wordCount += words;
      }
    }
    if (currentPg.length > 0) {
      newPages.push(currentPg.join('\n\n'));
    }
    return newPages.length > 0 ? newPages : [''];
  }
}
