import HomeView from '../views/HomeView/HomeView.js';
import SectionView from '../views/SectionView/SectionView.js';
import PostView from '../views/PostView/PostView.js';

const { createRouter, createWebHashHistory } = VueRouter;

const routes = [
  { path: '/', component: HomeView },
  { path: '/articulos', component: SectionView },
  { path: '/libros', component: SectionView },
  { path: '/cuentos', component: SectionView },
  { path: '/poemas', component: SectionView },
  { path: '/reflexiones', component: SectionView },
  { path: '/:section/:id', component: PostView }
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});
