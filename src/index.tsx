import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


// 設定値の上書きテスト
// const winScope = (window as any)
// winScope.SlidePuzzleConfig = {
//   src: "20240629_144258_himaXLv6_.webp",
//   ratio: 1.333,
//   rows: 3,
//   cols: 4,
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
