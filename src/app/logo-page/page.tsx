import Header from "@/components/layout/Header";
import LogoPage from "./LogoPage";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About the Logo | Chris Lane Jones — Dev & Hiker",
  description:
    "Exploring the design and meaning behind the mountain logo - a symbol of the journey through code and trails.",
};

export default function Logo() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <LogoPage />
      <Footer />
    </div>
  );
}
