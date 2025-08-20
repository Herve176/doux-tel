

export default function Footer() {
  return (
    <footer className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <p>&copy; 2023 My E-commerce Store</p>
        <div className="flex space-x-4">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Contact Us</a>
        </div>
    </footer>
  );
}
