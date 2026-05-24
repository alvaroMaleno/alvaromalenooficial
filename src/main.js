const { createApp, ref, computed, onMounted, provide } = Vue;
import { router } from './router/index.js';
import { dictionaries } from './i18n/dictionaries.js';
import { ContentService } from './services/ContentService.js';
import { MarkdownService } from './services/MarkdownService.js';

// Setup Services
const contentService = new ContentService();
const markdownService = new MarkdownService();

const app = createApp({
  setup() {
    // Provide services for Dependency Injection
    provide('contentService', contentService);
    provide('markdownService', markdownService);

    // Global Language State
    const savedLang = localStorage.getItem('site_lang');
    const lang = ref(savedLang || 'es');
    const dict = computed(() => dictionaries[lang.value]);

    const setLang = (newLang) => {
      lang.value = newLang;
      localStorage.setItem('site_lang', newLang);
    };

    onMounted(async () => {
      await contentService.loadPosts();
    });

    return {
      lang,
      dict,
      setLang
    };
  }
});

app.use(router);
app.mount('#app');
