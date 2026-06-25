export default {
  name: 'AudioPlayer',
  props: {
    src: { type: String, required: true }
  },
  template: `
    <div class="audio-container" style="margin: 2rem 0; width: 100%;">
      <audio :src="src" controls preload="metadata" style="width: 100%; border-radius: 8px;"></audio>
    </div>
  `
};
