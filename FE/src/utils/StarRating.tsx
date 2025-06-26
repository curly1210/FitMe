import { GoStar, GoStarFill } from "react-icons/go";

const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;

  return (
    <div className="flex space-x-1 text-yellow-400">
      {Array.from({ length: totalStars }).map((_, index) => (
        <span key={index}>
          {index < rating ? (
            <GoStarFill className="text-red-500" />
          ) : (
            <GoStar className="text-red-500" />
          )}
        </span>
      ))}
    </div>
  );
};
export default StarRating;
