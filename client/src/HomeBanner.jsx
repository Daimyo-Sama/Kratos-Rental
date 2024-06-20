import { Link } from "react-router-dom";

const Banner = () => {
    return (
        <div className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white text-center py-20 mb-8 rounded-lg shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-70">
                <img
                    src="https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Banner Background"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="relative z-10">
                <h1 className="text-5xl font-extrabold mb-4">Welcome to Kratos Rental</h1>
                <div className="mt-8">
                    <h2 className="text-2xl mb-2 opacity-0 animate-fadeIn">Tired of fighting interest rates and service fees?</h2>
                    <h2 className="text-2xl mb-2 opacity-0 animate-fadeInDelay1">Simply find your deal and drive away!</h2>
                    <h2 className="text-2xl mb-2 opacity-0 animate-fadeInDelay2">With our lightweight API</h2>
                </div>
                <Link
                    to="/about-us"
                    className="inline-block bg-white text-blue-600 font-bold py-2 px-4 rounded-lg hover:bg-gray-200 transition duration-300 ease-in-out transform hover:-translate-y-1 opacity-0 animate-fadeInDelay3 bg-opacity-50 mt-4"
                >
                    Learn More
                </Link>
            </div>
        </div>
    );
};

export default Banner;
