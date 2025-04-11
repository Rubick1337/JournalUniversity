import Header from "../../components/Header/Header";
import InfoLesson from "../../components/LessonInfo/LessonInfo";
import Footer from "../../components/Footer/Footer";


const InfoLessonPage = props => {
    return (
        <>
            <Header/>
            <main>
                <InfoLesson/>
            </main>
            <Footer/>
        </>
    )
}
export default InfoLessonPage;