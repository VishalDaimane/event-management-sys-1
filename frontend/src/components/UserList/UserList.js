import Axios from "axios";
import { useEffect, useState } from "react";
import UserListRow from "./UserListRow";

import "./UserList.css";
import toast from "react-hot-toast";

const API_ROUTE = "http://localhost:4000";

function UserList()
{
    const [arr,setArr] = useState([]);
    useEffect(()=>{
        Axios.get(API_ROUTE + "/eventRoute/user-list")
        .then((res)=>{
            if(res.status === 200)
                setArr(res.data);
            else
                Promise.reject();
        })
        .catch((err)=> toast.error("Error fetching user list"));
    },[]);

    const ListItems = () =>{
        return arr.map((val,ind)=>{  //[{_id, username, fullName, email, phone},{},{},{}]
            return <UserListRow obj={val}/>
        })
    }
    return (
        <table className = "userDisplayTable"
        style={{maxWidth:"60%", margin: "50px auto"}} 
        border = "1" bordercolor = "white" cellspacing = "0" cellpadding = "5">
            <thead>
                <tr>
                    <th class="text-center">Username</th>
                    <th class="text-center">Full Name</th>
                    <th class="text-center">Email</th>
                    <th class="text-center">Phone</th>
                </tr>
            </thead>
            <tbody>
                {ListItems()}
            </tbody>
        </table>
    )
}
export default UserList;
