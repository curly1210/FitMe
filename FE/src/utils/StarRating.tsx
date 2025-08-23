// import { GoStarFill } from "react-icons/go";
import { BsStar, BsStarFill, BsStarHalf } from "react-icons/bs";

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;

  return (
    <div className="flex space-x-1 text-red-500">
      {Array.from({ length: totalStars }).map((_, index) => {
        const starValue = index + 1;

        if (rating >= starValue) {
          // ⭐ full star
          return <BsStarFill key={index} className="text-red-500" />;
        } else if (rating >= starValue - 0.5) {
          // ⭐ half star
          return <BsStarHalf key={index} className="text-red-500" />;
        } else {
          // ☆ empty star
          return <BsStar key={index} className="text-red-500" />;
        }
      })}
      {/* {Array.from({ length: totalStars }).map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <BsStarFill className="text-red-500" />
          ) : (
            <BsStar className="text-red-500" />
          )}
        </span>
      ))} */}
    </div>
  );
};
export default StarRating;
