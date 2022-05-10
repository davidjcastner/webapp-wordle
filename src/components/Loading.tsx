import { FC } from 'react';
import './Loading.css';

/** spinner for when data is loading and the app is not ready */
export const Loading: FC = () => (
    <div className='loading'>
        <div className='spinner'></div>
    </div>
);
