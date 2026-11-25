
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

const DIV1 = lazy(() => import('./card1'));
const DIV2 = lazy(() => import('./card2'));

function App() {
    return (
        <Router>
            <div style={{ padding: "20px" }}>
                <nav style={{
                    display: "flex",
                    gap: "20px",
                    marginBottom: "30px",
                    padding: "10px",
                    background: "#f0f0f0",
                    borderRadius: "8px"
                }}>
                    <Link to="/">Todo</Link>
                    <Link to="/card2">INFO</Link>
                </nav>

                <Suspense fallback={<h2>Loading...</h2>}>
                    <Routes>
                        <Route path="/" element={<DIV1 />} />
                        <Route path="/card2" element={<DIV2 />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
