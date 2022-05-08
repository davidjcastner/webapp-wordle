import { createRoot } from 'react-dom/client';
import { App } from './components/App';

import './styles/colors.css';
import './styles/default.css';

// attach app to the root element
createRoot(document.getElementById('root')).render(<App />);
