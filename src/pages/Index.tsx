import { Helmet } from "react-helmet-async";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SmartQuizSection from "@/components/home/SmartQuizSection";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import WhyUsSection from "@/components/home/WhyUsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>وسم هوم العقارية | شريكك الموثوق في رحلة البحث عن العقار</title>
        <meta
          name="description"
          content="نساعدك تختار العقار المناسب لك بثقة. استشارة ذكية ومشاريع موثوقة وشفافية كاملة في الرياض وجدة والدمام."
        />
        <meta name="keywords" content="عقارات السعودية, شقق للبيع, فلل للبيع, استثمار عقاري, وسم هوم" />
        <link rel="canonical" href="https://wasmhome.sa" />
      </Helmet>

      <Header />
      
      <main>
        <HeroSection />
        <SmartQuizSection />
        <FeaturedProjects />
        <WhyUsSection />
        <CTASection />
      </main>

      <Footer />
    </>
  );
};

export default Index;
