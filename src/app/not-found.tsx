import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Banner from "@/components/page/banner";
import Card from "@/components/page/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-base">
      <Header />
      <main className="site-container py-12">
        <Banner
          title="404 Music Lounge"
          breadcrumbPage="404"
          description="This page could not be found but you can play Japanese Breakfast"
        />

        <Card
          size="page-full"
          padding="large"
          shadow="soft"
          border="thin"
          delay={0.1}
          className="text-center mt-10"
        >
          <div className="space-y-6">
            <h3 className="">
              Japanese Breakfast – Live on SNL – "Be Sweet" and "Paprika"
            </h3>

            <div className="relative" style={{ paddingTop: "56.25%" }}>
              <iframe
                src="https://fast.wistia.com/embed/iframe/wnod0xd4m4"
                title="Japanese Breakfast – Live on SNL – Be Sweet and Paprika"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                style={{ border: "none" }}
              ></iframe>
            </div>

            <div className="pt-6">
              <Button variant="accent" asChild>
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
