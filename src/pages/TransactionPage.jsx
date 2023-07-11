import styled from "styled-components";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useRef, useEffect } from "react";
import { UserContext } from "../UserContext";

export default function TransactionsPage() {
    const { user } = useContext(UserContext);
    const { tipo } = useParams();
    const navigate = useNavigate();
    const value = useRef(null);
    const description = useRef(null);

    function sendTransaction(data) {
        axios
            .post(`${import.meta.env.VITE_API_URL}/nova-transacao/${tipo}`, data, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then(() => {
                navigate("/home");
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                alert(error.message);                
            });
    }

    function handleForm(event) {
        event.preventDefault();

        const data = {
            value: Number(value.current.value),
            description: description.current.value,
        }

        if(!isNaN(data.value) && data.value<=0) {
            return alert("Insira um valor válido!");
        }

        if(data.description.length===0) {
            return alert("Insira uma descrição!");
        }

        sendTransaction(data);
    }

    useEffect(() =>  {
        if (user && user.token) {
            return;
        }
        navigate("/");
    }, []);

    return (
        <TransactionsContainer>
            <h1>Nova Transação</h1>
            <form onSubmit={handleForm}>
                <input placeholder="Valor" type="number" min="0" step="0.01" required ref={value} data-test="registry-amount-input"/>
                <input placeholder="Descrição" type="text" required ref={description} data-test="registry-name-input"/>
                <button data-test="registry-save">Salvar Transação</button>
            </form>
        </TransactionsContainer>
    );
}

const TransactionsContainer = styled.main`
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    h1 {
        align-self: flex-start;
        margin-bottom: 40px;
    }
`;