import { config, library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faFont,
  faLayerGroup,
  faPalette,
  faFontAwesome,
  faArrowUpRightFromSquare,
  faTriangleExclamation,
  faChevronDown,
  faChevronRight,
  faGripVertical,
  faPersonRunning,
  faCode,
  faArrowRight,
  faRotateRight,
  faPlus,
  faTrash,
  faCheck,
  faRightFromBracket,
  faFolder,
} from '@fortawesome/free-solid-svg-icons';

config.autoAddCss = false;

library.add(
  faGithub,
  faFont,
  faLayerGroup,
  faPalette,
  faFontAwesome,
  faArrowUpRightFromSquare,
  faTriangleExclamation,
  faChevronDown,
  faChevronRight,
  faGripVertical,
  faPersonRunning,
  faCode,
  faArrowRight,
  faRotateRight,
  faPlus,
  faTrash,
  faCheck,
  faRightFromBracket,
  faFolder,
);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon);
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
