import { createRoot } from 'react-dom/client';
import { App } from './components/App';

import './styles/reset.css';
import './styles/colors.css';
import './styles/skeleton.css';
import './styles/typography.css';
import './styles/default.css';

// attach app to the root element
createRoot(document.getElementById('root')).render(<App />);
