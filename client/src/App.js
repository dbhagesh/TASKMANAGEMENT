import React, { lazy, Suspense } from "react";
import { Spin } from 'antd';

const Homepage = lazy(() => import('./pages/Homepage'))

function App() {
  return (
    <Suspense fallback={<Spin size="large" />}>
      <Homepage />
    </Suspense>
  );
}

export default App;
