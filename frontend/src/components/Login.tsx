import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserInfoType } from "../context/Reducer";
import { Auth } from "../context/Context";
import axios from "axios";

type InputFieldsType = {
  email: string;
  password: string;
};

const Login = () => {
  const [inputFields, setInputFields] = useState<InputFieldsType>({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const {
    userDispatch,
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
        url: `${process.env.REACT_APP_API_URL}/login`,
        headers: {
          // "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        data: postData,
      });

      const user: UserInfoType = {
        username: response.data.username,
        id: response.data.id,
      };

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(user));
        userDispatch({ type: "ADD_USER", payload: user });
        return navigate("/rooms");
      }
    } catch (err) {
      alert("Invalid email or password");
      console.log(err);
    }
  };

  return (
    <div className="h-lvh w-full flex items-center justify-center flex-col">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form
        className="flex flex-col items-center justify-center"
        onSubmit={submitInputFields}
      >
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
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
