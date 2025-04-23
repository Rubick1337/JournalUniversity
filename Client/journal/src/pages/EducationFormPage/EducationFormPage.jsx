import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import EducationFormsTable from "../../components/EducationFormsTable/EducationFormsTable";


const EducationFormPage = props => {
    return (
        <>
            <Header/>
            <main>
                <EducationFormsTable/>
            </main>
            <Footer/>
        </>
    )
}
export default EducationFormPage;