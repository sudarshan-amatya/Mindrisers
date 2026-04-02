import { useState } from "react";

function SubmitButton() {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);

        try {
            await fetch("https://api.example.com/submit");
            // success logic
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    function LoadingPopup() {
        return (
            <div style={overlayStyle}>
                <div style={popupStyle}>
                    <div className="spinner" />
                    <p>Loading, please wait...</p>
                </div>
            </div>
        );
    }

    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
    };

    const popupStyle = {
        background: "#fff",
        padding: "20px 30px",
        borderRadius: "8px",
        textAlign: "center",
    };

    return (
        <>
            <button onClick={handleClick} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {loading && <LoadingPopup />}
        </>
    );
}

export default SubmitButton;
