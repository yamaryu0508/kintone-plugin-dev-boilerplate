import { createRoot } from 'react-dom/client';

import { APP_SELECTOR } from './constants';

kintone.events.on('mobile.app.record.index.show', event => {
  if (document.querySelector(APP_SELECTOR) === null) {
    const headerMenuSpaceElement = kintone.mobile.app.getHeaderSpaceElement() as HTMLDivElement;
    const menuContainer = document.createElement('div');
    menuContainer.id = APP_SELECTOR.replace('#', '');
    menuContainer.style.display = 'inline-block';
    headerMenuSpaceElement.append(menuContainer);
    const menuRoot = createRoot(menuContainer);
    menuRoot.render(
      <div />
    );
  }
  return event;
});
