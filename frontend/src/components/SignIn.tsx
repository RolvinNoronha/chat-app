import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../context/Context";
import axios from "axios";

type InputFieldsType = {
  username: string;
  email: string;
  password: string;
};

const Login = () => {
  const [inputFields, setInputFields] = useState<InputFieldsType>({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const {
    userState: { isAuthenticated },
  } = useContext(Auth);

  useEffect(() => {
    if (isAuthenticated) {
      return navigate("/rooms");
    }
  }, [isAuthenticated]);

  const enterUnameAndPwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputFields((prevInputFields) => ({
      ...prevInputFields,
      [id]: value,
    }));
  };

  const submitInputFields = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const postData = JSON.stringify(inputFields);
      const response = await axios({
        method: "post",
        url: "http://localhost:8080/signup",
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        data: postData,
      });

      if (response.status === 200) {
        return navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-lvh w-full flex items-center justify-center flex-col">
      <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={submitInputFields}
      >
        <input
          className="px-3 py-1 rounded-md mb-4 border-slate-300 border-2"
          value={inputFields.username}
          onChange={enterUnameAndPwd}
          id="username"
          type="text"
          placeholder="username"
        />
        <input
          className="px-3 py-1 rounded-md mb-4 border-slate-300 border-2"
          value={inputFields.email}
          onChange={enterUnameAndPwd}
          id="email"
          type="email"
          placeholder="email"
        />
        <input
          className="px-3 py-1 rounded-md mb-4 border-slate-300 border-2"
          value={inputFields.password}
          onChange={enterUnameAndPwd}
          id="password"
          type="password"
          placeholder="password"
        />
        <button
          className="bg-blue-600 px-5 py-2 text-white mr-4 rounded-xl"
          type="submit"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
