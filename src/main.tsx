import { createRoot } from 'react-dom/client';

import './styles/tailwind.css';
import './styles/mdx-editor.css';
import './styles/app.css';

import Popup from './pages/Popup';

createRoot(document.getElementById('root')!).render(<Popup />);
