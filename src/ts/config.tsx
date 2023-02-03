import { createRoot } from 'react-dom/client';

import Config from './components/Config';

const container = document.querySelector('#root') as HTMLDivElement;
const root = createRoot(container);

root.render(<Config />);
