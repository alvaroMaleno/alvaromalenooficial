import { createContentInstance } from '../models/Content.js';
const { ref } = Vue;

export class ContentService {
  constructor() {
    this.posts = ref([]);
    this.loadPromise = null;
  }

  async loadPosts() {
    if (!this.loadPromise) {
      this.loadPromise = (async () => {
        try {
          const response = await fetch('./content/index.json?t=' + new Date().getTime());
          if (response.ok) {
            this.posts.value = await response.json();
          }
        } catch (e) {
          console.error("Failed to load posts index", e);
        }
      })();
    }
    return this.loadPromise;
  }

  getLatestPosts(lang) {
    return [...this.posts.value]
      .sort((a, b) => a.date < b.date ? 1 : -1)
      .slice(0, 6)
      .map(data => createContentInstance(data, lang));
  }

  getPostsBySection(section, lang) {
    return this.posts.value
      .filter(p => p.section === section)
      .sort((a, b) => a.date < b.date ? 1 : -1)
      .map(data => createContentInstance(data, lang));
  }

  getPostById(id, lang) {
    const data = this.posts.value.find(p => p.id === id);
    if (!data) return null;
    return createContentInstance(data, lang);
  }

  async getPostByIdAsync(id, lang) {
    await this.loadPosts();
    const data = this.posts.value.find(p => p.id === id);
    if (!data) return null;
    
    if (data.meta_path && !data._fullMetaLoaded) {
      try {
        const response = await fetch(data.meta_path + '?t=' + new Date().getTime());
        if (response.ok) {
          const fullMeta = await response.json();
          Object.assign(data, fullMeta);
          data._fullMetaLoaded = true;
        }
      } catch(e) {
        console.error("Failed to load full meta for", id, e);
      }
    }
    return createContentInstance(data, lang);
  }
}
