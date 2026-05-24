export class PaginationState {
  constructor() {
    this.pages = [];
    this.currentPageIndex = 0;
    this.currentChapterIdx = 0;
    this.currentPartIdx = 0;
  }

  get totalPages() {
    return this.pages.length;
  }

  get isFirstPageOfPart() {
    return this.currentPageIndex === 0;
  }

  get isLastPageOfPart() {
    return this.currentPageIndex >= this.totalPages - 1;
  }

  resetPages(pages) {
    this.pages = pages;
    this.currentPageIndex = 0;
  }

  nextPage() {
    if (!this.isLastPageOfPart) {
      this.currentPageIndex++;
      return true; // Moved inside part
    }
    return false; // Reached end of part
  }

  prevPage() {
    if (!this.isFirstPageOfPart) {
      this.currentPageIndex--;
      return true; // Moved inside part
    }
    return false; // Reached start of part
  }
}
