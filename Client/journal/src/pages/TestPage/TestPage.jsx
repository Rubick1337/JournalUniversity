import Header from "../../components/Header/Header";
import TableLearn from "../../components/TableLearn/TableLearn";
import Footer from "../../components/Footer/Footer";
import SpecializationListTable from "../../components/SpecializationList/Specialization";
import StudentsTable from "../../components/StudentsTable/StudentsTable";
import FacultiesTable from "../../components/FacultiesTable/FacultiesTable";
import DepartmentsTable from "../../components/DepartmentsTable/DepartmentsTable";


const SchedulePage = props => {
    return (
        <>
            <Header/>
            <main>
                {/*<FacultiesTable></FacultiesTable>*/}
                <DepartmentsTable></DepartmentsTable>
                {/*<TableLearn/>*/}
                {/*<StudentsTable/>*/}
                {/*<SpecializationListTable/>*/}
            </main>
            <Footer/>
        </>
    )
}
export default SchedulePage;