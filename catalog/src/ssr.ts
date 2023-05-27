/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// This file imports only files that will be SSRd e.g. if you can't SSR a
// component, don't import it here.
import './components/catalog-component-header';
import './components/catalog-component-header-title';
import './components/top-app-bar';
import './components/nav-drawer';
import './components/theme-changer';
import '@material/web/menu/menu';
import '@material/web/checkbox/checkbox';
import '@material/web/list/list';
import '@material/web/list/list-item-link';
import '@material/web/circularprogress/circular-progress';
import '@material/web/tabs/tabs';
import '@material/web/tabs/tab';
import '@material/web/iconbutton/outlined-icon-button';
import '@material/web/button/elevated-button';
import '@material/web/button/filled-button';
import '@material/web/button/tonal-button';
import '@material/web/button/outlined-button';
import '@material/web/button/text-button';