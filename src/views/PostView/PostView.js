const { computed, ref, onMounted, watch, inject, reactive } = Vue;

import ReaderSidebar from '../../components/ReaderSidebar/ReaderSidebar.js';
import VideoPlayer from '../../components/Multimedia/VideoPlayer.js';
import ImageDisplay from '../../components/Multimedia/ImageDisplay.js';
import PaginationControls from '../../components/PaginationControls/PaginationControls.js';
import { PaginationState } from '../../models/PaginationState.js';
import { createMultimedia } from '../../models/Multimedia.js';

export default {
  name: 'PostView',
  components: {
    ReaderSidebar,
    VideoPlayer,
    ImageDisplay,
    PaginationControls
  },
  template: `
    <div :class="['reader-container', { 'has-sidebar': isMultipage }]">
      <!-- Sidebar for Books/Series -->
      <ReaderSidebar 
        v-if="isMultipage"
        :chapters="postMeta.chapters"
        :lang="lang"
        :currentChapterIdx="pagination.currentChapterIdx"
        :currentPartIdx="pagination.currentPartIdx"
        :mobileOpen="mobileSidebarOpen"
        @close="mobileSidebarOpen = false"
        @goToPart="goToPart"
      />

      <!-- Main Content -->
      <article class="content reader-content">
        <button class="open-sidebar-btn" v-if="isMultipage" @click="mobileSidebarOpen = true">☰ Índice</button>
        
        <div v-if="loading">{{ dict.loading }}</div>
        <div v-else-if="error">Error: {{ errorMessage }}</div>
        
        <!-- Normal Posts / Multipage Content -->
        <div v-else-if="postMeta.section !== 'reflexiones'">
          <div v-if="!isMultipage">
            <h1>{{ postMeta.title }}</h1>
            <div class="card-date" style="margin-bottom: 2rem;">{{ postMeta.date }}</div>
          </div>
          <div v-else>
            <h1>{{ currentPartMeta.title }}</h1>
            <div class="card-date" style="margin-bottom: 2rem;">{{ postMeta.title }}</div>
          </div>
          
          <!-- Multimedia Player -->
          <VideoPlayer 
            v-if="currentPartMultimedia && currentPartMultimedia.isVideo" 
            :src="currentPartMultimedia.src" 
          />

          <!-- Page Content -->
          <div class="page-content" v-html="currentPageHtml"></div>
        </div>

        <!-- Reflexiones Layout -->
        <div v-else class="quote-layout">
          <ImageDisplay 
            v-if="postMeta.quote_image" 
            :src="postMeta.quote_image" 
            alt="Reflexión" 
          />
          <div class="quote-text-container">
            <h1 class="quote-text">"{{ postMeta.quote }}"</h1>
            <div class="quote-author" v-if="postMeta.quote_author">&mdash; {{ postMeta.quote_author }}</div>
          </div>
          <div class="page-content reflection-content" v-html="currentPageHtml"></div>
        </div>

        <!-- Pagination Controls -->
        <PaginationControls 
          v-if="pagination.totalPages > 1 || isMultipage"
          :currentPage="pagination.currentPageIndex"
          :totalPages="pagination.totalPages"
          :isFirstDisabled="pagination.isFirstPageOfPart && pagination.currentPartIdx === 0 && pagination.currentChapterIdx === 0"
          :isLastDisabled="isLastPageOfBook"
          @prev="prevPage"
          @next="nextPage"
        />
      </article>
    </div>
  `,
  props: ['lang', 'dict'],
  setup(props) {
    const route = VueRouter.useRoute();
    const contentService = inject('contentService');
    const markdownService = inject('markdownService');
    
    const loading = ref(true);
    const error = ref(false);
    const errorMessage = ref('');
    const mobileSidebarOpen = ref(false);
    
    const pagination = reactive(new PaginationState());

    const postMeta = ref({ title: '', date: '', is_multipage: false });

    const isMultipage = computed(() => postMeta.value.is_multipage);

    const currentPartMeta = computed(() => {
      if (!isMultipage.value) return null;
      try {
        const chapter = postMeta.value.chapters[pagination.currentChapterIdx];
        const part = chapter.parts[pagination.currentPartIdx];
        return {
          title: part[props.lang] ? part[props.lang].title : '',
          video: part.video,
          file: part.file,
          folder: chapter.folder
        };
      } catch(e) {
        return null;
      }
    });

    const currentPartMultimedia = computed(() => {
      if (!currentPartMeta.value || !currentPartMeta.value.video) return null;
      return createMultimedia(currentPartMeta.value.video);
    });

    const currentPageHtml = computed(() => {
      if (pagination.pages.length === 0) return '';
      return marked.parse(pagination.pages[pagination.currentPageIndex]);
    });

    const isLastPageOfBook = computed(() => {
      if (!isMultipage.value) return pagination.isLastPageOfPart;
      
      const isLastPart = pagination.currentPartIdx >= postMeta.value.chapters[pagination.currentChapterIdx].parts.length - 1;
      const isLastChapter = pagination.currentChapterIdx >= postMeta.value.chapters.length - 1;
      return pagination.isLastPageOfPart && isLastPart && isLastChapter;
    });

    const loadContent = async () => {
      const id = route.params.id;
      if (!id) return; 
      
      loading.value = true;
      error.value = false;
      const section = route.params.section;
      
      try {
        const fullMeta = await contentService.getPostByIdAsync(id, props.lang);
        if (!fullMeta) throw new Error("Content not found in index");
        postMeta.value = fullMeta;

        // SEO: Dynamic metadata update
        document.title = `${fullMeta.title} | Álvaro Maleno`;
        const metaDesc = document.getElementById('meta-description');
        if (metaDesc && fullMeta.excerpt) metaDesc.content = fullMeta.excerpt;
        const ogTitle = document.getElementById('og-title');
        if (ogTitle) ogTitle.content = fullMeta.title;
        const ogDesc = document.getElementById('og-description');
        if (ogDesc && fullMeta.excerpt) ogDesc.content = fullMeta.excerpt;

        let fetchUrl = '';
        if (isMultipage.value && currentPartMeta.value) {
          fetchUrl = './content/' + section + '/' + id + '/' + currentPartMeta.value.folder + '/' + currentPartMeta.value.file + '.' + props.lang + '.md';
        } else if (postMeta.value.series) {
          fetchUrl = './content/' + section + '/' + postMeta.value.series + '/' + id + '/' + id + '.' + props.lang + '.md';
        } else {
          fetchUrl = './content/' + section + '/' + id + '/' + id + '.' + props.lang + '.md';
        }
        
        const pages = await markdownService.fetchAndProcess(fetchUrl);
        pagination.resetPages(pages);
      } catch (e) {
        console.error(e);
        error.value = true;
        errorMessage.value = e.message || String(e);
      } finally {
        loading.value = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const goToPart = (cIdx, pIdx) => {
      pagination.currentChapterIdx = cIdx;
      pagination.currentPartIdx = pIdx;
      mobileSidebarOpen.value = false;
      loadContent();
    };

    const nextPage = () => {
      if (pagination.nextPage()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (isMultipage.value) {
        const chapter = postMeta.value.chapters[pagination.currentChapterIdx];
        if (pagination.currentPartIdx < chapter.parts.length - 1) {
          goToPart(pagination.currentChapterIdx, pagination.currentPartIdx + 1);
        } else if (pagination.currentChapterIdx < postMeta.value.chapters.length - 1) {
          goToPart(pagination.currentChapterIdx + 1, 0);
        }
      }
    };

    const prevPage = () => {
      if (pagination.prevPage()) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (isMultipage.value) {
        if (pagination.currentPartIdx > 0) {
          goToPart(pagination.currentChapterIdx, pagination.currentPartIdx - 1);
        } else if (pagination.currentChapterIdx > 0) {
          const prevChapParts = postMeta.value.chapters[pagination.currentChapterIdx - 1].parts;
          goToPart(pagination.currentChapterIdx - 1, prevChapParts.length - 1);
        }
      }
    };

    onMounted(() => {
      loadContent();
    });
    
    watch(() => props.lang, loadContent);
    watch(() => route.params.id, (newId, oldId) => {
      if (newId && newId !== oldId) {
        pagination.currentChapterIdx = 0;
        pagination.currentPartIdx = 0;
        loadContent();
      }
    });

    return { 
      loading, error, errorMessage, postMeta, isMultipage,
      currentPartMeta, currentPartMultimedia, 
      currentPageHtml, pagination,
      mobileSidebarOpen, goToPart, nextPage, prevPage, isLastPageOfBook
    };
  }
};
