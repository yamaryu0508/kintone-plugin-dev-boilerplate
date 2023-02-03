import { createRoot } from 'react-dom/client';

import Desktop from './components/Desktop';
import { APP_SELECTOR } from './constants';

kintone.events.on('app.record.index.show', event => {
  if (document.querySelector(APP_SELECTOR) === null) {
    const headerMenuSpaceElement = kintone.app.getHeaderMenuSpaceElement() as HTMLDivElement;
    const menuContainer = document.createElement('div');
    menuContainer.id = APP_SELECTOR.replace('#', '');
    menuContainer.style.display = 'inline-block';
    headerMenuSpaceElement.append(menuContainer);
    const menuRoot = createRoot(menuContainer);
    menuRoot.render(<Desktop />);
  }
  return event;
});
