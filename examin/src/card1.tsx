import { useEffect, useState } from "react";
import axios from 'axios';
import style from './card1.module.css'

const API = 'https://to-dos-api.softclub.tj/api/to-dos';
const api = 'https://to-dos-api.softclub.tj/images/';

function DIV1() {
    const [user, setUser] = useState([]);

    async function getData() {
        try {
            const response = await axios.get(API);
            setUser(response.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    async function delUser(id: number | string) {
    try {
    await axios.delete(`https://to-dos-api.softclub.tj/api/to-dos?id=${id}`)
    getData()
    } catch (error) {
    console.log(error);
    } 
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Foto</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((elem) => (
                        <tr key={elem.id}>
                            <td>
                                <img src={`${api}${elem.images[0]?.imageName}`} alt={elem.name} width="50" />
                            </td>
                            <td>{elem.name}</td>
                            <td>{elem.description}</td>
                            <td>
                            <button onClick={()=>{delUser(elem.id)}}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DIV1;