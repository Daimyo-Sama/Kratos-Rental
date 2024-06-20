import React from "react";

export default function AboutUs() {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="bg-white p-8 m-4 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-8">For our Users</h1>
                
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
                    <p className="text-lg mb-4">
                        Welcome to Kratos Rental! Here’s a guide on how to use our app:
                    </p>
                    <ol className="list-decimal list-inside text-lg space-y-2">
                        <li>Navigate to the home page to see available cars.</li>
                        <li>Use the search bar to filter cars by location, date, and other preferences.</li>
                        <li>Click on a car to view more details, including pricing and availability.</li>
                        <li>To rent a car, click the "Rent Now" button and follow the prompts to complete your booking.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>
                        <li>Check your account page for booking details and to manage your rentals.</li>

                    </ol>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
                    <p className="text-lg mb-4">
                        Our app leverages MERN stack model to provide a seamless and efficient car rental experience:
                    </p>
                    <ul className="list-disc list-inside text-lg space-y-2">
                        <li>Frontend: Built with React for a dynamic and responsive user interface.</li>
                        <li>Styling: Tailwind CSS for utility-first, easily customizable styles.</li>
                        <li>Backend: Node.js with Express for handling server-side logic and APIs.</li>
                        <li>Database: MongoDB for flexible and scalable data management.</li>
                        <li>Authentication: Implemented with JWT to ensure secure user sessions.</li>
                        <li>Payment Processing: Integrated with PayPal Sandbox SDK and API for secure transactions.</li>
                    </ul>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Credits</h2>
                    <p className="text-lg">
                        The Team :
                    </p>
                    <ul className="list-disc list-inside text-lg space-y-2">
                        <li>Wasim Bessaou - Aka - Daimyo</li>
                        <li>Steve - Aka - LegendRambo</li>
                        <li>Alex</li>
                        <li></li>
                        <li></li>
                        <li>Open source libraries and frameworks that powered our development.</li>
                        <li>Our team members for their dedication and hard work.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
