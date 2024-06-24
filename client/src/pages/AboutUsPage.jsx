import React from "react";

export default function AboutUs() {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="bg-white p-8 m-4 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Welcome to Kratos Rental</h1>
                
                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">User Guide</h2>
                    <div className="flex flex-col md:flex-row">
                        <aside className="flex-1 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
                            <p className="text-lg mb-4">
                                Here’s a comprehensive guide to help you navigate and make the most of our app:
                            </p>
                            <ol className="list-decimal list-inside text-lg space-y-2 pl-4">
                                <li>Navigate to the <span className="font-semibold text-indigo-500">Home Page</span> to see available cars.</li>
                                <li>Use the <span className="font-semibold text-indigo-500">Search Bar</span> to filter cars by location, date, and other preferences.</li>
                                <li>Click on a car to view more details, including pricing and availability.</li>
                                <li>To rent a car, click the <span className="font-semibold text-indigo-500">Rent Now</span> button and follow the prompts to complete your booking.</li>
                                <li>Check your <span className="font-semibold text-indigo-500">Account Page</span> for booking details and to manage your rentals.</li>
                            </ol>
                        </aside>
                        <aside className="flex-shrink-0 md:ml-8 bg-gray-300 p-4 rounded-lg">
                            <img src="path/to/user-guide-image.jpg" alt="User Guide" className="rounded-lg shadow-lg" />
                            <img src="path/to/user-guide-image.jpg" alt="User Guide" className="rounded-lg shadow-lg" />
                            <img src="path/to/user-guide-image.jpg" alt="User Guide" className="rounded-lg shadow-lg" />
                        </aside>
                    </div>
                </section>

                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Profile Page Guide</h2>
                    <div className="flex flex-col md:flex-row">
                        <aside className="flex-1 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
                            <p className="text-lg mb-4">
                                Your profile page is your personal space within Kratos Rental. Here’s how to use it:
                            </p>
                            <ol className="list-decimal list-inside text-lg space-y-2 pl-4">
                                <li>
                                    <span className="font-semibold text-indigo-500">Update Your Bio</span>: Click the <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">Update Bio</span> button to add or modify your bio.
                                </li>
                                <li>
                                    <span className="font-semibold text-indigo-500">Upload a Profile Picture</span>: Use the <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">Update Profile Picture</span> section to upload a new picture.
                                </li>
                                <li>
                                    <span className="font-semibold text-indigo-500">View and Complete Tasks</span>: Check the tasks assigned to you and mark them as completed to unlock more features.
                                </li>
                            </ol>
                        </aside>
                        <aside className="flex-shrink-0 md:ml-8 bg-gray-300 p-4 rounded-lg">
                            <img src="path/to/profile-page-guide-image.jpg" alt="Profile Page Guide" className="rounded-lg shadow-lg" />
                            <img src="path/to/profile-page-guide-image.jpg" alt="Profile Page Guide" className="rounded-lg shadow-lg" />
                            <img src="path/to/profile-page-guide-image.jpg" alt="Profile Page Guide" className="rounded-lg shadow-lg" />
                        </aside>
                    </div>

                    <div className="bg-gray-400 p-6 mt-8 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-indigo-500">Become a Host</h3>
                        <div className="flex flex-col md:flex-row">
                            <aside className="flex-1 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
                                <p className="text-lg mb-4">
                                    If you want to list your cars for rent and manage them, here’s how to get started:
                                </p>
                                <ol className="list-decimal list-inside text-lg space-y-2 pl-4">
                                    <li>
                                        <span className="font-semibold text-indigo-500">Become an Owner</span>: Click the <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">Become an Owner</span> button in your profile page to start listing your cars.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-indigo-500">Manage Your Rentals</span>: Once you’re an owner, use the <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">Manage Your Cars</span> section in your profile to view and manage your car listings.
                                    </li>
                                </ol>
                            </aside>
                            <aside className="flex-shrink-0 md:ml-8 bg-gray-500 p-4 rounded-lg">
                                <img src="path/to/become-host-image.jpg" alt="Become a Host" className="rounded-lg shadow-lg" />
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Documentation</h2>
                    <div className="flex flex-col md:flex-row">
                        <aside className="flex-1 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
                            <p className="text-lg mb-4">
                                Our app leverages the MERN stack to provide a seamless and efficient car rental experience:
                            </p>
                            <ul className="list-disc list-inside text-lg space-y-2 pl-4">
                                <li>Frontend: Built with React for a dynamic and responsive user interface.</li>
                                <li>Styling: Tailwind CSS for utility-first, easily customizable styles.</li>
                                <li>Backend: Node.js with Express for handling server-side logic and APIs.</li>
                                <li>Database: MongoDB for flexible and scalable data management.</li>
                                <li>Authentication: Implemented with JWT to ensure secure user sessions.</li>
                                <li>Payment Processing: Integrated with PayPal Sandbox SDK and API for secure transactions.</li>
                            </ul>
                        </aside>
                        <aside className="flex-shrink-0 md:ml-8 bg-gray-300 p-4 rounded-lg">
                            <div className="grid grid-cols-3 gap-4">
                                <img src="path/to/react-icon.png" alt="React" className="w-12 h-12" />
                                <img src="path/to/tailwind-icon.png" alt="Tailwind CSS" className="w-12 h-12" />
                                <img src="path/to/nodejs-icon.png" alt="Node.js" className="w-12 h-12" />
                                <img src="path/to/express-icon.png" alt="Express" className="w-12 h-12" />
                                <img src="path/to/mongodb-icon.png" alt="MongoDB" className="w-12 h-12" />
                                <img src="path/to/paypal-icon.png" alt="PayPal" className="w-12 h-12" />
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Credits</h2>
                    <p className="text-lg mb-4">
                        The Team:
                    </p>
                    <ul className="list-disc list-inside text-lg space-y-2 pl-4">
                        <li>
                            Wasim Bessaou - Aka - Daimyo
                            <ul className="list-none pl-4">
                                <li><a href="https://github.com/wasim" className="text-blue-500">GitHub</a></li>
                                <li><a href="https://linkedin.com/in/wasim" className="text-blue-500">LinkedIn</a></li>
                            </ul>
                        </li>
                        <li>
                            Steve - Aka - LegendRambo
                            <ul className="list-none pl-4">
                                <li><a href="https://github.com/steve" className="text-blue-500">GitHub</a></li>
                                <li><a href="https://linkedin.com/in/steve" className="text-blue-500">LinkedIn</a></li>
                            </ul>
                        </li>
                        <li>
                            Alex
                            <ul className="list-none pl-4">
                                <li><a href="https://github.com/alex" className="text-blue-500">GitHub</a></li>
                                <li><a href="https://linkedin.com/in/alex" className="text-blue-500">LinkedIn</a></li>
                            </ul>
                        </li>
                        <li>Open source libraries and frameworks that powered our development.</li>
                        <li>Our team members for their dedication and hard work.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
