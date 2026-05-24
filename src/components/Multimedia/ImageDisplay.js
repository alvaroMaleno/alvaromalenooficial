export default {
  name: 'ImageDisplay',
  props: {
    src: { type: String, required: true },
    alt: { type: String, default: 'Image' }
  },
  template: `
    <div class="quote-image-container">
      <img :src="src" :alt="alt" class="quote-image" />
    </div>
  `
};
