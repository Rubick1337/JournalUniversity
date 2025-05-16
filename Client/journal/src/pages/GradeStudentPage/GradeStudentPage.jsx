import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import StudentTopicsView from "../../components/TopicGrade/StudentLabsCardView";

const GradeStudentPage = () => {
    return (
        <>
            <Header />
            <main>
                <StudentTopicsView></StudentTopicsView>
            </main>
            <Footer />
        </>
    );
};
export default GradeStudentPage;
