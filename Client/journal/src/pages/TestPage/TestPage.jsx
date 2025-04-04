import Header from "../../components/Header/Header";
import TableLearn from "../../components/TableLearn/TableLearn";
import Footer from "../../components/Footer/Footer";
import SpecializationListTable from "../../components/SpecializationList/Specialization";
import StudentsTable from "../../components/StudentsTable/StudentsTable";
import FacultiesTable from "../../components/FacultiesTable/FacultiesTable";
import DepartmentsTable from "../../components/DepartmentsTable/DepartmentsTable";
import UserProfile from "../../components/Profile/Profile";
import StudentProgress from "../../components/StudentProgress/StudentProgress";


const SchedulePage = props => {
    return (
        <>
            <Header/>
            <main>
                {/*<FacultiesTable></FacultiesTable>*/}
                {/*<DepartmentsTable></DepartmentsTable>*/}
                {/*<TableLearn/>*/}
                {/*<StudentsTable/>*/}
                {/*<SpecializationListTable/>*/}
                <StudentProgress/>
            </main>
            <Footer/>
        </>
    )
}
export default SchedulePage;