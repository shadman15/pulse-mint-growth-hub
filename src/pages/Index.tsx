import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";

// Add any necessary imports or component definitions here

const Index = () => {
  const [showBookingForm, setShowBookingForm] = React.useState(false);

  return (
    <div className="p-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Pulse Mint Growth Hub</h1>
        <p className="mb-8 text-lg text-gray-600">
          Empowering creators with personalized AI solutions.
        </p>
        <Button onClick={() => setShowBookingForm(true)}>
          <CalendarDays className="mr-2 h-4 w-4" />
          Book a Discovery Call
        </Button>
      </div>

      {showBookingForm && (
        <div className="mt-10 border p-6 rounded-lg shadow-md bg-white max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Discovery Call Form</h2>
          <form>
            {/* Add form inputs here */}
            <input
              type="text"
              placeholder="Your Name"
              className="w-full p-2 border mb-4 rounded"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full p-2 border mb-4 rounded"
            />
            <textarea
              placeholder="What do you want to build?"
              className="w-full p-2 border mb-4 rounded"
            ></textarea>
            <Button type="submit">Submit</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Index;
