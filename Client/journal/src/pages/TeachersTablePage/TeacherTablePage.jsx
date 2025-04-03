import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import TeachersTable from "../../components/TeacherTable/TeachersTable";



const TeacherTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <TeachersTable/>
            </main>
            <Footer/>
        </>
    )
}
export default TeacherTablePage;