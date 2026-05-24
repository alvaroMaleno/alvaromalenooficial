const { computed, inject } = Vue;

export default {
  name: 'HomeView',
  template: `
    <section>
      <h2>{{ dict.latest }}</h2>
      <div class="grid">
        <div class="card" v-for="post in latestPosts" :key="post.id">
          <h3 class="card-title">{{ post.title }}</h3>
          <div class="card-date">{{ post.date }}</div>
          <p class="card-excerpt">{{ post.excerpt }}</p>
          <router-link :to="'/' + post.section + '/' + post.id" class="card-link">{{ dict.read_more }}</router-link>
        </div>
      </div>
      <p v-if="latestPosts.length === 0">{{ dict.empty_section }}</p>
    </section>
  `,
  props: ['lang', 'dict'],
  setup(props) {
    const contentService = inject('contentService');
    
    const latestPosts = computed(() => {
      return contentService.getLatestPosts(props.lang);
    });

    return { latestPosts };
  }
};
