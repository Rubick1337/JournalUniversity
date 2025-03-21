import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import DepartmentsTable from "../../components/DepartmentsTable/DepartmentsTable";



const DepartamentTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <DepartmentsTable></DepartmentsTable>
            </main>
            <Footer/>
        </>
    )
}
export default DepartamentTablePage;