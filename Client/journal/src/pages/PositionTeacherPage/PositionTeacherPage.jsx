import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import TeachingPositionTable from "../../components/TeachingPositionTable/TeachingPositionTable";



const PositionTeacherPage = () => {
    return (
        <>
            <Header/>
            <main>
                <TeachingPositionTable></TeachingPositionTable>
            </main>
            <Footer/>
        </>
    )
}
export default PositionTeacherPage;