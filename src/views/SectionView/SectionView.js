const { computed, inject } = Vue;

export default {
  name: 'SectionView',
  template: `
    <section>
      <h2>{{ sectionTitle }}</h2>
      <div class="grid">
        <div class="card" v-for="post in sectionPosts" :key="post.id">
          <h3 class="card-title">{{ post.title }}</h3>
          <div class="card-date">{{ post.date }}</div>
          <p class="card-excerpt">{{ post.excerpt }}</p>
          <router-link :to="'/' + post.section + '/' + post.id" class="card-link">{{ dict.read_more }}</router-link>
        </div>
      </div>
      <p v-if="sectionPosts.length === 0">{{ dict.empty_section }}</p>
    </section>
  `,
  props: ['lang', 'dict'],
  setup(props) {
    const route = VueRouter.useRoute();
    const contentService = inject('contentService');
    
    const sectionPosts = computed(() => {
      const section = route.path.replace('/', '');
      return contentService.getPostsBySection(section, props.lang);
    });

    const sectionTitle = computed(() => {
      const section = route.path.replace('/', '');
      if (section === 'articulos') return props.dict.articles;
      if (section === 'libros') return props.dict.books;
      if (section === 'cuentos') return props.dict.stories;
      if (section === 'poemas') return props.dict.poems;
      if (section === 'reflexiones') return props.dict.reflections;
      return section;
    });

    return { sectionPosts, sectionTitle };
  }
};
