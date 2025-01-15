import { createRoot } from 'react-dom/client';
const mountNode = document.createElement('div');
mountNode.id = 'tailwind-react-google-extension-boilerplate';
document.body.appendChild(mountNode);

const root = createRoot(mountNode);
root.render(<div></div>);
