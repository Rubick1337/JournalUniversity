import Header from "../../components/Header/Header";
import LessonCreationForm from "../../components/LessonCreationForm/LessonCreationForm";
import Footer from "../../components/Footer/Footer";

const InfoLessonPage = (props) => {
  return (
    <>
      <Header />
      <main>
        <LessonCreationForm />
      </main>
      <Footer />
    </>
  );
};
export default InfoLessonPage;
