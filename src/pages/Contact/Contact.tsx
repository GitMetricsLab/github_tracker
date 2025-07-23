import { FormEvent, useState } from "react";

function Contact() {
  const [showPopup, setShowPopup] = useState<boolean>(false); // State to control popup visibility

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowPopup(true); // Show the popup after submission
  };

  // Handle closing the popup
  const handleClosePopup = () => {
    setShowPopup(false); // Hide the popup
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white dark:bg-gray-900 text-black dark:text-white">
      <h1 className="text-4xl font-semibold text-center mb-6">Contact Us</h1>

      {/* Contact Methods */}
      <section className="contact-methods grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
        <div className="contact-method bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-md">
          <strong className="text-xl">📞 Phone</strong>
          <p className="mt-2 text-black dark:text-white">(123) 456-7890</p>
        </div>
        <div className="contact-method bg-gray-50 dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg shadow-md">
          <strong className="text-xl">✉️ Email</strong>
          <p className="mt-2 text-black dark:text-white">contact@company.com</p>
        </div>
      </section>

      {/* Contact Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Name
          </label>
          <input
            type="text"
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
            placeholder="Your Name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            Email
          </label>
          <input
            type="email"
           
  className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"

            placeholder="Your Email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black dark:text-white">
            {" "}
            Message
          </label>
          <textarea
            className="mt-1 p-3 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-black dark:text-white"
            rows={4}
            placeholder="Your Message"
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="mt-4 px-6 py-3 w-full bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send Message
          </button>
        </div>
      </form>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-8 rounded-lg shadow-lg w-full sm:w-1/3">
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Message Sent!
            </h2>
            <p className="text-black dark:text-white text-center mb-6">
              Your message has been successfully sent. We will get back to you
              soon.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleClosePopup}
                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contact;
