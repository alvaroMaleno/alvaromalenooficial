export default {
  name: 'PaginationControls',
  props: {
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    isFirstDisabled: { type: Boolean, required: true },
    isLastDisabled: { type: Boolean, required: true }
  },
  emits: ['prev', 'next'],
  template: `
    <div class="pagination-controls" v-if="totalPages > 1">
      <button class="page-btn" @click="$emit('prev')" :disabled="isFirstDisabled">
        &larr; Anterior
      </button>
      <span class="page-indicator">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
      <button class="page-btn" @click="$emit('next')" :disabled="isLastDisabled">
        Siguiente &rarr;
      </button>
    </div>
  `
};
