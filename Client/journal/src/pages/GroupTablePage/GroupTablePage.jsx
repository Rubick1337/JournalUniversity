import Header from "../../components/Header/Header";
import StudentsGroup from "../../components/StudentsGroup/StudentsGroup";
import Footer from "../../components/Footer/Footer";
import GroupsTable from "../../components/GroupsTable/GroupsTable";


const GroupTablePage = props => {
    return (
        <>
            <Header/>
            <main>
                <GroupsTable/>
            </main>
            <Footer/>
        </>
    )
}
export default GroupTablePage;