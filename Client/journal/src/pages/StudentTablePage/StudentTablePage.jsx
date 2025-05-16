import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import StudentsTable from "../../components/StudentsTable/StudentsTable";



const StudentTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <StudentsTable></StudentsTable>
            </main>
            <Footer/>
        </>
    )
}
export default StudentTablePage;