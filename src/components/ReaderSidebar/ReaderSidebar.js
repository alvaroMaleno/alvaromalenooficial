export default {
  name: 'ReaderSidebar',
  props: {
    chapters: { type: Array, required: true },
    lang: { type: String, required: true },
    currentChapterIdx: { type: Number, required: true },
    currentPartIdx: { type: Number, required: true },
    mobileOpen: { type: Boolean, default: false }
  },
  emits: ['close', 'goToPart'],
  template: `
    <aside class="reader-sidebar" :class="{ 'mobile-open': mobileOpen }">
      <button class="close-sidebar-btn" @click="$emit('close')">✕</button>
      <h3>Índice</h3>
      <div class="chapter-list">
        <div v-for="(chapter, cIdx) in chapters" :key="cIdx" class="chapter-item">
          <div class="chapter-title">{{ chapter[lang].title }}</div>
          <ul class="part-list">
            <li v-for="(part, pIdx) in chapter.parts" :key="pIdx" 
                :class="['part-item', { active: currentChapterIdx === cIdx && currentPartIdx === pIdx }]"
                @click="$emit('goToPart', cIdx, pIdx)">
              {{ part[lang] ? part[lang].title : '' }}
            </li>
          </ul>
        </div>
      </div>
    </aside>
  `
};
