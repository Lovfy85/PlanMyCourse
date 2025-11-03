import { useNavigate } from "react-router-dom";

// redirect component
function Redirect() {
    const navigate = useNavigate();

    const handleSearch = async () => {
        if (!query) return <p>Invalid input. No such course exists.</p>;

        const searchTerm = query.uppercase().trim()

        Navigate(`./courses/${searchTerm}`)
    }

    return (
        <input 
              type="text" 
              placeholder="Search courses..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
    );
}

export default Redirect