import { Link } from "react-router-dom";

function App() {
  return (
    <div className="h-lvh w-full flex items-center justify-center flex-col">
      <h1 className="font-semibold text-3xl mb-4">Welcom to Chat App</h1>
      <div>
        <button
          className="bg-blue-600 px-5 py-2 text-white mr-4 rounded-xl"
          type="button"
        >
          <Link to={"/login"}>Login</Link>
        </button>
        <button
          className="bg-blue-600 px-5 py-2 text-white mr-4 rounded-xl"
          type="button"
        >
          <Link to={"/signup"}>Sign-Up</Link>
        </button>
      </div>
    </div>
  );
}

export default App;
