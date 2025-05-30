const Address = () => {
  return (
    <div>
      address
      {Array.from({ length: 50 }).map((_, i) => (
        <div key={i} className="p-4 bg-gray-100 rounded">
          Gợi ý #{i + 1}
        </div>
      ))}
    </div>
  );
};
export default Address;
