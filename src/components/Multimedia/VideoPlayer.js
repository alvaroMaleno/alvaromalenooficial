export default {
  name: 'VideoPlayer',
  props: {
    src: { type: String, required: true }
  },
  template: `
    <div class="video-container">
      <video :src="src" controls preload="metadata"></video>
    </div>
  `
};
