import { Link } from "react-router-dom";

function Navbar()
{
    return (
        <nav>
            <div></div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
        </nav>
    )
}

export default Navbar;