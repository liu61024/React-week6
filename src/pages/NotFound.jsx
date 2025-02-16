import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <div>
        <h1>此頁面不存在</h1>
        <Link to="/"></Link>
        </div>
    )
}