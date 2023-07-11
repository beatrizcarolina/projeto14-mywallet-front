import styled from "styled-components";
import axios from "axios";
import MyWalletLogo from "../components/MyWalletLogo";
import { Link } from "react-router-dom";
import { useRef, useEffect, useContext } from "react";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";


export default function SignInPage() {
    const email = useRef(null);
    const password = useRef(null);
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    function signIn(data) {
        axios
            .post(import.meta.env.VITE_API_URL, data)
            .then((response) => {
                const newUser = {
                    token: response.data,
                };
                localStorage.setItem("user", JSON.stringify(newUser));
                setUser(newUser);
                navigate("/home");
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                return alert(error.message);                
            });
    }

    function handleForm(event) {
        event.preventDefault();

        const data = {
            email: email.current.value,
            password: password.current.value,
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.password.length < 3) {
            return alert("Password must have at least 3 characters");
        }

        if (!emailPattern.test(data.email)) {
            return alert("Invalid email address");
        }

        signIn(data);
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUser(user);
            navigate("/home");
        }
    }, []);

    return (
        <SingInContainer>
            <form onSubmit={handleForm}>
                <MyWalletLogo />
                <input placeholder="E-mail" type="email" ref={email} required data-test="email"/>
                <input placeholder="Senha" type="password" autoComplete="new-password" ref={password} required data-test="password"/>
                <button data-test="sign-in-submit">Entrar</button>
            </form>

            <Link to={"/cadastro"}>Primeira vez? Cadastre-se!</Link>
        </SingInContainer>
    );
}

const SingInContainer = styled.section`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;