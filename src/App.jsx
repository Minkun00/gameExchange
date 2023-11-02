import React from 'react';
import KaikasConnect from './src/kaikasConnect/KaikasConnect';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemToImg from './src/itemToIMG/itemToImg';

function App() {
  return (
    <Router> {/* Router로 Routes 컴포넌트를 감싸줍니다 */}
      <div>
        <h1>Welcome to MyToken DApp</h1>
        <KaikasConnect />
        <Routes> {/* Routes 컴포넌트 사용 */}
          {/* React Router v6부터는 `component` 대신 `element`를 사용합니다 */}
          <Route path="/inputCode" element={<ItemToImg />} /> {/* self-closing 태그 사용 가능 */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
