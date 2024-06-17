import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function StripeConnectPage() {
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate the async operation with a timeout
        setTimeout(async () => {
            try {
                // Mark the Stripe onboarding task as completed
                const { data: tasks } = await axios.get('/tasks');
                const task = tasks.find(t => t.description === 'Sign up to Stripe for payment processing');
                if (task) {
                    await axios.put(`/tasks/${task._id}`, { status: 'completed' });
                }
            } catch (error) {
                console.error('Failed to update task status:', error);
            }
            setIsLoading(false);
            // Redirect back to profile after the simulation
            setTimeout(() => {
                navigate('/account');
            }, 2000);
        }, 2000); // Simulate a delay of 2 seconds for the "API call"
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center mt-4">
                {isLoading ? (
                    <>
                        <h2 className="text-2xl font-semibold">Redirecting to Stripe...</h2>
                        <p>Please wait while we simulate Stripe onboarding.</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-2xl font-semibold">Thank You for Logging into Stripe!</h2>
                        <p>You are now ready to receive payments.</p>
                    </>
                )}
            </div>
        </div>
    );
}
