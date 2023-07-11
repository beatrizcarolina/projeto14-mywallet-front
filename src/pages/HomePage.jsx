import styled from "styled-components";
import axios from "axios";
import { BiExit } from "react-icons/bi";
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai";
import { useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [data, setData] = useState({ 
        transactions: [],
        balance: 0,
    });
    const [balance, setBalance] = useState("positivo");

    function signOut() {
        console.log(user.token);
        axios
            .delete(`${import.meta.env.VITE_API_URL}/signout`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then(() => {
                localStorage.removeItem("user");
                navigate("/");
            })
            .catch(() => {
                localStorage.removeItem("user");
                navigate("/");
            });
    }

    function getTransaction() {
        console.log(user.token);
        axios
            .get(`${import.meta.env.VITE_API_URL}/home`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                response.data.transactions.reverse();
                setData(response.data);
                if (response.data.balance>=0) {
                    setBalance("positivo");
                } else {
                    setBalance("negativo");
                }
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    return alert(`${error.response.data}. Error ${error.response.status}: ${error.response.statusText}`);
                }
                return alert(error.message);                
            });
    }

    useEffect(() =>  {
        if (user && user.token) {
            return getTransaction();
        }
        return navigate("/");
    }, []);


    return (
        <HomeContainer>
            <Header>
                <h1 data-test="user-name">{`Olá, ${data.name}`}</h1>
                <BiExit onClick={signOut} data-test="logout"/>
            </Header>

            <TransactionsContainer>
                <article>
                    <strong>Saldo</strong>
                    <Value color={balance} data-test="total-amount">{Math.abs(data.balance).toFixed(2).replace('.', ',')}</Value>
                </article>
            </TransactionsContainer>

            <ButtonsContainer>
                <button onClick={() => navigate("/nova-transacao/entrada")} data-test="new-income">
                    <AiOutlinePlusCircle />
                    <p>
                        Nova <br /> entrada
                    </p>
                </button>
                <button onClick={() => navigate("/nova-transacao/saida")} data-test="new-expense">
                    <AiOutlineMinusCircle />
                    <p>
                        Nova <br />
                        saída
                    </p>
                </button>
            </ButtonsContainer>
        </HomeContainer>
    );
}

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 50px);
`;
const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px 5px 2px;
    margin-bottom: 15px;
    font-size: 26px;
    color: white;
`;
const TransactionsContainer = styled.article`
    flex-grow: 1;
    background-color: #fff;
    color: #000;
    border-radius: 5px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: scroll;
    article {
        display: flex;
        justify-content: space-between;
        strong {
            font-weight: 700;
            text-transform: uppercase;
        }
    }
`;
const ButtonsContainer = styled.section`
    margin-top: 15px;
    margin-bottom: 0;
    display: flex;
    gap: 15px;

    button {
        width: 50%;
        height: 115px;
        font-size: 22px;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
            font-size: 18px;
        }
    }
`;
const Value = styled.div`
    font-size: 16px;
    text-align: right;
    color: ${(props) => (props.color === "positivo" ? "#00ff00" : "#ff0000")};
`;