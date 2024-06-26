import React from "react";

export default function AboutUs() {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="bg-white p-8 m-4 rounded-lg shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">Welcome to Kratos Rental</h1>
                
                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">User Guide</h2>
                    <div className="flex flex-col md:flex-row">
                        <aside className="flex-1 w-1/2 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
                            <p className="text-lg mb-4">
                                Here’s a comprehensive guide to help you navigate and make the most of our app:
                            </p>
                            <ol className="list-decimal list-inside text-lg space-y-2 pl-4">
                                <li>Click on the Account button in the top right to navigate to the Login page.</li>
                                <li>Register if you haven't yet! Then check your email and click on the link to verify your account.</li>
                                <li>Once logged in, you should update your profile through the Account button, notice that it now has your name on it!</li>
                                <li>Check out the <span className="font-semibold text-indigo-500">My Trips</span> button, this will be the place where you will find your trips.</li>
                                <li>Navigate to the <span className="font-semibold text-indigo-500">Home Page</span> at any time by clicking on our logo in the top left.</li>
                                <li>From the Home Page, use the <span className="font-semibold text-indigo-500">Search Bar</span> to filter cars by location.</li>
                                <li>Click on a car to view more details, including reviews, pricing, and availability.</li>
                                <li>To rent a car, set your availability through the calendar and click on the <span className="font-semibold text-indigo-500">Book this car</span> button to complete your booking.</li>
                                <li>You can now find your trip in <span className="font-semibold text-indigo-500">My Trips</span>.</li>
                                <li>Wait for the owner to confirm! You will see the status update accordingly.</li>
                                <li>If you click on your trip, you can get full details on your booking.</li>
                                <li>When the trip is accepted by the owner, you will see this payment button appear.</li>
                                <li>Once the payment goes through, your trip status will be updated to confirmed, and the deal is done!</li>
                                <li>You can now leave a comment about your experience to help other users make a choice!</li>
                                <li>Please note that you are free to cancel at any point before the trip.</li>
                                <li>When you cancel a trip, you can archive it to keep your dashboard clean!</li>
                            </ol>
                        </aside>
                        <aside className="flex-shrink-0 md:ml-8 bg-gray-300 p-4 rounded-lg flex flex-wrap gap-4 w-1/2">
  <img
    src="http://localhost:4000/uploads/account-button.png"
    alt="Account Button"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/register.png"
    alt="Register"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/account-button-2.png"
    alt="Account Button 2"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/kratos-button.png"
    alt="Kratos Button"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/my-trips-result.png"
    alt="My Trips Result"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/search-bar.png"
    alt="Search Bar"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/search-bar-result.png"
    alt="Search Bar Result"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/booking.png"
    alt="Booking"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/status-update.png"
    alt="Status Update"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/user-guide-image3.jpg"
    alt="Comment Form"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
  <img
    src="http://localhost:4000/uploads/user-guide-image3.jpg"
    alt="Archive"
    className="rounded-lg shadow-lg mb-4 border border-gray-400 h-40 w-auto"
  />
</aside>


                    </div>
                </section>

                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Profile Page Guide</h2>
                    <div className="flex flex-col md:flex-row">
                        <aside className="flex-1 max-w-1/2 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
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
                                    <span className="font-semibold text-indigo-500">My Trips</span>: From the profile page, you can easily navigate between tabs to manage your account.
                                </li>
                            </ol>
                        </aside>
                        <aside className="flex-shrink-0 md:ml-8 bg-gray-300 p-4 rounded-lg max-w-1/2">
                            <img src="http://localhost:4000/uploads/profile-page-guide-image1.jpg" alt="Profile Page Guide" className="rounded-lg shadow-lg mb-4 border border-gray-400" />
                            <img src="http://localhost:4000/uploads/profile-page-guide-image2.jpg" alt="Profile Page Guide" className="rounded-lg shadow-lg mb-4 border border-gray-400" />
                            <img src="http://localhost:4000/uploads/profile-page-guide-image3.jpg" alt="Profile Page Guide" className="rounded-lg shadow-lg mb-4 border border-gray-400" />
                        </aside>
                    </div>

                    <div className="bg-gray-400 p-6 mt-8 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 text-indigo-500">Become a Host</h3>
                        <div className="flex flex-col md:flex-row">
                            <aside className="flex-1 max-w-1/2 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
                                <p className="text-lg mb-4">
                                    If you want to list your cars for rent and manage them, here’s how to get started:
                                </p>
                                <ol className="list-decimal list-inside text-lg space-y-2 pl-4">
                                    <li>
                                        <span className="font-semibold text-indigo-500">Become an Owner</span>: Click the <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">Become an Owner</span> button in your profile page to unlock the hidden task.
                                    </li>
                                    <li>
                                        Click on the link to sign up with PayPal! Once you have an account, enter your PayPal email to complete the task!
                                    </li>
                                    <li>
                                        <span className="font-semibold text-indigo-500">Manage Your Rentals</span>: Notice the new tabs above your Profile Picture, you can now use <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">My Cars</span> to view and manage your car listings.
                                    </li>
                                    <li>
                                        Once you create a listing, incoming offers will be visible through <span className="primary hover:bg-blue-700 text-white bg-indigo-500 rounded px-2 py-1">My Deals</span>, where you can cancel or confirm. If you click on the deal, you can see further details and the client reviews.
                                    </li>
                                </ol>
                            </aside>
                            <aside className="flex-shrink-0 md:ml-8 bg-gray-500 p-4 rounded-lg max-w-1/2">
                                <img src="http://localhost:4000/uploads/become-host-image1.jpg" alt="Become a Host" className="rounded-lg shadow-lg mb-4 border border-gray-400" />
                            </aside>
                        </div>
                    </div>
                </section>

                <section className="mb-8 bg-gray-200 p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4 text-indigo-500">Documentation</h2>
                    <div className="flex flex-col md:flex-row">
                        <aside className="flex-1 max-w-1/2 bg-blue-50 p-4 rounded-lg mb-4 md:mb-0">
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
                        <aside className="flex-shrink-0 md:ml-8 bg-gray-300 p-4 rounded-lg max-w-1/2">
                            <div className="flex flex-col gap-4 items-center">
                                <img src="http://localhost:4000/uploads/express-icon.png" alt="Express" className="w-auto h-12 border border-gray-400 rounded-lg shadow-lg" />
                                <img src="http://localhost:4000/uploads/nodejs-icon.png" alt="Node.js" className="w-auto h-12 border border-gray-400 rounded-lg shadow-lg" />
                                <img src="http://localhost:4000/uploads/react-icon.png" alt="React" className="w-auto h-12 border border-gray-400 rounded-lg shadow-lg" />
                                <img src="http://localhost:4000/uploads/tailwind-icon.png" alt="Tailwind CSS" className="w-auto h-12 border border-gray-400 rounded-lg shadow-lg" />
                                <img src="http://localhost:4000/uploads/mongo-icon.png" alt="MongoDB" className="w-auto h-12 border border-gray-400 rounded-lg shadow-lg" />
                                <img src="http://localhost:4000/uploads/paypal-icon.png" alt="PayPal" className="w-auto h-12 border border-gray-400 rounded-lg shadow-lg" />
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
