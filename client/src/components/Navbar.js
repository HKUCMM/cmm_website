import { Link } from "react-router-dom";

function Navbar()
{
    return (
        <nav>
            <div>Park</div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/login">Login</Link>
        </nav>
    )
}

export default Navbar;