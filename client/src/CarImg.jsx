import PropTypes from 'prop-types';

export default function CarImg({car,index=0,className=null}) {
    if(!car.photos?.length) {
        return '';
    }
    if(!className) {
        className = 'object-cover';
    }
    return (
        <img className={className} src={'http://localhost:4000/uploads/'+ car.photos[index]} alt="" />
    );
}

CarImg.propTypes = {
    car: PropTypes.shape({
        photos: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    index: PropTypes.number,
    className: PropTypes.string,
};