import { Link } from "react-router-dom";

export default function StatusNav(trip) {
    let status = trip.trip;

    function linkClasses (type=null) {
        let classes = 'inline-flex gap-1 p-2 px-6 rounded-full';
        if(type === status) {
            classes += ' bg-primary text-white';
        } else {
            classes += ' bg-gray-200';
        }
        return classes;
    }

    return (
        <div className="w-full flex justify-center mt-8 gap-2 mb-8">
            <Link className={linkClasses('upcoming')} to={'/account'}>
                Upcoming
            </Link>
            <Link className={linkClasses('trips')} to={'/account/trips'}>
                Unpaid
            </Link>
            <Link className={linkClasses('cars')} to={'/account/cars'}>
                Confirmed
            </Link>
            <Link className={linkClasses('deals')} to={'/account/deals'}>
                Completed
            </Link>
            <Link className={linkClasses('deals')} to={'/account/deals'}>
                Canceled
            </Link>
        </div>
    );
}