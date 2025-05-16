import Header from "../../components/Header/Header";
import LessonInformation from "../../components/LessonInformation/LessonInformation";
import Footer from "../../components/Footer/Footer";

const LessonInformationPage = (props) => {
  return (
    <>
      <Header />
      <main>
        <LessonInformation />
      </main>
      <Footer />
    </>
  );
};
export default LessonInformationPage;
