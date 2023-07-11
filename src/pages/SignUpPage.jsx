import { Link } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
    const navigate = useNavigate();

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);
    const confirmPassword = useRef(null);

    function newUser(data) {
        axios
            .post(`${import.meta.env.VITE_API_URL}/cadastro`, data)
            .then(() => navigate("/"))
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
            name: name.current.value,
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

        if (data.password !== confirmPassword.current.value) {
            return alert("Passwords don't match");
        }

        newUser(data);
    }

    return (
        <SingUpContainer>
            <form onSubmit={handleForm}>
                <MyWalletLogo />
                <input ref={name} placeholder="Nome" type="text" required data-test="name"/>
                <input ref={email} placeholder="E-mail" type="email" required data-test="email"/>
                <input ref={password} placeholder="Senha" type="password" autoComplete="new-password" required data-test="password"/>
                <input
                    ref={confirmPassword}
                    placeholder="Confirme a senha"
                    type="password"
                    autoComplete="new-password"
                    required
                    data-test="conf-password"
                />
                <button data-test="sign-up-submit">Cadastrar</button>
            </form>

            <Link to={"/"}>Já tem uma conta? Entre agora!</Link>
        </SingUpContainer>
    );
}

const SingUpContainer = styled.section`
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
