import Header from "../../components/Header/Header";
import StudentsGroup from "../../components/StudentsGroup/StudentsGroup";
import Footer from "../../components/Footer/Footer";


const GroupListPage = props => {
    return (
        <>
            <Header/>
            <main>
                <StudentsGroup/>
            </main>
            <Footer/>
        </>
    )
}
export default GroupListPage;