import Header from "../../components/Header/Header";
import TableLearn from "../../components/TableLearn/TableLearn";
import Footer from "../../components/Footer/Footer";
import SpecializationListTable from "../../components/SpecializationList/Specialization";
import StudentsTable from "../../components/StudentsTable/StudentsTable";
import FacultiesTable from "../../components/FacultiesTable/FacultiesTable";
import DepartmentsTable from "../../components/DepartmentsTable/DepartmentsTable";
import UserProfile from "../../components/Profile/Profile";
import StudentProgress from "../../components/StudentProgress/StudentProgress";
import CreateLessonForm from "../../components/CreateLessonForm/CreateLessonForm";
import ContactsTable from "../../components/ContactsTable/ContactsTable";
import TeacherPositionsTable from "../../components/TeachingPositionTable/TeachingPositionTable";
import Routers from "../../components/Routers/Routers";
import PersonTable from "../../components/PersonTable/PersonTable";
import WorkPrograming from "../../components/WorkPrograming/WorkProgramingTable";
import CurriculumsTable from "../../components/CurriculumsTable/CurriculumsTable";
import TopicsTable from "../../components/TopicsTable/TopicsTable";
import StudentJournal from "../../components/StudentJournal/StudentJournal";
import StudentLabsCardView from "../../components/TopicGrade/StudentLabsCardView";


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
                {/*<ContactsTable/>*/}
                {/*{<TeacherPositionsTable/>}*/}
                {/*{<PersonTable></PersonTable>}*/}
                {/*{<CurriculumsTable></CurriculumsTable>}*/}
                {/*{<TopicsTable/>}*/}
                {/*{<StudentJournal/>}*/}
                {<StudentLabsCardView></StudentLabsCardView>}
            </main>
            <Footer/>
        </>
    )
}
export default SchedulePage;